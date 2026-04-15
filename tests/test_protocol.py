"""Tests for shared.protocol — the SmartPark-MQTT contract file."""

import sys
import os
import unittest

# Allow running from repo root: python -m unittest discover tests/
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.protocol import (
    STATES,
    FSM_TRANSITIONS,
    build_status_message,
    build_summary_message,
    build_command_message,
    make_msg_id,
    parse_msg_id,
    parse_message,
)


class TestBuildStatusMessage(unittest.TestCase):
    def setUp(self):
        self.msg = build_status_message("slot_03", "OCCUPIED", 142, 1)

    def test_required_keys(self):
        self.assertSetEqual(
            set(self.msg.keys()),
            {"slot_id", "state", "msg_id", "sent_ts", "qos"},
        )

    def test_values(self):
        self.assertEqual(self.msg["slot_id"], "slot_03")
        self.assertEqual(self.msg["state"], "OCCUPIED")
        self.assertEqual(self.msg["qos"], 1)

    def test_sent_ts_placeholder(self):
        # sent_ts must be 0 — publisher overwrites it before publish()
        self.assertEqual(self.msg["sent_ts"], 0)

    def test_msg_id_format(self):
        # Expected: slot_03-0142
        self.assertEqual(self.msg["msg_id"], "slot_03-0142")

    def test_msg_id_low_counter(self):
        msg = build_status_message("slot_01", "FREE", 1, 0)
        self.assertEqual(msg["msg_id"], "slot_01-0001")

    def test_msg_id_large_counter(self):
        msg = build_status_message("slot_10", "FREE", 9999, 2)
        self.assertEqual(msg["msg_id"], "slot_10-9999")


class TestMsgIdRoundTrip(unittest.TestCase):
    def test_roundtrip(self):
        slot_id, counter = "slot_03", 142
        msg_id = make_msg_id(slot_id, counter)
        self.assertEqual(msg_id, "slot_03-0142")
        parsed_slot, parsed_counter = parse_msg_id(msg_id)
        self.assertEqual(parsed_slot, slot_id)
        self.assertEqual(parsed_counter, counter)

    def test_roundtrip_zero(self):
        msg_id = make_msg_id("slot_01", 0)
        slot_id, counter = parse_msg_id(msg_id)
        self.assertEqual(slot_id, "slot_01")
        self.assertEqual(counter, 0)

    def test_parse_msg_id_bad_format_no_dash(self):
        with self.assertRaises(ValueError):
            parse_msg_id("nodash")

    def test_parse_msg_id_bad_counter_not_digits(self):
        with self.assertRaises(ValueError):
            parse_msg_id("slot_01-abcd")


class TestParseMessage(unittest.TestCase):
    def test_valid_json(self):
        payload = b'{"slot_id": "slot_01", "state": "FREE"}'
        result = parse_message(payload)
        self.assertEqual(result["slot_id"], "slot_01")
        self.assertEqual(result["state"], "FREE")

    def test_garbage_raises_value_error(self):
        with self.assertRaises(ValueError):
            parse_message(b"not json at all }{")

    def test_empty_bytes_raises_value_error(self):
        with self.assertRaises(ValueError):
            parse_message(b"")

    def test_truncated_json_raises_value_error(self):
        with self.assertRaises(ValueError):
            parse_message(b'{"slot_id": "slot_01"')


class TestBuildSummaryMessage(unittest.TestCase):
    def test_total_is_sum(self):
        msg = build_summary_message(free=5, occupied=3, reserved=1)
        self.assertEqual(msg["total"], 9)

    def test_keys(self):
        msg = build_summary_message(free=0, occupied=0, reserved=0)
        self.assertSetEqual(set(msg.keys()), {"free", "occupied", "reserved", "total"})

    def test_zero_total(self):
        msg = build_summary_message(0, 0, 0)
        self.assertEqual(msg["total"], 0)

    def test_large_values(self):
        msg = build_summary_message(100, 200, 50)
        self.assertEqual(msg["total"], 350)


class TestFSMTransitions(unittest.TestCase):
    def test_every_state_has_entry(self):
        for state in STATES:
            self.assertIn(state, FSM_TRANSITIONS, f"State {state!r} missing from FSM_TRANSITIONS")

    def test_all_target_states_are_valid(self):
        for src_state, targets in FSM_TRANSITIONS.items():
            for tgt in targets:
                self.assertIn(
                    tgt,
                    STATES,
                    f"Target state {tgt!r} (from {src_state!r}) is not in STATES",
                )

    def test_no_self_transitions(self):
        for state, targets in FSM_TRANSITIONS.items():
            self.assertNotIn(state, targets, f"State {state!r} has a self-transition")


if __name__ == "__main__":
    unittest.main()
