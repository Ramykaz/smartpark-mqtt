"""Analysis pipeline — computes QoS performance metrics from experiment data.

Reads the SQLite messages table and publisher CSV logs produced by an
experiment run. Computes end-to-end latency (recv_ts - sent_ts), message
delivery rate, duplicate rate, and out-of-order arrival statistics per
QoS level. Saves plots to data/figures/ using matplotlib.

Implementation coming in Day 2.
"""
