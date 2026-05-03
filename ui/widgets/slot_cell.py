from PyQt5.QtCore import Qt, pyqtSignal
from PyQt5.QtWidgets import QFrame, QLabel, QVBoxLayout, QApplication

_STATE_COLORS = {
    "FREE":       "#4CAF50",
    "OCCUPIED":   "#F44336",
    "RESERVED":   "#FFC107",
    "REQUESTING": "#9E9E9E",
}


class SlotCell(QFrame):
    reserve_requested = pyqtSignal(str)

    def __init__(self, slot_id: str, parent=None):
        super().__init__(parent)
        self._slot_id = slot_id
        self._state = ""

        self.setFixedSize(90, 70)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(4, 4, 4, 4)
        layout.setSpacing(2)

        self._id_label = QLabel(slot_id)
        self._id_label.setAlignment(Qt.AlignCenter)
        self._id_label.setStyleSheet("font-weight: bold; font-size: 13px; background: transparent;")

        self._state_label = QLabel("")
        self._state_label.setAlignment(Qt.AlignCenter)
        self._state_label.setStyleSheet("font-size: 11px; background: transparent;")

        layout.addWidget(self._id_label)
        layout.addWidget(self._state_label)

    def set_state(self, state: str):
        self._state = state
        self._state_label.setText(state)
        color = _STATE_COLORS.get(state)
        if color:
            self.setStyleSheet(f"SlotCell {{ background-color: {color}; border-radius: 6px; }}")

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton and self._state == "FREE":
            self.reserve_requested.emit(self._slot_id)
        super().mousePressEvent(event)
