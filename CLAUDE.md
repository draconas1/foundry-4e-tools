# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Foundry VTT module** for D&D 4th Edition. It provides quality-of-life tools including a Masterplan creature importer, auto-bloodied/dead status effects, and monster knowledge updater. There is no build step, no npm, and no test framework — this is pure vanilla JavaScript loaded directly by Foundry VTT.

## Development Setup

Development requires a local Foundry VTT installation. Configure paths in `link-config.json`:

```json
{
    "installPath": "/path/to/foundry/",
    "dataPath": "/path/to/FoundryVTT/data/",
    "modules": [...]
}
```

Then run the symlink script:

```bash
node setup-links.mjs
```

This links Foundry's core source files into `foundry/` for IDE type awareness, and symlinks dev versions of dependency modules/systems (e.g. the `dnd4e` system) into Foundry's data directory so Foundry loads those dev versions and the IDE can resolve their types.

The `foundry/` directory (created by the symlink script) is gitignored and provides type definitions from Foundry's source for IDE autocompletion. `jsconfig.json` maps `@client/*` and `@common/*` to those symlinked paths.

## Directories to Ignore

- **`foundry/`** — symlinks to external Foundry source and dependency modules, created by `setup-links.mjs`. Do not read, search, or glob inside this directory unless asked, and only within the specific subpath provided.
- **`packs/`** — binary LevelDB database files for the module's compendium packs. These contain no readable source; do not attempt to read or analyse them.

## Architecture

**Entry point**: `module/4e-tools.js`

The static class `DnD4eTools` is the central coordinator. All module constants live here:
- `DnD4eTools.ID` — module ID string `'foundry-4e-tools'`
- `DnD4eTools.SETTINGS` — keys for `game.settings.get/set` calls
- `DnD4eTools.FLAGS` — icon path constants
- `DnD4eTools.TEMPLATES` — Handlebars template paths
- `DnD4eTools.log(force, ...args)` — conditional logger (respects `_dev-mode` module)

Initialization flow:
1. `Hooks.once('init')` fires → `DnD4eTools.initialize()` + `registerConfigs()`
2. `initialize()` registers all feature hooks (renderActorDirectory, updateActor, setup, etc.)

**Feature modules** (each exports a single hook handler function):

| File | Hook | Purpose |
|------|------|---------|
| `hooks/auto-bloodied-dead.js` | `updateActor` | Auto-applies bloodied/dead/dying status effects based on HP thresholds |
| `hooks/import-button.js` | `renderActorDirectory` | Adds "Import from Masterplan" button to the Actors sidebar |
| `hooks/update-knowledge.js` | `getActorContextOptions` | Adds context menu option to sync monster knowledge descriptions |
| `hooks/set-dead-icon.js` | `setup` (once) | Replaces default skull icon with custom dead/dying SVGs if enabled |
| `integrations/autocomplete-inline-properties.js` | `aipSetup` | Registers power fields with the Auto Complete Inline Properties module |

**UI screens**: `screens/creature-import.js` — Handlebars-based dialog (`ApplicationV2` + `HandlebarsApplicationMixin`) for pasting Masterplan JSON and importing creatures as NPC actors.

**Actor flag namespace**: Custom per-actor flags stored under `actor.flags.dracsTools` (e.g., `dracsTools.autoBloodied.ignore`, `dracsTools.autoBloodied.npcDiesLikePC`).

## Key Patterns

- All game settings are registered in `config.js` and accessed via `game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.KEY)`
- Status effects managed: `bloodied`, `dead`, `dying`, `prone`, `unconscious`
- NPC vs PC death logic differs: NPCs go straight to dead at 0 HP; PCs enter dying state until HP ≤ -(bloodied value)
- The `updateActor` hook fires for all connected clients but only acts when `userId === game.user.id` to avoid duplicate processing
- Localization strings are in `languages/en.json`; use `game.i18n.localize()` for any user-facing text

## Release Process

Releases are handled by `.github/workflows/main.yml`. Publishing a GitHub release triggers the workflow which:
1. Extracts the version from the git tag
2. Updates manifest/download URLs in `module.json`
3. Zips module assets and attaches them to the GitHub release

To release: create and push a git tag, then publish the release on GitHub.
