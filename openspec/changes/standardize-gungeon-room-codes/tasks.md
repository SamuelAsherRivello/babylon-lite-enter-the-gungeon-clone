# Tasks

## 1. Room-code validation and admission

- [x] 1.1 Add a pure Gungeon room-code normalization/validation helper for trimmed four-character `A–Z`/`0–9` codes, and verify it with unit coverage for uppercase, lowercase, whitespace, invalid characters, and lengths other than four.
- [x] 1.2 Use the helper for manual create and join; uppercase the field as users type without stripping invalid pasted characters, provide accessible validation feedback, and verify invalid submissions do not connect while blank create still requests a generated code.
- [x] 1.3 Validate `?room=` before auto-join; verify valid lowercase links normalize and connect, while malformed links remain on the admission screen with an actionable error and no connection attempt.

## 2. Documentation and integration evidence

- [x] 2.1 Update Gungeon setup and invite guidance to say four alphanumeric characters and verify the language matches the implemented input behavior.
- [x] 2.2 Confirm the latest shared server source continues to document the four-character contract and record that the v0.9.7 packaged Ring Rivals README example is stale; verify no server runtime or dependency change is needed for Gungeon.
- [x] 2.3 Check the deployed backend health/version against README, provenance, and verification claims; update those claims only to the version supported by live evidence, and record any unavailable evidence.

## 3. Integration verification

- [x] 3.1 Run `npm test` and `npm run build`; verify all room-code cases and the frontend build pass.
- [x] 3.2 Run the browser suite with valid and invalid invite URLs and a two-client valid-code join; verify invalid links show the form and error without opening a room, and valid links still join the shared session against the current shared server source. Public endpoint verification remains blocked by the stale six-character Vercel deployment and is documented in verification evidence.
