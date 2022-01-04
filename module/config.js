import DnD4eTools from "./4e-tools.js";

export function registerConfigs() {
    game.settings.register(DnD4eTools.ID, DnD4eTools.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS, {
        name: `TOOLS4E.settings.${DnD4eTools.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS}.Name`,
        default: true,
        type: Boolean,
        scope: 'world',
        config: true,
        hint: `TOOLS4E.settings.${DnD4eTools.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS}.Hint`
    });

    game.settings.register(DnD4eTools.ID, DnD4eTools.SETTINGS.DO_NOT_DUPLICATE, {
        name: `TOOLS4E.settings.${DnD4eTools.SETTINGS.DO_NOT_DUPLICATE}.Name`,
        default: true,
        type: Boolean,
        scope: 'world',
        config: true,
        hint: `TOOLS4E.settings.${DnD4eTools.SETTINGS.DO_NOT_DUPLICATE}.Hint`
    });

    game.settings.register(DnD4eTools.ID, DnD4eTools.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER, {
        name: `TOOLS4E.settings.${DnD4eTools.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER}.Name`,
        default: true,
        type: Boolean,
        scope: 'world',
        config: true,
        hint: `TOOLS4E.settings.${DnD4eTools.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER}.Hint`
    });

    game.settings.register(DnD4eTools.ID, DnD4eTools.SETTINGS.BLOODIED_ICON, {
        name: `TOOLS4E.settings.${DnD4eTools.SETTINGS.BLOODIED_ICON}.Name`,
        default: true,
        type: Boolean,
        scope: 'world',
        config: true,
        hint: `TOOLS4E.settings.${DnD4eTools.SETTINGS.BLOODIED_ICON}.Hint`
    });
    game.settings.register(DnD4eTools.ID, DnD4eTools.SETTINGS.DEAD_ICON, {
        name: `TOOLS4E.settings.${DnD4eTools.SETTINGS.DEAD_ICON}.Name`,
        default: true,
        type: Boolean,
        scope: 'world',
        config: true,
        hint: `TOOLS4E.settings.${DnD4eTools.SETTINGS.DEAD_ICON}.Hint`
    });
    game.settings.register(DnD4eTools.ID, DnD4eTools.SETTINGS.CHANGE_DEAD_ICON, {
        name: `TOOLS4E.settings.${DnD4eTools.SETTINGS.CHANGE_DEAD_ICON}.Name`,
        default: false,
        type: Boolean,
        scope: 'world',
        config: true,
        hint: `TOOLS4E.settings.${DnD4eTools.SETTINGS.CHANGE_DEAD_ICON}.Hint`,
        onChange: () => DnD4eTools.setDeadIcon()
    });
}