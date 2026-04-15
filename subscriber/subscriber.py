"""ParkingSubscriber — MQTT subscriber that persists all telemetry to SQLite.

Subscribes to TELEMETRY_WILDCARD, records recv_ts on arrival, detects
duplicates via msg_id, and writes rows to the messages table using
MESSAGES_INSERT from shared.protocol. Also listens on SUMMARY_TOPIC and
ALERT_TOPIC for system-wide events.

Implementation coming in Day 1.
"""
