# ADR 001: Client review sessions (phase 2)

## Status

Accepted — types in `@noted/shared`, implementation deferred.

## Context

Freelancers need revocable links so clients comment without installs. NDAs require capture + Ollama to stay on the freelancer machine.

## Decision

- Phase 2 adds `packages/session-gateway` (self-host) and optional hosted `packages/relay`.
- Tunnel carries the same JSON capture protocol as v0 — never screenshots or full DOM dumps of unrelated pages.
- Client browser runs overlay JS served through the gateway; task synthesis remains on `127.0.0.1` daemon.

## Consequences

- v0 APIs (`ElementCapture`, WebSocket verify) remain stable.
- Gateway authenticates session tokens only; payload size caps reuse `truncateJson`.
