# Proposal

## Why

Gungeon’s manual create/join controls enforce four uppercase alphanumeric characters, but a `?room=` invite link connects without the same validation. Invalid links therefore bypass the clear admission feedback available to manual users, and the input does not show the chosen uppercase format until submission.

## What Changes

- Apply the four-character `A–Z`/`0–9` contract consistently to manual creation, manual joining, and invite-link admission.
- Normalize valid codes to uppercase. Uppercase manual input as it is typed, preserve pasted characters, and explain invalid input instead of silently removing characters.
- For an invalid invite link, show a clear error and the normal join form without attempting a connection.
- Add focused coverage for valid and invalid codes across each entry path; keep the authoritative server contract unchanged.
- Keep user-facing Gungeon guidance explicit that codes are four alphanumeric characters. Verify the game’s backend-version documentation against the deployed service before changing version claims.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `gungeon-client`: Specify consistent four-character code validation, normalization, and recovery feedback for manual and link-based admission.

## Impact

- Frontend: `bomberman-clone/src/main.js` and its admission markup.
- Tests: `bomberman-clone/test/private-room-links.test.mjs` and, if needed, browser coverage for admission feedback.
- Documentation: game instructions and verification/version references under `README.md` and `bomberman-clone/documentation/`.
- Integration evidence: the latest shared server source already uses a four-character uppercase alphanumeric code contract. No server runtime or dependency upgrade is proposed. The installed v0.9.7 client package README still contains a six-character Ring Rivals example, while the latest server repository README has been corrected to four; do not change or republish the shared package as part of this game-local change without confirming that release work is needed.
