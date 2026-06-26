# Changelog

All notable changes to SimpCity Hide Threads are documented here. This file is the update-log source shown by the website catalog.

## [Unreleased]

### Added

### Changed

### Fixed

### Security

## [1.1.6] - 2026-06-26

### Fixed
- Kept the inline Hide button visible beside long thread titles by reserving button space in the title row.

## [1.1.5] - 2026-06-26

### Changed
- Switched Tampermonkey dashboard icon metadata from SVG to PNG assets for reliable rendering.

## [1.1.4] - 2026-06-26

### Changed
- Added vylix logo metadata so Tampermonkey dashboard entries use the project icon.

## [1.1.3] - 2026-06-26

### Changed
- Added the vylix logo to the Hide Threads manager modal header.

## [1.1.1] - 2026-06-26

### Fixed
- Centered the inline Hide button label inside its red pill control.

## [1.1.0] - 2026-06-26

### Added
- Added JSON export and import controls to the hidden-thread manager for moving hidden-thread lists between browsers or profiles.

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
