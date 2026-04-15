# SmartPark-MQTT

Simulation-based IoT smart parking system using MQTT. Parking slots publish
state transitions to a Mosquitto broker; a subscriber persists everything to
SQLite; an analysis suite computes QoS performance metrics across experiments.

Built for BBM 460.

---

## Setup

**1. Install Mosquitto** (once, outside the project):

```bash
# macOS
brew install mosquitto

# Ubuntu / Debian
sudo apt install mosquitto mosquitto-clients
```

**2. Set up the Python environment:**

```bash
source setup_env.sh
```

This creates `.venv/`, activates it, and installs all dependencies. Safe to
run multiple times.

**3. Start the broker:**

```bash
mosquitto -c config/mosquitto.conf
```

---

## Project Structure

| Directory | Contents |
|-----------|----------|
| `simulators/` | MQTT publishers — one `SlotSimulator` per parking slot |
| `subscriber/` | MQTT subscriber — persists telemetry to SQLite |
| `experiments/` | Experiment controller — orchestrates multi-slot runs across QoS levels |
| `analysis/` | Metrics pipeline — latency, delivery rate, duplicate rate; saves plots |
| `ui/` | Tkinter real-time dashboard — live slot grid and occupancy alerts |
| `shared/` | **Contract file** (`protocol.py`) — all constants, message builders, and schemas |
| `config/` | Mosquitto broker configuration |
| `data/` | Runtime output: SQLite DB, publisher CSVs, and figures (git-ignored) |
| `tests/` | Unit tests for `shared/protocol.py` |

---

## Running Tests

```bash
# With pytest
python -m pytest tests/

# With the standard library test runner
python -m unittest discover tests/
```
