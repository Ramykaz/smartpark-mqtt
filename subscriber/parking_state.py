from __future__ import annotations

from shared.protocol import Event


class ParkingLotState:
    def __init__(self, slot_ids: list[str]) -> None:
        self._states = {slot_id: "FREE" for slot_id in slot_ids}

    def update(self, event: Event) -> None:
        self._states[event.slot_id] = event.state

    def get_counts(self) -> dict:
        free = sum(1 for state in self._states.values() if state == "FREE")
        occupied = sum(1 for state in self._states.values() if state == "OCCUPIED")
        reserved = sum(1 for state in self._states.values() if state == "RESERVED")
        return {
            "free": free,
            "occupied": occupied,
            "reserved": reserved,
            "total": len(self._states),
        }

    def snapshot(self) -> dict:
        return dict(self._states)
