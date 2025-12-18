# Scripts

Valhalla runs game scripts as **plain JavaScript** (no Node.js) using **goja** embedded in the server.

## Autocomplete in editors

Autocomplete for the server-provided globals (`npc`, `plr`) is defined in:

- `scripts/valhalla.d.ts`

The repository `jsconfig.json` includes the `scripts/` folder so most editors will pick up these globals automatically.

## API reference

See **[docs/Scripting.md](../docs/Scripting.md)**.



