Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(MasterplanImport.ID);
});

Hooks.once('init', () => {
    MasterplanImport.initialize();
});

Hooks.on('renderPlayerList', (playerList, html) => {

    if (!game.settings.get(MasterplanImport.ID, MasterplanImport.SETTINGS.INJECT_BUTTON)) {
        return;
    }

    // find the element which has our logged in user's id
    const loggedInUserListItem = html.find(`[data-user-id="${game.userId}"]`)

    // create localized tooltip
    const tooltip = game.i18n.localize('TOOLS4E.button-title');

    // insert a button at the end of this element
    loggedInUserListItem.append(
        `<button type='button' class='todo-list-icon-button flex0' title='${tooltip}'><i class='fas fa-tasks'></i></button>`
    );

    html.on('click', '.todo-list-icon-button', (event) => {
        const userId = $(event.currentTarget).parents('[data-user-id]')?.data()?.userId;
        MasterplanImport.toDoListConfig.render(true, {userId});
    });
});


Hooks.on('changeSidebarTab', (activeSheet) => {
    if (!(activeSheet instanceof ActorDirectory) || (activeSheet.options?.id !== "actors")) {
        return
    }

    // TODO if not GM bounce out
});

Hooks.on('renderSidebarTab', (activeTab, html, user) => {
    MasterplanImport.log(false, "badger")
    // find the element which has our logged in user's id
    const topBar = html.find(`[class="header-actions action-buttons flexrow"]`)
    // create localized tooltip
    const tooltip = game.i18n.localize('TOOLS4E.buttons.importer-launch-button');
    topBar.append(
        `<button type='button' id="mp-import-button" title='${tooltip}'><i>${tooltip}</i></button>`
    )
    html.on('click', '#mp-import-button', (event) => {
        MasterplanImport.creatureImporterScreen.render(true);
    });
});

/**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - The text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userId - The user who owns this todo.
 */
class MasterplanImport {
    static ID = 'foundry-4e-tools';

    static FLAGS = {
        TODOS: 'todos'
    }

    static SETTINGS = {
        INJECT_BUTTON: 'inject-button'
    }

    static TEMPLATES = {
        TODOLIST: `modules/${this.ID}/templates/todo-list.hbs`,
        IMPORTER_INPUT: `modules/${this.ID}/templates/importer-input.hbs`,
    }

    static log(force, ...args) {
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

        if (shouldLog) {
            console.log(this.ID, '|', ...args);
        }
    }

