Hooks.on('renderPlayerList', (playerList, html) => {

    if (!game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.INJECT_BUTTON)) {
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
        DnD4eTools.toDoListConfig.render(true, {userId});
    });
});

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
        return game.users.get(userId)?.getFlag(DnD4eTools.ID, DnD4eTools.FLAGS.TODOS);
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
        return game.users.get(userId)?.setFlag(DnD4eTools.ID, DnD4eTools.FLAGS.TODOS, newToDos);
    }

    // update a specific todo by id with the provided updateData
    static updateToDo(todoId, updateData) {
        const relevantToDo = this.allToDos[toDoId];

        // construct the update to send
        const update = {
            [toDoId]: updateData
        }

        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(DnD4eTools.ID, DnD4eTools.FLAGS.TODOS, update);
    }

    // delete a specific todo by id
    static deleteToDo(toDoId) {
        const relevantToDo = this.allToDos[toDoId];

        // Foundry specific syntax required to delete a key from a persisted object in the database
        const keyDeletion = {
            [`-=${toDoId}`]: null
        }

        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(DnD4eTools.ID, DnD4eTools.FLAGS.TODOS, keyDeletion);
    }

    static updateUserToDos(userId, updateData) {
        return game.users.get(userId)?.setFlag(DnD4eTools.ID, DnD4eTools.FLAGS.TODOS, updateData);
    }
}



class ToDoListConfig extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            height: 'auto',
            id: 'todo-list',
            template: DnD4eTools.TEMPLATES.TODOLIST,
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
        DnD4eTools.log(false, 'saving');

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

        DnD4eTools.log(false, 'Button Clicked!', {action, toDoId});

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
                DnD4eTools.log(false, 'Invalid action detected', action);
        }
    }

}