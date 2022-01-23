import {setBloodiedDeadOnHPChange} from "./hooks/auto-bloodied-dead.js";
import {addImportMonsterButton} from "./hooks/import-button.js";
import {setDeadIcon} from "./hooks/set-dead-icon.js";
import {registerConfigs} from "./config.js";
import {registerSpeedProvider} from "./integrations/drag-ruler-4E-speed-provider.js";
import {registerAutoCompletePackage} from "./integrations/autocomplete-inline-properties.js";

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(DnD4eTools.ID);
});

Hooks.once('init', () => {
    DnD4eTools.initialize();
    registerConfigs();
});

Hooks.on('renderSidebarTab', addImportMonsterButton);
Hooks.on('updateActor', setBloodiedDeadOnHPChange);
Hooks.once("setup", setDeadIcon);
// drag ruler integration
Hooks.once("dragRuler.ready", registerSpeedProvider);
Hooks.on("aipSetup", registerAutoCompletePackage);


export default class DnD4eTools {
    static ID = 'foundry-4e-tools';
    static NAME = '4e-tools';

    static FLAGS = {
        ORIGINAL_DEAD_STATUS_ICON: '',
        MODDED_DEAD_STATUS_ICON: "modules/foundry-4e-tools/icons/dead.svg"
    }

    static SETTINGS = {
        INJECT_BUTTON: 'inject-button',
        CREATE_IN_ENCOUNTER_FOLDERS: 'create-in-encounter-folders',
        DO_NOT_DUPLICATE: 'do-not-import-duplicates',
        DO_NOT_DUPLICATE_IN_FOLDER: 'do-not-import-duplicates-in-folder',
        BLOODIED_ICON: 'bloodied-icon',
        DEAD_ICON: 'dead-icon',
        CHANGE_DEAD_ICON: 'change-dead-icon'
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
            deadStatus.icon = DnD4eTools.FLAGS.MODDED_DEAD_STATUS_ICON
        }
        else {
            deadStatus.icon = DnD4eTools.FLAGS.ORIGINAL_DEAD_STATUS_ICON
        }
    }

    static initialize() {
        console.log(this.NAME + " | Initialising 4E Tools and Masterplan Importer")
    }
}



