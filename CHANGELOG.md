# Changelog

All notable changes to SimpCity Hide Threads are documented here. This file is the update-log source shown by the website catalog.

## [Unreleased]

### Added

### Changed

### Fixed

### Security

## [1.0.1] - 2026-06-25

### Changed
- Restyled the hidden-thread manager modal to match the vylix dark/red console design.

## [1.0.0] - 2026-06-24

### Added
- Initial split hide-only release for `vylix-dev/simpcity-hide-threads`.
- Raw GitHub `@updateURL` and `@downloadURL` metadata for Tampermonkey updates.
- Safe DOM-built hidden-thread manager modal with duplicate-modal guard and keyboard handling.
- GM storage with localStorage fallback while preserving the existing `simpcity_hidden_threads_v1` key.

### Changed
- Removed infinite-scroll fetching, buffering, replacement, and sentinel behavior from the hide workflow.
- Replaced index-based unhide actions with ID-based hidden-thread removal.
- Replaced stored-data `innerHTML` rendering with explicit DOM node construction.
