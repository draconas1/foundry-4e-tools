import DnD4eTools from "../4e-tools.js";

export default class CreatureImporterScreen extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const title = game.i18n.localize("TOOLS4E.import-json-screen.title")
        const overrides = {
            height: 'auto',
            id: 'creature-import',
            template: DnD4eTools.TEMPLATES.IMPORTER_INPUT,
            title: title
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    getData(options) {
        const data = {}
        data[DnD4eTools.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS] = game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS)
        data[DnD4eTools.SETTINGS.DO_NOT_DUPLICATE] = game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.DO_NOT_DUPLICATE)
        data[DnD4eTools.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER] = game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER)
        DnD4eTools.log(false, "Default Input Form Config: " + JSON.stringify(data))
        return data;
    }

    async _updateObject(event, formData) {
        let obj = "";
        try{
            obj = JSON.parse(('Pasted content: ', formData.masterPlanInput))
        } catch(err) {
            DnD4eTools.log(false, "Invalid JSON Input " + err)
            ui.notifications.error("Invalid Input, JSON formatting did not validate: "  + err);
            return;
        }

        try {
            for (const encounter of obj) {
                let folder = undefined
                let folderId = undefined
                if (formData[DnD4eTools.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS] === true) {
                    folder = game.folders.find(x => x.name === encounter.Name)
                    if (!folder) {
                        folder = await Folder.create({
                            name: encounter.Name,
                            type: "Actor",
                            parent: null
                        });
                    }
                    folderId = folder.id
                }

                for (const creature of encounter.Creatures) {
                    DnD4eTools.log(false, "Importing " + creature.Name)
                    if (creature.Size) {
                        throw "Invalid JSON: Received JSON for Roll20, you must set the exporter to export Foundry JSON"
                    }

                    // duplicate check
                    if (formData['handle-duplicates'] === DnD4eTools.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER) {
                        if (folder && folder.contents.find(x => x.name === creature.Name)) {
                            ui.notifications.info(creature.Name + " already existed in folder " + folder.name)
                            continue;
                        }
                    }

                    if (formData['handle-duplicates'] === DnD4eTools.SETTINGS.DO_NOT_DUPLICATE) {
                        if (game.actors.find(x => x.name === creature.Name)) {
                            ui.notifications.info(creature.Name + " already existed")
                            continue;
                        }
                    }

                    let actor = await Actor.create(
                        {
                            "name" : creature.Name,
                            "type" : "NPC",
                            "data" : creature.Data,
                            "folder" : folderId,
                            "token" : creature.Token
                        }
                    )
                    for (const power of creature.Powers) {
                        //assign obj ID if one was not made
                        if(!power._id) { power._id = randomID(16); }
                        await actor.createOwnedItem(power)
                    }
                    for (const trait of creature.Traits) {
                        //assign obj ID if one was not made
                        if(!trait._id) { trait._id = randomID(16); }
                        await actor.createOwnedItem(trait)
                    }

                    // work around because advancedCals does not want to be set on import.
                    // also to get the token size to update properly
                    actor.update({
                        "data.advancedCals" : true,
                        "data.details.size" : creature.Data.details.size
                    }, { forceSizeUpdate: true})
                }
            }
        } catch(err) {
            DnD4eTools.log(false, err)
            ui.notifications.error(err);
        }
    }
}