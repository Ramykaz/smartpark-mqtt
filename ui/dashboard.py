"""Dashboard — Tkinter real-time parking lot visualisation.

Renders a grid of parking slots, colour-coded by state (FREE / OCCUPIED /
RESERVED). Subscribes to TELEMETRY_WILDCARD and SUMMARY_TOPIC via a
background MQTT thread and refreshes the UI on each incoming message.
Also surfaces occupancy alerts when the ALERT_THRESHOLD is exceeded.

Implementation coming in Day 3.
"""
