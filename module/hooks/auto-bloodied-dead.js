import DnD4eTools from "../4e-tools.js";

const dead = "dead"
const dying = "dying"
const bloodied = "bloodied"
const prone = "prone"

export async function setBloodiedDeadOnHPChange(actor, change, options, userId) {
    // only fire this for the user that changed the hp in the first place
    if (userId !== game.user.id) { return;}
    // only fire if the HP changed
    if(change.system?.attributes?.hp?.hasOwnProperty('value')) {
        DnD4eTools.log(false, "Firing bloodied update for " + game.users.get(userId).name)
        const newHP = change.system.attributes.hp.value
        const maxHP = actor.system.attributes.hp.max
        if (!maxHP) {
            DnD4eTools.log(false, "Could not get actor max HP")
            return;
        }
        DnD4eTools.log(false, newHP + "/" + maxHP)
        const bloodiedHP = actor.system.details.bloodied

        if (game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.BLOODIED_ICON)) {
            if(newHP > bloodiedHP) {
                await deleteIfPresent(bloodied, actor)
            }
            else if (newHP > 0) {
                await setIfNotPresent(bloodied, actor, game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.LARGE_BLOODIED_ICON))
            }
        }

        if (game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.DEAD_ICON)) {
            if (newHP <= 0) {
                if (actor.type === 'NPC') {
                    DnD4eTools.log(false, "NPC Dead!")
                    await deleteIfPresent(bloodied, actor)
                    await setIfNotPresent(dead, actor)
                    await setIfNotPresent(prone, actor,  false)
                    await defeatInCombat(actor)
                }
                else {
                    if (newHP <= 0 - bloodiedHP) {
                        DnD4eTools.log(false, "PC Dead!")
                        await deleteIfPresent(bloodied, actor)
                        await deleteIfPresent(dying, actor)

                        await setIfNotPresent(prone, actor,  false)
                        await setIfNotPresent(dead, actor)

                        await defeatInCombat(actor)
                    }
                    else {
                        DnD4eTools.log(false, "PC Dying!")
                        await deleteIfPresent(bloodied, actor)
                        await deleteIfPresent(dead, actor)

                        await setIfNotPresent(dying, actor)
                        await setIfNotPresent(prone, actor,  false)

                        await defeatInCombat(actor, false)
                    }
                }
            }
            else {
                await defeatInCombat(actor, false)
                const statusIds = (findEffectIds(dying, actor)).concat(findEffectIds(dead, actor))
                await actor.deleteEmbeddedDocuments("ActiveEffect", statusIds)
            }
        }
    }

    async function defeatInCombat(actor, defeated = true) {
        const activeCombat = game.combat
        // if we are not running a combat, stop now
        if (!activeCombat) { return }
        const updates = []
        for (const token of actor.getActiveTokens()) {
            const matchingCombatants = activeCombat.combatants?.contents?.filter(c => c.tokenId === token.id)
            if (!matchingCombatants || matchingCombatants.length === 0) {
                continue
            }
            const tokenUpdates = matchingCombatants.map(combatant => {
                return {
                    _id: combatant.id,
                    defeated: defeated
                }
            })

            tokenUpdates.forEach(update => updates.push(update))
        }

        if (!updates.length) { return }
        DnD4eTools.log(false, updates)
        await activeCombat.updateEmbeddedDocuments("Combatant", updates)
    }

    async function setIfNotPresent(statusToCheck, actor, overlay = true) {
        const existingEffect = actor.effects.find(x => x.statuses.has(statusToCheck))
        if (existingEffect) {
            DnD4eTools.log(false, `Actor already has ${statusToCheck}, not reapplying`)
            return
        }
        else {
            DnD4eTools.log(false, `Actor does not have status ${statusToCheck}.  Applying it`)
        }

        const status = CONFIG.statusEffects.find(x => x.id === statusToCheck)

        const effect = {
            ...status,
            "name" : game.i18n.localize(status.label),
            "statuses" : [statusToCheck],
            "flags": {
                "core": {
                    "overlay": overlay
                }
            }
        }
        delete effect.id
        await ActiveEffect.create(effect, { parent : actor })
    }

    function findEffectIds(statusToCheck, actor) {
        return actor.effects.filter(effect => effect.statuses.has(statusToCheck)).map(effect => effect.id)
    }

    async function deleteIfPresent(statusToCheck, actor) {
        return actor.deleteEmbeddedDocuments("ActiveEffect", findEffectIds(statusToCheck, actor))
    }
}