from math import ceil, sqrt

from PyQt5.QtCore import pyqtSignal
from PyQt5.QtWidgets import QGridLayout, QWidget

from ui.widgets.slot_cell import SlotCell


class SlotGrid(QWidget):
    reserve_requested = pyqtSignal(str)

    def __init__(self, slot_ids: list, parent=None):
        super().__init__(parent)
        self._cells: dict[str, SlotCell] = {}

        cols = ceil(sqrt(len(slot_ids))) if slot_ids else 1
        layout = QGridLayout(self)
        layout.setSpacing(6)

        for i, slot_id in enumerate(slot_ids):
            cell = SlotCell(slot_id)
            cell.reserve_requested.connect(self.reserve_requested)
            layout.addWidget(cell, i // cols, i % cols)
            self._cells[slot_id] = cell

    def update_slot(self, slot_id: str, state: str):
        cell = self._cells.get(slot_id)
        if cell is not None:
            cell.set_state(state)
