# Spec Delta

## MODIFIED Requirements

### Requirement: Landscape cooperative play
The game SHALL present original top-down pixel artwork in a landscape arena and support 1–4 players creating/joining four-character uppercase alphanumeric rooms, readiness and hot join/drop/reconnect.
#### Scenario: Two browsers
- **WHEN** two independent browsers join one code
- **THEN** both see the same wave, actors and combat with smooth peer movement
#### Scenario: Manual room code entry
- **WHEN** a player creates or joins a room using a code
- **THEN** the code is trimmed, normalized to uppercase, and accepted only when it contains exactly four characters from A–Z or 0–9
#### Scenario: Code entry feedback
- **WHEN** a player types lowercase letters into the room-code field
- **THEN** the field displays those letters in uppercase while preserving pasted characters for explicit validation
#### Scenario: Invalid manual code
- **WHEN** a player submits a non-empty code that is not four uppercase alphanumeric characters after normalization
- **THEN** the game explains the required format and does not attempt to create or join a room
#### Scenario: Valid invite link
- **WHEN** a player opens an invite link containing a valid four-character code in any letter case
- **THEN** the game normalizes the code and attempts to join that room
#### Scenario: Invalid invite link
- **WHEN** a player opens an invite link whose code is not four alphanumeric characters
- **THEN** the game does not attempt to connect, shows a clear invalid-link message, and displays the manual admission controls

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
