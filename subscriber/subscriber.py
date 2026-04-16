"""Thin coordinator for subscriber components."""

from __future__ import annotations

from subscriber.measurement import MeasurementLogger
from shared.protocol import BROKER_HOST, BROKER_PORT, ExperimentConfig, slot_ids_for_run
from subscriber.alerts import AlertService
from subscriber.bus import EventBus
from subscriber.consumer import MQTTConsumer
from subscriber.parking_state import ParkingLotState

_bus: EventBus | None = None
_consumer: MQTTConsumer | None = None
_measurement: MeasurementLogger | None = None
_state: ParkingLotState | None = None
_alerts: AlertService | None = None


def start(config: ExperimentConfig) -> MeasurementLogger:
    global _bus, _consumer, _measurement, _state, _alerts

    stop()

    _state = ParkingLotState(slot_ids_for_run(config))
    _measurement = MeasurementLogger(config.db_path, config.run_id)
    _alerts = AlertService(_state)
    _bus = EventBus()
    _bus.subscribe(_measurement.record)
    _bus.subscribe(_state.update)
    _bus.subscribe(_alerts.check)

    try:
        _bus.start()
        _consumer = MQTTConsumer(BROKER_HOST, BROKER_PORT, _bus.publish)
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
        raise


def stop() -> None:
    global _bus, _consumer, _measurement, _state, _alerts

    if _consumer is not None:
        _consumer.disconnect()
        _consumer = None
    if _bus is not None:
        _bus.stop()
        _bus = None
    _measurement = None
    _state = None
    _alerts = None