    static initialize() {
        this.toDoListConfig = new ToDoListConfig();
        this.creatureImporterScreen = new CreatureImporterScreen();

        game.settings.register(this.ID, this.SETTINGS.INJECT_BUTTON, {
            name: `TOOLS4E.settings.${this.SETTINGS.INJECT_BUTTON}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `TOOLS4E.settings.${this.SETTINGS.INJECT_BUTTON}.Hint`,
            onChange: () => ui.players.render()
        });
    }
}


class CreatureImporterScreen extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const title = game.i18n.localize("TOOLS4E.creature-import-title")
        const overrides = {
            height: 'auto',
            id: 'creature-import',
            template: MasterplanImport.TEMPLATES.IMPORTER_INPUT,
            title: title,
            userId: game.userId
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    async _updateObject(event, formData) {
        MasterplanImport.log(false, "update called")
        let obj = "";

        try{
            obj = JSON.parse(('Pasted content: ', formData.input))
        } catch(err) {
            MasterplanImport.error(false, "Invalid JSON Input")
            ui.notifications.info("Invalid Input, JSON formating did not validate");
            return;
        }

        for (const encounter of obj) {
            for (const creature of encounter.Creatures) {
                Actor.create(
                    {
                        "name" : creature.name,
                        "type" : "NPC",
                        "data" : creature
                    }
                )
            }
        }
        //
        // //check if JSON type is valid
        // const validTypes = ["weapon", "equipment", "consumable", "tool", "loot", "classFeats", "feat", "backpack", "raceFeats", "pathFeats", "destinyFeats", "ritual", "power"]
        // if(!validTypes.includes(obj.type)) {
        //     console.error(`Invalid Object Type of "${obj.type}"`)
        //     ui.notifications.info(`Invalid Object Type of "${obj.type}"`);
        //     return;
        // }
        // //assign obj ID if one was not made
        // if(!obj._id) { obj._id = randomID(16); }
        // //generate new item
        // this.object.createOwnedItem(obj)
    }
}


class ToDoListData {
    // all todos for all users
    static get allToDos() {
        const allToDos = game.users.reduce((accumulator, user) => {
            const userTodos = this.getToDosForUser(user.id);

            return {
                ...accumulator,
                ...userTodos
            }
        }, {});

        return allToDos;
    }

    // get all todos for a given user
    static getToDosForUser(userId) {
        return game.users.get(userId)?.getFlag(MasterplanImport.ID, MasterplanImport.FLAGS.TODOS);
    }

    // create a new todo for a given user
    static createToDo(userId, toDoData) {
        // generate a random id for this new ToDo and populate the userId
        const newToDo = {
            isDone: false,
            ...toDoData,
            id: foundry.utils.randomID(16),
            userId,
        }

        // construct the update to insert the new ToDo
        const newToDos = {
            [newToDo.id]: newToDo
        }

        // update the database with the new ToDos
        return game.users.get(userId)?.setFlag(MasterplanImport.ID, MasterplanImport.FLAGS.TODOS, newToDos);
    }

    // update a specific todo by id with the provided updateData
    static updateToDo(todoId, updateData) {
        const relevantToDo = this.allToDos[toDoId];

        // construct the update to send
        const update = {
            [toDoId]: updateData
        }

        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(MasterplanImport.ID, MasterplanImport.FLAGS.TODOS, update);
    }

    // delete a specific todo by id
    static deleteToDo(toDoId) {
        const relevantToDo = this.allToDos[toDoId];

        // Foundry specific syntax required to delete a key from a persisted object in the database
        const keyDeletion = {
            [`-=${toDoId}`]: null
        }

        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(MasterplanImport.ID, MasterplanImport.FLAGS.TODOS, keyDeletion);
    }

    static updateUserToDos(userId, updateData) {
        return game.users.get(userId)?.setFlag(MasterplanImport.ID, MasterplanImport.FLAGS.TODOS, updateData);
    }
}



class ToDoListConfig extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            height: 'auto',
            id: 'todo-list',
            template: MasterplanImport.TEMPLATES.TODOLIST,
            title: 'To Do List',
            userId: game.userId,
            closeOnSubmit: false, // do not close when submitted
            submitOnClose: false,
            submitOnChange: true
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    getData(options) {
        return {
            todos: ToDoListData.getToDosForUser(options.userId)
        }
    }

    async _updateObject(event, formData) {
        MasterplanImport.log(false, 'saving');

        const expandedData = foundry.utils.expandObject(formData);

        await ToDoListData.updateUserToDos(this.options.userId, expandedData);

        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }

    async _handleButtonClick(event) {
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;
        const toDoId = clickedElement.parents('[data-todo-id]')?.data()?.todoId;

        MasterplanImport.log(false, 'Button Clicked!', {action, toDoId});

        switch (action) {
            case 'create': {
                await ToDoListData.createToDo(this.options.userId);
                this.render();
                break;
            }

            case 'delete': {
                const confirmed = await Dialog.confirm({
                    title: game.i18n.localize("TOOLS4E.confirms.deleteConfirm.Title"),
                    content: game.i18n.localize("TOOLS4E.confirms.deleteConfirm.Content")
                });

                if (confirmed) {
                    await ToDoListData.deleteToDo(toDoId);
                    this.render();
                }

                break;
            }

            default:
                MasterplanImport.log(false, 'Invalid action detected', action);
        }
    }

}