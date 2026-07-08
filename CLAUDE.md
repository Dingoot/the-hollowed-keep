# CLAUDE.md — Spec-Driven Development (living-spec mode)

This is a single evolving codebase with frequent small changes (a room, an item, a mechanic, a bugfix). One shared spec, not one file per change. The spec is the source of truth; code derives from it.

## The living spec: `SPEC.md`
Keep one file, `SPEC.md`, at repo root, covering:
- **World/game model** — core mechanics, entities (rooms, items, NPCs, inventory rules), how they interact
- **Constraints** — language/framework, save format, things NOT to do
- **Current state** — brief list of what exists right now (rooms, items, systems) so nothing gets duplicated or contradicted
- **Changelog** — dated one-line entries for each change made, newest on top

Before touching code each session: read `SPEC.md`. After any change: update the relevant section + add a changelog line. This is the whole ceremony — no separate plan/tasks phase for small stuff.

## For each request
1. **If it's a small, self-contained change** (add an item, tweak dialogue, fix a bug): just do it. Update `SPEC.md`'s current-state + changelog. No back-and-forth needed.
2. **If it's ambiguous or touches multiple systems** (e.g. "add a crafting system"): ask 1 clarifying question if needed, state your interpretation in a sentence, then implement. Don't stop for approval on a game like this — moving fast matters more than ceremony, but state the assumption so I can correct it.
3. **If a request conflicts with something in `SPEC.md`**: say so before changing it, don't silently override established mechanics.

## Precision rules (this is what actually prevents mess)
- **No dead code.** Don't leave old implementations commented out "just in case." Delete them; that's what git history is for.
- **No bolt-on patches.** If a new feature doesn't fit the existing pattern (e.g. how items/rooms are structured), refactor the pattern — don't add a special-case branch next to it.
- **Match existing style exactly.** Don't introduce a new naming convention, file structure, or paradigm mid-project without flagging it first.
- **Smallest correct diff.** Change only what the request requires. Don't opportunistically refactor unrelated code in the same commit.
- **One thing per commit/response.** Don't bundle an unrelated fix into a feature change.

## Reporting back
- Lead with a one-line summary of what changed — I'm reviewing on my phone.
- Then a short bullet list of files touched, if more than one.
- Don't re-explain the whole feature or paste large code blocks unless I ask — just say what changed and why.

## Repo conventions
- `SPEC.md` at root — read first, update after every change.
- Commit messages should match the changelog line added to `SPEC.md`.
