import {renderSidebarTab} from "./hooks.js";

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(DnD4eTools.ID);
});

Hooks.once('init', () => {
    DnD4eTools.initialize();
});

Hooks.on('renderSidebarTab', renderSidebarTab);

/**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - The text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userId - The user who owns this todo.
 */
export default class DnD4eTools {
    static ID = 'foundry-4e-tools';
    static NAME = '4e-tools';

    static FLAGS = {
        TODOS: 'todos'
    }

    static SETTINGS = {
        INJECT_BUTTON: 'inject-button',
        CREATE_IN_ENCOUNTER_FOLDERS: 'create-in-encounter-folders',
        DO_NOT_DUPLICATE: 'do-not-import-duplicates',
        DO_NOT_DUPLICATE_IN_FOLDER: 'do-not-import-duplicates-in-folder',
    }

    static TEMPLATES = {
        TODOLIST: `modules/${this.ID}/templates/todo-list.hbs`,
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

    static initialize() {
        //this.toDoListConfig = new ToDoListConfig();
        console.log(this.NAME + " | Initialising 4E Tools and Masterplan Importer")
        // game.settings.register(this.ID, this.SETTINGS.INJECT_BUTTON, {
        //     name: `TOOLS4E.settings.${this.SETTINGS.INJECT_BUTTON}.Name`,
        //     default: true,
        //     type: Boolean,
        //     scope: 'client',
        //     config: true,
        //     hint: `TOOLS4E.settings.${this.SETTINGS.INJECT_BUTTON}.Hint`,
        //     onChange: () => ui.players.render()
        // });

        game.settings.register(this.ID, this.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS, {
            name: `TOOLS4E.settings.${this.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `TOOLS4E.settings.${this.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS}.Hint`
        });

        game.settings.register(this.ID, this.SETTINGS.DO_NOT_DUPLICATE, {
            name: `TOOLS4E.settings.${this.SETTINGS.DO_NOT_DUPLICATE}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `TOOLS4E.settings.${this.SETTINGS.DO_NOT_DUPLICATE}.Hint`
        });

        game.settings.register(this.ID, this.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER, {
            name: `TOOLS4E.settings.${this.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `TOOLS4E.settings.${this.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER}.Hint`
        });
    }
}


