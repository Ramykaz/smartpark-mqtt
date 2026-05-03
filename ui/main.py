import argparse
import os
import sys

# Ensure the project root (parent of ui/) is on sys.path when the script is
# run directly (python ui/main.py) rather than as a module (python -m ui.main).
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# On macOS, Qt cannot always locate its platform plugins (cocoa) when installed
# via pip into a venv. Point it at the bundled plugins before QApplication loads.
import PyQt5
_qt_plugins = os.path.join(os.path.dirname(PyQt5.__file__), "Qt5", "plugins")
if os.path.isdir(_qt_plugins):
    os.environ.setdefault("QT_QPA_PLATFORM_PLUGIN_PATH", _qt_plugins)

from PyQt5.QtWidgets import QApplication

from ui.dashboard import ParkingDashboard


def main():
    parser = argparse.ArgumentParser(description="SmartPark dashboard")
    parser.add_argument("--slots",  type=int, default=10,          metavar="INT")
    parser.add_argument("--broker", type=str, default="localhost",  metavar="STR")
    parser.add_argument("--port",   type=int, default=1883,         metavar="INT")
    args = parser.parse_args()

    slot_ids = [f"slot_{i:02d}" for i in range(1, args.slots + 1)]

    app  = QApplication(sys.argv)
    dash = ParkingDashboard(slot_ids, args.broker, args.port)
    dash.setWindowTitle("SmartPark — Demo")
    dash.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
