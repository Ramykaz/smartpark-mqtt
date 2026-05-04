from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import QHBoxLayout, QLabel, QWidget


def _make_label(text: str, color: str) -> QLabel:
    lbl = QLabel(text)
    lbl.setAlignment(Qt.AlignCenter)
    lbl.setStyleSheet(
        f"background-color: {color}; color: white; font-weight: bold; "
        "border-radius: 6px; padding: 8px 16px;"
    )
    return lbl


class SummaryPanel(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        layout = QHBoxLayout(self)
        layout.setSpacing(12)
        self._free     = _make_label("FREE: 0",     "#43A047")
        self._occupied = _make_label("OCCUPIED: 0", "#E53935")
        self._reserved = _make_label("RESERVED: 0", "#FB8C00")
        for w in (self._free, self._occupied, self._reserved):
            layout.addWidget(w)

    def update(self, free: int, occupied: int, reserved: int):
        self._free.setText(f"FREE: {free}")
        self._occupied.setText(f"OCCUPIED: {occupied}")
        self._reserved.setText(f"RESERVED: {reserved}")
