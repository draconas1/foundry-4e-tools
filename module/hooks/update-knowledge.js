
export function addActorContextMenuUpdateMonsterKnowledge(html, entryOptions) {
    entryOptions.push({
        name: game.i18n.localize("TOOLS4E.context.update-monster-knowledge"),
        condition: target => {
            const id = target.attr('data-document-id')
            const actor = game.actors.get(id);
            return actor?.data.type === 'NPC'
        },
        icon: '<i class="fas fa-book"></i>',
        callback: target => {
            const id = target.attr('data-document-id')
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
            const details = actor.data.data.details
            const description = knowledge.data.data.description.value;
            let lines = description.split("\n")
            const config = game.dnd4eBeta.config
            // try to get the old name out of the power effects.  This is an imperfect science.
            const oldName = lines[0].replace('<h1>', '').replace('</h1>', '')
            lines = lines.map(x => x.replaceAll(oldName, actor.data.name).replaceAll(oldName.toLowerCase(), actor.data.name.toLowerCase()))

            lines[0] = `<h1>${actor.data.name}</h1>`
            lines[1] = `<p><strong>Role: </strong>level ${details.level} ${config.actorSizes[details.size]} ${config.creatureRoleSecond[details.role.secondary]} ${config.creatureRole[details.role.primary]}${details.role.leader ? " (leader)" : ""}</p>`
            lines[2] = `<p><strong>Type: </strong>${config.creatureOrigin[details.origin]} ${config.creatureType[details.type]} ${details.other ? "(" + details.other + ")" : ""}</p>`
            lines[3] = `<p><strong>Typical Alignment: </strong>${details.alignment}</p>`
            const newDescription = lines.join("\n")
            await knowledge.update({"data.description.value" : newDescription})
        }
    }

    const hardKnowledgeName = "Monster Knowledge (hard)"
    const medKnowledgeName = "Monster Knowledge (med)"

    await updateKnowledge(actor, hardKnowledgeName)
    await updateKnowledge(actor, medKnowledgeName)
    ui.notifications.info(actor.data.name + " updated")
}