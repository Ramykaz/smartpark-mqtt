# Progress

## v0.4 - 2026-04-18

- Made `MeasurementLogger` opt-in in the subscriber: `subscriber.start()` now accepts `enable_logging=False` (default) and only creates the logger, opens a SQLite connection, and registers the `record` handler when explicitly enabled.
- `ExperimentController` passes `enable_logging=True` to preserve existing behavior.

## v0.3 - 2026-04-18

- Added configurable experiment controls for `base_seed`, per-slot jitter, and simulator mode (`random` or `forced`) so runs can be reproducible or intentionally high-throughput.
- Changed the experiment runner and shared config model to carry the new timing/behavior settings through to each slot simulator instance.
- Changed the slot simulator to rely on shared protocol constants/builders, use per-slot seeded RNG, and publish transition-driven state updates with jittered timing instead of tightly synchronized behavior.
- Fixed simulator lockstep risk by desynchronizing slots while still allowing full-run reproducibility from a single base seed.
