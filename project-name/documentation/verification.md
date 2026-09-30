# Verification — 2026-09-30

## Backend

Authoritative server/shared client [v0.7.0](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/releases/tag/v0.7.0), released and deployed by successful [workflow 36720694359](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/36720694359). Public `/api/health` reports 0.7.0 and the isolated `gungeon` game. All 27 server tests/typecheck passed after merging concurrent racing support. CI repeated tests against the deployed endpoint. See the server's `multiplayer-server/documentation/gungeon-verification.md` and archived `2026-09-30-add-gungeon-coop` specification.

## Local frontend with public backend

- `npm test`: 2 meaningful checks passed for bounded concurrent controls, neutral pause input and frame-rate-independent interpolation/reset.
- `npm run build`: Vite production build passed; asset URLs use the repository subpath.
- `npm run test:browser`: all 3 tests passed in real Microsoft Edge with WebGPU. Independent contexts joined one coded room, selected weapons, readied together, synchronized movement/shooting, hot joined/dropped, rolled on a short Space press, locally paused while shared time continued, refreshed to a fresh identity in the same room, toggled sound and rendered without page errors.
- Mobile browser emulation at 390×844 passed concurrent movement + aim/fire, touch roll and safe release. The arena remains 16:9; desktop 1440×1050 fits without page scrolling. Full-page screenshot capture in the installed Edge resets touch emulation, so mobile input is verified before the viewport screenshot. No physical touch device was tested.
- Defeat/replay test let the two-player crew fall, verified only the leader sees restart, restarted to lobby with full health and round 2, readied again and resumed shared wave 1.
- `npm run test:run`: actual two-browser keyboard/mouse playthrough cleared waves 1–5 and defeated the fifth-wave Warden in 107 seconds, with damage/vitality upgrades. It reads snapshots and operates controls, without changing server state or granting health. Earlier input-driven play also observed a teammate revival and team defeat.
- Original pixel floor, walls, cover, props, explorer colors, enemy patterns, boss, projectile distinction, muzzle/hit feedback and layout were visually inspected in actual game screenshots.

Screenshots: [desktop](screenshot01.png), [mobile](mobile.png), [boss](boss.png), [upgrade break](upgrades.png), [defeat](defeat.png). The README's canonical screenshot comes from the current game; it will be refreshed for the published version.

## Public frontend

Pending frontend release/deployment and two-browser verification of the public URL. No claim of completed public delivery is made until this section records the released version, workflow and public browser result.
