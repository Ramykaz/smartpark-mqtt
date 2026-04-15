"""SlotSimulator — MQTT publisher representing a single parking slot.

Publishes state transitions (FREE <-> OCCUPIED) to parking/telemetry/{slot_id}.
Reads FSM_TRANSITIONS and MIN_HOLD_TIMES from shared.protocol to drive
randomised state changes. Logs every published message to a per-experiment
CSV file (PUBLISHER_CSV_COLUMNS) for latency analysis.

Implementation coming in Day 1.
"""
