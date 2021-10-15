import DnD4eTools from "../4e-tools.js";

export default class CreatureImporterScreen extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const title = game.i18n.localize("TOOLS4E.import-json-screen.title")
        const overrides = {
            height: 'auto',
            id: 'creature-import',
            template: DnD4eTools.TEMPLATES.IMPORTER_INPUT,
            title: title,
            userId: game.userId
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    async _updateObject(event, formData) {
        let obj = "";

        try{
            obj = JSON.parse(('Pasted content: ', formData.masterPlanInput))
        } catch(err) {
            DnD4eTools.log(false, "Invalid JSON Input")
            ui.notifications.error("Invalid Input, JSON formatting did not validate");
            return;
        }

        for (const encounter of obj) {
            for (const creature of encounter.Creatures) {
                DnD4eTools.log(false, "Importing " + creature.Name)
                let actor = await Actor.create(
                    {
                        "name" : creature.Name,
                        "type" : "NPC",
                        "data" : creature.Data
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
                actor.update({
                    "data.advancedCals" : true
                })
            }
        }
    }
}