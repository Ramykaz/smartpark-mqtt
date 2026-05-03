from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import QFrame, QHBoxLayout, QLabel


class SummaryPanel(QFrame):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setStyleSheet(
            "SummaryPanel { background-color: #F5F5F5; border: 1px solid #BDBDBD;"
            " border-radius: 4px; padding: 8px; }"
        )

        layout = QHBoxLayout(self)
        layout.setContentsMargins(8, 8, 8, 8)
        layout.setSpacing(24)

        self._free_label     = QLabel("FREE: 0")
        self._occupied_label = QLabel("OCCUPIED: 0")
        self._reserved_label = QLabel("RESERVED: 0")

        for label in (self._free_label, self._occupied_label, self._reserved_label):
            label.setAlignment(Qt.AlignCenter)
            layout.addWidget(label)

    def update(self, free: int, occupied: int, reserved: int):
        self._free_label.setText(f"FREE: {free}")
        self._occupied_label.setText(f"OCCUPIED: {occupied}")
        self._reserved_label.setText(f"RESERVED: {reserved}")
