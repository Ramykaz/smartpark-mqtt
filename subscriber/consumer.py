from __future__ import annotations

import json
import time
from collections.abc import Callable
from typing import Any

import paho.mqtt.client as mqtt

from shared.protocol import BROKER_HOST, BROKER_PORT, Event, TELEMETRY_WILDCARD


class MQTTConsumer:
    def __init__(
        self,
        broker_host: str = BROKER_HOST,
        broker_port: int = BROKER_PORT,
        on_event: Callable[[Event], None] | None = None,
    ) -> None:
        self.broker_host = broker_host
        self.broker_port = broker_port
        self.on_event = on_event or (lambda event: None)
        self._client = mqtt.Client()
        self._client.on_message = self.on_message

    def connect(self) -> None:
        self._client.connect(self.broker_host, self.broker_port)
        self._client.subscribe(TELEMETRY_WILDCARD, qos=0)
        self._client.loop_start()

    def disconnect(self) -> None:
        self._client.loop_stop()
        self._client.disconnect()

    def on_message(self, client: mqtt.Client, userdata: Any, msg: mqtt.MQTTMessage) -> None:
        recv_ts = time.time_ns() // 1_000_000
        _ = client, userdata
        payload = json.loads(msg.payload)
        event = Event(
            slot_id=payload["slot_id"],
            state=payload["state"],
            msg_id=payload["msg_id"],
            sent_ts=payload["sent_ts"],
            recv_ts=recv_ts,
            qos=payload.get("qos", 0),
            raw_topic=msg.topic,
        )
        self.on_event(event)
