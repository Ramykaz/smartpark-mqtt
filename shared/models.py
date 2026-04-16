from dataclasses import dataclass

from shared.protocol import SQLITE_DB_PATH


@dataclass
class Event:
    slot_id: str
    state: str
    msg_id: str
    sent_ts: int
    recv_ts: int
    qos: int
    raw_topic: str


@dataclass
class ExperimentConfig:
    run_id: str
    qos: int
    n_slots: int
    transition_rate: float
    duration_s: int
    network_condition: str
    loss_pct: float
    delay_ms: int
    started_at: int
    db_path: str = SQLITE_DB_PATH
