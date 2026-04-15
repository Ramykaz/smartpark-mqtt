"""ExperimentController — orchestrates multi-slot experiment runs.

Spawns N SlotSimulator instances, one ParkingSubscriber, and steps through
QoS levels (0, 1, 2) and network conditions (clean, lossy, high-latency).
Writes a summary CSV and signals the analysis pipeline when a run finishes.

Implementation coming in Day 2.
"""
