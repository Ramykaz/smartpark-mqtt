"""Unit and integration tests for simulators.slot_simulator."""

import json
import os
import re
import socket
import sys
import threading
import time
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock, Mock, patch

import paho.mqtt.client as mqtt

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from simulators.slot_simulator import SlotSimulator


class TestSlotSimulatorCore(unittest.TestCase):
    def test_constructor_parameters_and_defaults(self):
        sim = SlotSimulator(slot_id="slot_01")

        self.assertEqual(sim.slot_id, "slot_01")
        self.assertEqual(sim.broker_host, "localhost")
        self.assertEqual(sim.broker_port, 1883)
        self.assertEqual(sim.qos, 0)
        self.assertEqual(sim.min_hold_times, {"FREE": 5, "OCCUPIED": 10})
        self.assertEqual(sim.transition_interval, 1.0)
        self.assertEqual(sim.mode, "random")
        self.assertEqual(sim._state, "FREE")

    def test_msg_id_format_and_increment(self):
        sim = SlotSimulator(slot_id="A1")
        self.assertEqual(sim._next_msg_id(), "A1-0001")
        self.assertEqual(sim._next_msg_id(), "A1-0002")
        self.assertEqual(sim._next_msg_id(), "A1-0003")

    def test_fsm_min_hold_times_in_alternate_mode(self):
        sim = SlotSimulator(slot_id="slot_fsm", mode="alternate")

        sim._state = "FREE"
        sim._state_entered_at = time.time() - 4.9
        sim._maybe_transition_state()
        self.assertEqual(sim._state, "FREE")

        sim._state_entered_at = time.time() - 5.1
        sim._maybe_transition_state()
        self.assertEqual(sim._state, "OCCUPIED")

        sim._state_entered_at = time.time() - 9.9
        sim._maybe_transition_state()
        self.assertEqual(sim._state, "OCCUPIED")

        sim._state_entered_at = time.time() - 10.1
        sim._maybe_transition_state()
        self.assertEqual(sim._state, "FREE")

    def test_publish_loop_order_wait_then_transition_build_publish(self):
        sim = SlotSimulator(slot_id="slot_loop", mode="alternate")
        events: list[str] = []

        class ControlledEvent:
            def __init__(self) -> None:
                self.wait_count = 0

            def is_set(self) -> bool:
                return False

            def wait(self, timeout: float) -> bool:
                _ = timeout
                events.append("wait")
                self.wait_count += 1
                return self.wait_count >= 2

        sim._stop_event = ControlledEvent()  # type: ignore[assignment]
        sim._maybe_transition_state = lambda: events.append("transition")  # type: ignore[assignment]
        sim._build_payload = lambda: events.append("build") or {"msg_id": "slot_loop-0001"}  # type: ignore[assignment]
        sim._publish = lambda payload: events.append("publish")  # type: ignore[assignment]

        sim._run_loop()

        self.assertEqual(events, ["wait", "transition", "build", "publish", "wait"])

    def test_publish_uses_topic_json_and_qos(self):
        sim = SlotSimulator(slot_id="77", qos=1)
        client = Mock()
        client.publish.return_value = SimpleNamespace(mid=42)
        sim._client = client

        payload = {
            "msg_id": "77-0001",
            "slot_id": "77",
            "state": "FREE",
            "sent_ts": time.time(),
        }
        sim._publish(payload)

        client.publish.assert_called_once()
        topic, json_payload = client.publish.call_args.args[:2]
        qos_value = client.publish.call_args.kwargs.get("qos")

        self.assertEqual(topic, "parking/telemetry/77")
        self.assertEqual(qos_value, 1)
        parsed = json.loads(json_payload)
        self.assertEqual(parsed["msg_id"], "77-0001")
        self.assertEqual(parsed["slot_id"], "77")
        self.assertIn(parsed["state"], {"FREE", "OCCUPIED"})
        self.assertIsInstance(parsed["sent_ts"], (int, float))

    def test_publish_logs_once_per_publish_when_logger_is_injected(self):
        logger = MagicMock()
        sim = SlotSimulator(slot_id="77", qos=1, logger=logger)
        client = Mock()
        client.publish.return_value = SimpleNamespace(mid=42)
        sim._client = client

        payload = {
            "msg_id": "77-0001",
            "slot_id": "77",
            "state": "FREE",
            "sent_ts": time.time(),
        }
        sim._publish(payload)

        logger.log.assert_called_once()
        event = logger.log.call_args.args[0]
        self.assertEqual(event.msg_id, "77-0001")
        self.assertEqual(event.slot_id, "77")
        self.assertEqual(event.state, "FREE")
        self.assertEqual(event.sent_ts, payload["sent_ts"])
        self.assertEqual(event.recv_ts, 0)
        self.assertEqual(event.qos, 1)
        self.assertEqual(event.raw_topic, "parking/telemetry/77")

    def test_on_publish_logs_msg_id_and_clears_pending(self):
        sim = SlotSimulator(slot_id="slot_cb")
        sim._pending_mid_to_msg_id[7] = "slot_cb-0001"

        with patch("builtins.print") as mock_print:
            sim.on_publish(client=Mock(), userdata=None, mid=7)

        self.assertNotIn(7, sim._pending_mid_to_msg_id)
        mock_print.assert_called_once_with("[slot slot_cb] published slot_cb-0001")

    def test_start_stop_clean_shutdown_with_event(self):
        sim = SlotSimulator(slot_id="slot_shutdown")
        sim._client = Mock()

        def fake_run_loop() -> None:
            sim._stop_event.wait(0.2)

        sim._run_loop = fake_run_loop  # type: ignore[assignment]

        sim.start()
        self.assertTrue(sim._thread is not None and sim._thread.is_alive())

        sim.stop()

        self.assertTrue(sim._stop_event.is_set())
        self.assertFalse(sim._thread is not None and sim._thread.is_alive())
        sim._client.connect.assert_called_once()
        sim._client.loop_start.assert_called_once()
        sim._client.loop_stop.assert_called_once()
        sim._client.disconnect.assert_called_once()


