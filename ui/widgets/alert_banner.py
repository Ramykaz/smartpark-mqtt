from PyQt5.QtCore import Qt
from PyQt5.QtWidgets import QLabel


class AlertBanner(QLabel):
    def __init__(self, parent=None):
        super().__init__("⚠ Parking lot over 90% full", parent)
        self.setAlignment(Qt.AlignCenter)
        self.setStyleSheet(
            "background-color: #E53935; color: white; font-weight: bold; padding: 10px;"
        )
        self.setVisible(False)

    def set_active(self, active: bool):
        self.setVisible(active)
