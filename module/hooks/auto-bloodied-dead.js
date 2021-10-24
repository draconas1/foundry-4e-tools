import DnD4eTools from "../4e-tools.js";

const dead = "dead"
const dying = "dying"
const bloodied = "bloodied"

export async function setBloodiedDeadOnHPChange(actor, change, options, userId) {
    // only fire this for the user that changed the hp in the first place
    if (userId !== game.user.id) { return;}
    // only fire if the HP changed
    if(change.data?.attributes?.hp?.hasOwnProperty('value')) {
        DnD4eTools.log(false, "Firing bloodied update for " + game.users.get(userId).data.name)
        const newHP = change.data.attributes.hp.value
        const maxHP = actor.data.data.attributes.hp.max
        const bloodiedHP = maxHP / 2
        if (!maxHP) {
            DnD4eTools.log(false, "Could not get actor max HP")
            return;
        }
        DnD4eTools.log(false, newHP + "/" + maxHP)

        // remove any of bloodied, dying or dead as a batch or else we get weird concurrent update issues
        const statusIds = findEffectIds(bloodied, actor).concat(findEffectIds(dying, actor)).concat(findEffectIds(dead, actor))
        await actor.deleteEmbeddedDocuments("ActiveEffect", statusIds)

        if (newHP <= bloodiedHP && newHP > 0 && game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.BLOODIED_ICON)) {
            applyEffectIfNotPresent(bloodied, actor)
        }
        if (newHP <= 0 && game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.DEAD_ICON)) {
            if (actor.data.type === 'NPC') {
                DnD4eTools.log(false, "NPC Dead!")
                applyEffectIfNotPresent(dead, actor)
                defeatInCombat(actor)
            }
            else {
                if (newHP <= 0 - bloodiedHP) {
                    DnD4eTools.log(false, "PC Dead!")
                    applyEffectIfNotPresent(dead, actor)
                    defeatInCombat(actor)
                }
                else {
                    DnD4eTools.log(false, "PC Dying!")
                    applyEffectIfNotPresent(dying, actor)
                    defeatInCombat(actor, false)
                }
            }
        }
        if (newHP > 0 && game.settings.get(DnD4eTools.ID, DnD4eTools.SETTINGS.DEAD_ICON)) {
            defeatInCombat(actor, false)
        }
    }

    function defeatInCombat(actor, defeated = true) {
        const activeCombat = game.combat
        // if we are not runnign a combat, stop now
        if (!activeCombat) { return }
        const updates = []
        for (const token of actor.getActiveTokens()) {
            const matchingCombatants = activeCombat.combatants?.contents?.filter(c => c.data.tokenId === token.id)
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
        activeCombat.updateEmbeddedDocuments("Combatant", updates)
    }

    function applyEffectIfNotPresent(statusToCheck, actor) {
        const bloodiedEffect = actor.effects.find(x => x.data.flags.core?.statusId === statusToCheck)
        if (bloodiedEffect) {
            DnD4eTools.log(false, `Actor already has ${statusToCheck}, not reapplying`)
            return
        }
        else {
            DnD4eTools.log(false, `Actor does not have status ${statusToCheck}.  Applying it`)
        }

        const status = CONFIG.statusEffects.find(x => x.id === statusToCheck)
        const effect = {
            ...status,
            "label" : game.i18n.localize(status.label),
            "flags": {
                "core": {
                    "statusId": statusToCheck,
                    "overlay": true
                }
            }
        }
        delete effect.id

        ActiveEffect.create(effect, { parent : actor })
    }

    function findEffectIds(statusToCheck, actor) {
        return actor.effects.filter(effect => effect.data.flags.core?.statusId === statusToCheck).map(effect => effect.id)
    }
}