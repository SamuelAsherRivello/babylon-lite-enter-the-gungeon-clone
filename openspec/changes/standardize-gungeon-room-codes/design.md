# Design

## Context

See `proposal.md` for motivation and observed behavior. The Gungeon frontend uses the shared `@rmc/multiplayer-client` package, while its manual form and URL startup logic currently normalize and validate codes separately. The shared server source owns the authoritative four-character `A–Z`/`0–9` format. The installed client package is version 0.9.7; its API does not expose the newer room-link helper names found in current upstream documentation.

## Goals / Non-Goals

**Goals:**
- Make one frontend admission rule serve manual create, manual join, and URL auto-join.
- Keep invalid links in the admission flow with a recoverable message.
- Keep client validation aligned with the existing server contract.

**Non-Goals:**
- Change server room-code generation, admission, or rate limiting.
- Upgrade the shared client or depend on helpers that are not exported by the installed package.
- Publish a new shared-client release solely to refresh packaged documentation.

## Decisions

- Add a small pure client utility for room-code normalization/validation and use it from every Gungeon admission path. This avoids copying a regular expression into separate click handlers and URL startup logic. A local helper is preferred over importing an upstream-only helper because the installed 0.9.7 package does not export that API.
- Trim surrounding whitespace and uppercase the submitted code before checking exactly four ASCII letters or digits. Update the field display on input to uppercase, but leave punctuation and other invalid pasted characters visible so validation can explain the problem rather than silently changing the code.
- Validate the invite query before connecting. For an invalid value, keep the client idle, show the admission controls, and display a specific error. Valid lowercase links are normalized and auto-joined.
- Keep server enforcement authoritative. Client checks improve feedback but do not replace server validation.
- Keep project documentation scoped to Gungeon’s four-character contract. The latest shared server repository source already documents four-character codes; the installed v0.9.7 package README contains an older six-character Ring Rivals example. Do not edit or release the shared package in this game-local change.

## Risks / Trade-offs

- [Client and server validation could drift later] → Cover representative valid/invalid inputs and manual/link paths with focused tests; treat server behavior as authoritative.
- [Existing README version claims may not match the deployed backend] → Verify the live service version before editing release claims; preserve current claims if the deployed version still supports them and record any evidence gap.
- [The deployed backend does not match the latest source contract] → A live create request to the v0.9.7 endpoint returned six-character code `57763E`, while current upstream source and README specify four characters. Do not continue with a client-only four-character validator until the user resolves the server-scope conflict.

## Migration Plan

No room migration is required: codes and rooms are ephemeral, and the server already accepts the selected four-character format. Deploy the frontend after local checks; rollback is the normal static frontend rollback if admission regressions appear.

## Open Questions

- The live health endpoint reports v0.9.7 and lists `gungeon`, but the deployed code generator returned six characters even though the latest server source specifies four. The earlier decision to keep server runtime unchanged conflicts with the user's four-character requirement under this deployment. Resolve whether to expand this change to update and deploy the shared server, or defer client work until a four-character backend is deployed.