class TestSlotSimulatorIntegration(unittest.TestCase):
    def _broker_available(self, host: str = "localhost", port: int = 1883) -> bool:
        try:
            with socket.create_connection((host, port), timeout=1.0):
                return True
        except OSError:
            return False

    def test_one_simulator_10s_json_arrives_at_broker(self):
        if not self._broker_available():
            self.skipTest("MQTT broker not available on localhost:1883")

        slot_id = f"testslot_{int(time.time())}"
        topic = f"parking/telemetry/{slot_id}"
        received: list[dict] = []
        lock = threading.Lock()

        subscriber = mqtt.Client()

        def on_message(client: mqtt.Client, userdata, msg: mqtt.MQTTMessage) -> None:
            _ = client, userdata
            payload = json.loads(msg.payload.decode("utf-8"))
            with lock:
                received.append({"topic": msg.topic, "payload": payload})

        subscriber.on_message = on_message
        subscriber.connect("localhost", 1883)
        subscriber.subscribe(topic, qos=1)
        subscriber.loop_start()

        simulator = SlotSimulator(slot_id=slot_id, qos=1, transition_interval=1.0, mode="alternate")

        try:
            simulator.start()
            time.sleep(10.0)
            simulator.stop()
            time.sleep(0.5)
        finally:
            subscriber.loop_stop()
            subscriber.disconnect()

        self.assertGreaterEqual(len(received), 8)

        counters: list[int] = []
        seen_states: set[str] = set()
        pattern = re.compile(rf"^{re.escape(slot_id)}-(\d{{4}})$")

        for item in received:
            msg = item["payload"]
            self.assertEqual(item["topic"], topic)
            self.assertSetEqual(set(msg.keys()), {"msg_id", "slot_id", "state", "sent_ts"})
            self.assertEqual(msg["slot_id"], slot_id)
            self.assertIn(msg["state"], {"FREE", "OCCUPIED"})
            self.assertIsInstance(msg["sent_ts"], (int, float))

            match = pattern.match(msg["msg_id"])
            self.assertIsNotNone(match)
            counters.append(int(match.group(1)))
            seen_states.add(msg["state"])

        self.assertIn("FREE", seen_states)
        self.assertIn("OCCUPIED", seen_states)

        self.assertEqual(counters, sorted(counters))
        self.assertEqual(counters[0], 1)
        self.assertEqual(counters, list(range(1, len(counters) + 1)))


if __name__ == "__main__":
    unittest.main()
