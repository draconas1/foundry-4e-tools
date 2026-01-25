import {setBloodiedDeadOnHPChange} from "./hooks/auto-bloodied-dead.js";
import {addImportMonsterButton} from "./hooks/import-button.js";
import {addActorContextMenuUpdateMonsterKnowledge} from "./hooks/update-knowledge.js";
import {setDeadIcon} from "./hooks/set-dead-icon.js";
import {registerConfigs} from "./config.js";
import {registerAutoCompletePackage} from "./integrations/autocomplete-inline-properties.js";

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(DnD4eTools.ID);
});

Hooks.once('init', () => {
    DnD4eTools.initialize();
    registerConfigs();
});

export default class DnD4eTools {
    static ID = 'foundry-4e-tools';
    static NAME = '4e-tools';

    static FLAGS = {
        ORIGINAL_DEAD_STATUS_ICON: 'icons/svg/skull.svg',
        MODDED_DEAD_STATUS_ICON: "modules/foundry-4e-tools/icons/dead.svg",
        ORIGINAL_DYING_STATUS_ICON: 'systems/dnd4e/icons/statusEffects/dying.svg',
        MODDED_DYING_STATUS_ICON: "modules/foundry-4e-tools/icons/dying.svg"
    }

    static SETTINGS = {
        CREATE_IN_ENCOUNTER_FOLDERS: 'create-in-encounter-folders',
        DO_NOT_DUPLICATE: 'do-not-import-duplicates',
        DO_NOT_DUPLICATE_IN_FOLDER: 'do-not-import-duplicates-in-folder',
        BLOODIED_ICON: 'bloodied-icon',
        DEAD_ICON: 'dead-icon',
        CHANGE_DEAD_ICON: 'change-dead-icon',
        LARGE_BLOODIED_ICON: 'large-bloodied-icon'
    }

    static TEMPLATES = {
        IMPORTER_INPUT: `modules/${this.ID}/templates/importer-input.hbs`,
    }

    static devMode() {
        return game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    }

    static log(force, ...args) {
        const shouldLog = force || this.devMode();

        if (shouldLog) {
            console.log(this.NAME, '|', ...args);
        }
    }

    static setDeadIcon() {
        const deadStatus = CONFIG.statusEffects.find(x => x.id === "dead");
        if (game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.CHANGE_DEAD_ICON)) {
            deadStatus.img = DnD4eTools.FLAGS.MODDED_DEAD_STATUS_ICON
        }
        else {
            if (deadStatus.img === DnD4eTools.FLAGS.MODDED_DEAD_STATUS_ICON) {
                deadStatus.img = DnD4eTools.FLAGS.ORIGINAL_DEAD_STATUS_ICON
            }
            // if not don't touch it.
        }

        const dyingStatus = CONFIG.statusEffects.find(x => x.id === "dying");
        if (game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.CHANGE_DEAD_ICON)) {
            dyingStatus.img = DnD4eTools.FLAGS.MODDED_DYING_STATUS_ICON
        }
        else {
            if (dyingStatus.img === DnD4eTools.FLAGS.MODDED_DYING_STATUS_ICON) {
                dyingStatus.img = DnD4eTools.FLAGS.ORIGINAL_DYING_STATUS_ICON
            }
            // if not don't touch it.
        }
    }

    static initialize() {
        console.log(this.NAME + " | Initialising 4E Tools and Masterplan Importer")

        Hooks.on('renderActorDirectory', addImportMonsterButton);
        Hooks.on('updateActor', setBloodiedDeadOnHPChange);
        Hooks.once("setup", setDeadIcon);
//auto complete inline properties integration
        Hooks.on("aipSetup", registerAutoCompletePackage);
        Hooks.on("getActorContextOptions", addActorContextMenuUpdateMonsterKnowledge);

        Hooks.once('tokenActionHudCoreApiReady', async () => {
            const module = game.modules.get('token-action-hud-dnd4e')
            if (!module?.active) {
                ui.notifications.error("TOKEN ACTION HUD: 4e Integration has moved to https://github.com/draconas1/token-action-hud-dnd4e (logged to console for C&P)");
                console.log("TOKEN ACTION HUD: 4e Integration has moved to https://github.com/draconas1/token-action-hud-dnd4e")
            }
        })
    }
}
