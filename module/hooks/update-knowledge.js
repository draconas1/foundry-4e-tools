
export function addActorContextMenuUpdateMonsterKnowledge(html, entryOptions) {
    entryOptions.push({
        name: game.i18n.localize("TOOLS4E.context.update-monster-knowledge"),
        condition: target => {
            console.log(target)
            const id = target.attributes["data-entry-id"].value
            const actor = game.actors.get(id);
            return actor?.type === 'NPC' && actor?.flags?.masterplan?.imported
        },
        icon: '<i class="fas fa-book"></i>',
        callback: target => {
            const id = target.attributes["data-entry-id"].value
            const actor = game.actors.get(id);
            updateMonsterKnowledge(actor)
        }
    })
}

async function updateMonsterKnowledge(actor) {
    const updateKnowledge = async (actor, knowledgeName) => {
        const knowledge = actor.items.find(item => item.name === knowledgeName)
        if (!knowledge) {
            ui.notifications.error(`Could not find class feature ${knowledgeName} was this monster imported from Masterplan?`)
        }
        else {
            const details = actor.system.details
            const description = knowledge.system.description.value;
            let lines = description.split("\n")
            const config = game.dnd4e.config
            // try to get the old name out of the power effects.  This is an imperfect science.
            const oldName = lines[0].replace('<h1>', '').replace('</h1>', '')
            lines = lines.map(x => x.replaceAll(oldName, actor.name).replaceAll(oldName.toLowerCase(), actor.name.toLowerCase()))

            lines[0] = `<h1>${actor.name}</h1>`
            let i = 1
            if (lines[1].startsWith('<h2>')) {
                i = 2
            }
            lines[i] = `<p><strong>Role: </strong>level ${details.level} ${config.actorSizes[details.size]} ${config.creatureRoleSecond[details.role.secondary]} ${config.creatureRole[details.role.primary]}${details.role.leader ? " (leader)" : ""}</p>`
            lines[i + 1] = `<p><strong>Type: </strong>${config.creatureOrigin[details.origin]} ${config.creatureType[details.type]} ${details.other ? "(" + details.other + ")" : ""}</p>`
            lines[i + 2] = `<p><strong>Typical Alignment: </strong>${details.alignment}</p>`
            const newDescription = lines.join("\n")
            await knowledge.update({"data.description.value" : newDescription})
        }
    }

    const hardKnowledgeName = "Monster Knowledge (hard)"
    const medKnowledgeName = "Monster Knowledge (med)"

    await updateKnowledge(actor, hardKnowledgeName)
    await updateKnowledge(actor, medKnowledgeName)
    ui.notifications.info(actor.name + " updated")
}