"""Slot simulator publisher for SmartPark MQTT."""

from __future__ import annotations

import json
import random
import threading
import time
from typing import Any

import paho.mqtt.client as mqtt


class SlotSimulator:
	"""Publishes parking slot telemetry with a simple FREE/OCCUPIED FSM."""

	def __init__(
		self,
		slot_id: str,
		broker_host: str = "localhost",
		broker_port: int = 1883,
		qos: int = 0,
		min_hold_times: dict[str, int] = {"FREE": 5, "OCCUPIED": 10},
		transition_interval: float = 1.0,
		mode: str = "random",
	) -> None:
		self.slot_id = slot_id
		self.broker_host = broker_host
		self.broker_port = broker_port
		self.qos = qos
		self.min_hold_times = dict(min_hold_times)
		self.transition_interval = transition_interval
		self.mode = mode

		self._state = "FREE"
		self._state_entered_at = time.time()
		self._message_counter = 0
		self._stop_event = threading.Event()
		self._thread: threading.Thread | None = None
		self._pending_mid_to_msg_id: dict[int, str] = {}

		self._client = mqtt.Client()
		self._client.on_publish = self.on_publish

	@property
	def topic(self) -> str:
		"""Telemetry topic for this slot."""
		return f"parking/telemetry/{self.slot_id}"

	def start(self) -> None:
		"""Connect to broker and start the publish loop thread."""
		if self._thread and self._thread.is_alive():
			return

		self._stop_event.clear()
		self._client.connect(self.broker_host, self.broker_port)
		self._client.loop_start()

		self._thread = threading.Thread(target=self._run_loop, name=f"slot-{self.slot_id}", daemon=True)
		self._thread.start()

	def stop(self) -> None:
		"""Stop publish loop and disconnect cleanly from broker."""
		self._stop_event.set()

		if self._thread and self._thread.is_alive():
			self._thread.join(timeout=5)

		self._client.loop_stop()
		self._client.disconnect()

	def on_publish(self, client: mqtt.Client, userdata: Any, mid: int, reason_code: Any = None, properties: Any = None) -> None:
		"""MQTT publish callback that logs the matching message id."""
		_ = client, userdata, reason_code, properties
		msg_id = self._pending_mid_to_msg_id.pop(mid, "unknown")
		print(f"[slot {self.slot_id}] published {msg_id}")

	def _run_loop(self) -> None:
		while not self._stop_event.is_set():
			if self._stop_event.wait(self.transition_interval):
				break

			self._maybe_transition_state()
			payload = self._build_payload()
			self._publish(payload)

	def _maybe_transition_state(self) -> None:
		now = time.time()
		min_hold = float(self.min_hold_times.get(self._state, 0))
		held_for = now - self._state_entered_at

		if held_for < min_hold:
			return

		if self.mode == "random":
			should_switch = random.choice([True, False])
		else:
			should_switch = True

		if should_switch:
			previous = self._state
			self._state = "OCCUPIED" if self._state == "FREE" else "FREE"
			self._state_entered_at = now
			print(f"[slot {self.slot_id}] state {previous} -> {self._state}")

	def _next_msg_id(self) -> str:
		self._message_counter += 1
		return f"{self.slot_id}-{self._message_counter:04d}"

	def _build_payload(self) -> dict[str, Any]:
		msg_id = self._next_msg_id()
		return {
			"msg_id": msg_id,
			"slot_id": self.slot_id,
			"state": self._state,
			"sent_ts": time.time(),
		}

	def _publish(self, payload: dict[str, Any]) -> None:
		result = self._client.publish(self.topic, json.dumps(payload), qos=self.qos)
		self._pending_mid_to_msg_id[result.mid] = payload["msg_id"]


if __name__ == "__main__":
	simulator = SlotSimulator(slot_id="1")
	simulator.start()
	try:
		time.sleep(10)
	finally:
		simulator.stop()
