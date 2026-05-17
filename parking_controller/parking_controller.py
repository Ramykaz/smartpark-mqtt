"""Thin coordinator for parking controller components."""

from __future__ import annotations

from parking_controller.measurement import MeasurementLogger
from shared.protocol import BROKER_HOST, BROKER_PORT, ExperimentConfig, slot_ids_for_run
from parking_controller.alerts import AlertService
from parking_controller.bus import EventBus
from parking_controller.consumer import MQTTConsumer
from parking_controller.parking_state import ParkingLotState
from parking_controller.summary_publisher import SummaryPublisher

_bus: EventBus | None = None
_consumer: MQTTConsumer | None = None
_measurement: MeasurementLogger | None = None
_state: ParkingLotState | None = None
_alerts: AlertService | None = None
_summary: SummaryPublisher | None = None


def start(config: ExperimentConfig, enable_logging: bool = False) -> MeasurementLogger | None:
    global _bus, _consumer, _measurement, _state, _alerts, _summary

    stop()

    _state = ParkingLotState(slot_ids_for_run(config))
    _alerts = AlertService(_state)
    _bus = EventBus()

    # Consumer is constructed before bus.start() so its publish method is available
    # to SummaryPublisher. The socket is not opened until _consumer.connect() below.
    _consumer = MQTTConsumer(BROKER_HOST, BROKER_PORT, _bus.publish, _state)
    _summary = SummaryPublisher(_state, _consumer.publish)

    if enable_logging:
        _measurement = MeasurementLogger(config.db_path, config.run_id)
        _bus.subscribe(_measurement.record)

    _bus.subscribe(_state.update)
    _bus.subscribe(_alerts.check)
    _bus.subscribe(_summary.on_event)

    try:
        _bus.start()
        _consumer.connect()
        return _measurement
    except Exception:
        if _consumer is not None:
            _consumer.disconnect()
            _consumer = None
        if _bus is not None:
            _bus.stop()
            _bus = None
        if _measurement is not None:
            _measurement.close()
            _measurement = None
        _state = None
        _alerts = None
        _summary = None
        raise


def stop() -> None:
    global _bus, _consumer, _measurement, _state, _alerts, _summary

    if _consumer is not None:
        _consumer.disconnect()
        _consumer = None
    if _bus is not None:
        _bus.stop()
        _bus = None
    _measurement = None
    _state = None
    _alerts = None
    _summary = None
