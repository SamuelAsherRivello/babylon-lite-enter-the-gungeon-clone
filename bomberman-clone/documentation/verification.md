# Verification — 2026-10-02

## Backend

The game pins shared client [v0.9.7](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/releases/tag/v0.9.7). On 2026-10-02, the public `/api/health` endpoint returned version `0.9.7` and listed the `gungeon` game. A live create request to that endpoint returned a six-character code (`2FC47D`), so this deployed endpoint still violates the four-character contract even though the latest shared server source and README now specify four uppercase alphanumeric characters. The server repository's current release workflow targets Render, while the game still defaults to the legacy Vercel URL; no Render service URL or deploy-hook configuration is available in the repository's GitHub Actions settings. Public two-client verification therefore remains blocked until a four-character backend is deployed and the game uses its endpoint. The previous v0.7.0 backend verification is historical; its successful [workflow 36720694359](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/36720694359) does not establish the current deployment. The v0.9.7 package README contains a stale six-character Ring Rivals example; it does not describe Gungeon and is not used by this client.

## Local frontend with public backend

- `npm test`: 3 checks passed for bounded concurrent controls, neutral pause input, frame-rate-independent interpolation/reset, and private-room invite links.
- `npm run build`: Vite production build passed; asset URLs use the repository subpath.
- `npm run test:browser`: all 3 tests passed in real Microsoft Edge with WebGPU. Independent contexts joined one coded room, selected weapons, readied together, synchronized movement/shooting, hot joined/dropped, rolled on a short Space press, locally paused while shared time continued, refreshed to a fresh identity in the same room, toggled sound and rendered without page errors.
- Mobile browser emulation at 390×844 passed concurrent movement + aim/fire, touch roll and safe release. The arena remains 16:9; desktop 1440×1050 fits without page scrolling. Full-page screenshot capture in the installed Edge resets touch emulation, so mobile input is verified before the viewport screenshot. No physical touch device was tested.
- Defeat/replay test let the two-player crew fall, verified only the leader sees restart, restarted to lobby with full health and round 2, readied again and resumed shared wave 1.
- `npm run test:run`: actual two-browser keyboard/mouse playthrough cleared waves 1–5 and defeated the fifth-wave Warden in 107 seconds, with damage/vitality upgrades. It reads snapshots and operates controls, without changing server state or granting health. Earlier input-driven play also observed a teammate revival and team defeat.
- Original pixel floor, walls, cover, props, explorer colors, enemy patterns, boss, projectile distinction, muzzle/hit feedback and layout were visually inspected in actual game screenshots.

Screenshots: [desktop](screenshot01.png), [mobile](mobile.png), [boss](boss.png), [upgrade break](upgrades.png), [defeat](defeat.png). The README's canonical desktop screenshot, mobile screenshot, and defeat screenshot were refreshed from the published v0.0.4 game.

## Public frontend

Frontend [v0.0.4](https://github.com/SamuelAsherRivello/babylon-lite-enter-the-gungeon-clone/releases/tag/v0.0.4), tag commit `ae1a3bfd7b4dd58b946fefed2b2b6ed7cb622980`, includes the `bomberman-clone/` application root. [Release workflow 36993025794](https://github.com/SamuelAsherRivello/babylon-lite-enter-the-gungeon-clone/actions/runs/36993025794) and [Pages deployment 36993097488](https://github.com/SamuelAsherRivello/babylon-lite-enter-the-gungeon-clone/actions/runs/36993097488) both succeeded.

The [public game](https://samuelasherrivello.github.io/babylon-lite-enter-the-gungeon-clone/) and its version.txt return HTTP 200, with version 0.0.4. `GAME_URL` was set to the public URL and all 3 browser tests passed in 39.8 seconds: actual two-client synchronized combat/hot join/drop/reconnect/pause/roll, concurrent mobile touch input, and team defeat/leader restart/fresh replay. Both clients used the deployed authoritative backend. The public screenshots were refreshed and no page errors were observed.

OpenSpec changes: frontend `add-gungeon-client` and server `add-gungeon-coop`; maintained specifications are synced before archiving. The frontend archive records completed delivery tasks and this evidence.
