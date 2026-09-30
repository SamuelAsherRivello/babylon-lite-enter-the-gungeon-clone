# Cooperative dungeon frontend

## Purpose
Provide a complete original landscape cooperative dungeon frontend, robust controls and lifecycle states, and verified public multiplayer delivery.

## Requirements

### Requirement: Landscape cooperative play
The game SHALL present original top-down pixel artwork in a landscape arena and support 1–4 players creating/joining coded rooms, readiness and hot join/drop/reconnect.
#### Scenario: Two browsers
- **WHEN** two independent browsers join one code
- **THEN** both see the same wave, actors and combat with smooth peer movement
### Requirement: Complete controls and loop
The frontend SHALL expose WASD movement, mouse aim, shooting, Space roll, concurrent touch controls, three weapons, upgrades, revival status, wave/enemy/health/cooldown HUD and leader restart after defeat.
#### Scenario: Wave break and replay
- **WHEN** a wave ends or the team falls
- **THEN** an actionable upgrade break or restart state appears and renders the next shared state
### Requirement: Recovery and original presentation
The game SHALL release input on pause/blur/cancel, show actionable connection/GPU errors, and use original sprites, rooms, UI and sound with distinct projectile teams and hit feedback.
#### Scenario: Local pause
- **WHEN** one player pauses
- **THEN** their input stops while the shared game continues
### Requirement: Verified public delivery
The README SHALL link the released playable demo and record setup, controls, sources, original prompt and hosting limits.
#### Scenario: Released public game
- **WHEN** the public URL is opened by two browsers
- **THEN** assets load, displayed version matches release and shared gameplay is verified
