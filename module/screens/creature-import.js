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
        try {
            obj = JSON.parse(('Pasted content: ', formData.masterPlanInput))
        } catch(err) {
            DnD4eTools.log(false, "Invalid JSON Input " + err)
            ui.notifications.error("Invalid Input, JSON formatting did not validate: "  + err);
            return;
        }

        try {
            const updateActors = formData['updateActors']

            for (const encounter of obj) {
                let folder = undefined
                let folderId = undefined
                let createFolder = false
                if (formData[DnD4eTools.SETTINGS.CREATE_IN_ENCOUNTER_FOLDERS] === true) {
                    folder = game.folders.find(x => x.name === encounter.Name)
                    if (!folder) {
                        createFolder = true
                    }
                    else {
                        folderId = folder.id
                    }
                }

                const processCreature = async (creature, img) => {
                    DnD4eTools.log(false, "Importing " + creature.Name)
                    if (creature.Size) {
                        throw "Invalid JSON: Received JSON for Roll20, you must set the exporter to export Foundry JSON"
                    }

                    let toUpdate = null;

                    // duplicate check
                    if (formData['handle-duplicates'] === DnD4eTools.SETTINGS.DO_NOT_DUPLICATE_IN_FOLDER) {
                        if (folder && folder.contents.find(x => x.name === creature.Name)) {

                            if (updateActors) {
                                ui.notifications.info("Updating " + creature.Name + " in folder " + folder.name)
                                toUpdate = folder.contents.find(x => x.name === creature.Name)
                            }
                            else {
                                ui.notifications.info(creature.Name + " already existed in folder " + folder.name)
                                return undefined;
                            }
                        }
                    }

                    if (formData['handle-duplicates'] === DnD4eTools.SETTINGS.DO_NOT_DUPLICATE) {
                        if (game.actors.find(x => x.name === creature.Name)) {
                            if (updateActors) {
                                ui.notifications.info("Updating " + creature.Name)
                                toUpdate = game.actors.find(x => x.name === creature.Name)
                            }
                            else {
                                ui.notifications.info(creature.Name + " already existed")
                                return undefined;
                            }
                        }
                    }
                    if (createFolder) {
                        createFolder = false
                        folder = await Folder.create({
                            name: encounter.Name,
                            type: "Actor",
                            parent: null
                        });
                        folderId = folder.id
                    }

                    if (toUpdate) {
                        await toUpdate.update({ system: creature.Data })
                        const items = await toUpdate.getEmbeddedCollection("Item")
                        const itemIds = items.map(x => x.id)
                        await toUpdate.deleteEmbeddedDocuments("Item", itemIds)
                        await toUpdate.createEmbeddedDocuments("Item", creature.Powers)
                        await toUpdate.createEmbeddedDocuments("Item", creature.Traits)
                        return toUpdate
                    }
                    else {
                        const actorData =  {
                            "name" : creature.Name,
                            "type" : "NPC",
                            "system" : creature.Data,
                            "folder" : folderId,
                            "token" : creature.Token
                        }
                        if (img) {
                            actorData.img = img
                        }

                        let actor = await Actor.create(actorData)
                        await actor.createEmbeddedDocuments("Item", creature.Powers)
                        await actor.createEmbeddedDocuments("Item", creature.Traits)
                        return actor
                    }
                }

                for (const creature of encounter.Creatures) {
                    const actor = await processCreature(creature)

                    if (actor) {
                        // work around because advancedCals does not want to be set on import.
                        // also to get the token size to update properly
                        actor.update({
                            "system.advancedCals" : true,
                            "system.details.size" : creature.Data.details.size
                        }, { forceSizeUpdate: true})
                    }

                }

                for (const trap of encounter.Traps) {
                    const actor = await processCreature(trap, "icons/svg/trap.svg")
                    if (actor) {
                        actor.update({
                            "system.advancedCals" : false
                        })
                    }
                }
            }
        } catch(err) {
            DnD4eTools.log(false, err)
            ui.notifications.error(err);
        }
    }
}