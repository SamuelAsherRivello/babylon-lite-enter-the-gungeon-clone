# Design
## Context
Backend 0.7.0 exposes code-aware admission and authoritative snapshots. Template uses root npm configuration, project-name application folder, corner UI roles, version.txt and patch releases.
## Goals / Non-Goals
Goals: Match the user brief, including landscape, solo, hot join/drop and two-client public proof.
Non-Goals: Offline simulation or permanent run storage.
## Decisions
Retain project-name as the application directory to preserve template scripts and layout; this is a deliberate convention. Use Babylon Lite's screen-space orthographic sprite renderer with an original 960×540 surface. Procedurally authored sprites and masonry stay original and reproducible. Frame-time interpolation smooths remote state without changing authoritative positions. Reconnect/round changes clear history. Pin the shared client to 0.7.0. Touch provides independent movement/aim sticks and roll. Local pause zeros input while shared combat continues.
## Risks / Trade-offs
Five-minute backend duration → document fresh identity/expired rooms and recovery. WebGPU unavailability → actionable message and retry. Touch is browser-emulated; physical hardware remains explicitly unverified.
## Migration Plan
Verify controls, two-client loop and recovery; release using existing patch workflow, explicitly deploy the release revision, verify public assets/version/gameplay, then sync and archive.
