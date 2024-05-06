/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'foundry-4e-tools'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '1.5'

export const VALID_ACTOR_TYPES = ["Player Character", "NPC"]

export const FEATURES = {
    raceFeats: { id: 'raceFeats', name: "DND4E.FeatRace", type: 'system' },
    classFeats: { id: 'classFeats', name: "DND4E.FeatClass", type: 'system' },
    pathFeats: { id: 'pathFeats', name: "DND4E.FeatPath", type: 'system' },
    destinyFeats: { id: 'destinyFeats', name: "DND4E.FeatDestiny", type: 'system' },
    feat: { id: 'feat', name: "DND4E.FeatLevel", type: 'system' },
    ritual: { id: 'ritual', name: "DND4E.FeatRitual", type: 'system' }
}

const POWER_GROUPS_RAW = {
    standard: { label: "DND4E.ActionStandard", items: [], dataset: {type: "standard"} },
    move: { label: "DND4E.ActionMove", items: [], dataset: {type: "move"} },
    minor: { label: "DND4E.ActionMinor", items: [], dataset: {type: "minor"} },
    free: { label: "DND4E.ActionFree", items: [], dataset: {type: "free"} },
    reaction: { label: "DND4E.ActionReaction", items: [], dataset: {type: "reaction"} },
    interrupt: { label: "DND4E.ActionInterrupt", items: [], dataset: {type: "interrupt"} },
    opportunity: { label: "DND4E.ActionOpportunity", items: [], dataset: {type: "opportunity"} },
    inherent: { label: "DND4E.Inherent", items: [], dataset: {type: "inherent"} },
    class: { label: "DND4E.Class", items: [], dataset: {type: "class"} },
    race: { label: "DND4E.Race", items: [], dataset: {type: "race"} },
    paragon: { label: "DND4E.Paragon", items: [], dataset: {type: "paragon"} },
    epic: { label: "DND4E.Epic", items: [], dataset: {type: "epic"} },
    theme: { label: "DND4E.Theme", items: [], dataset: {type: "theme"} },
    feat: { label: "DND4E.Feat", items: [], dataset: {type: "feat"} },
    attack: { label: "DND4E.PowerAttack", items: [], dataset: {type: "attack"} },
    utility: { label: "DND4E.PowerUtil", items: [], dataset: {type: "utility"} },
    feature: { label: "DND4E.PowerFeature", items: [], dataset: {type: "feature"} },
    atwill: { label: "DND4E.PowerAt", items: [], dataset: {type: "atwill"} },
    encounter: { label: "DND4E.PowerEnc", items: [], dataset: {type: "encounter"} },
    daily: { label: "DND4E.PowerDaily", items: [], dataset: {type: "daily"} },
    item: { label: "DND4E.PowerItem", items: [], dataset: {type: "item"} },
    recharge: { label: "DND4E.PowerRecharge", items: [], dataset: {type: "recharge"} },
    other: { label: "DND4E.Other", items: [], dataset: {type: "other"} }
}

export const POWER_GROUPS = Object.entries(POWER_GROUPS_RAW).map(([name, item]) => ({
    id: `${name}Power`,
    name: item.label,
    type: 'system'
})).reduce((a, v) => ({ ...a, [v.id]: v}), {})


/**
 * Item types
 */
export const ITEM_TYPE = {
    armor: { id: 'armor', name: 'DND4E.Armour', type: 'system' },
    equipment: { id: 'equipment', name: 'TYPES.Item.equipment', type: 'system' },
    backpack: { id: 'consumable', name: 'TYPES.Item.consumable', type: 'system' },
    consumable: { id: 'container', name: 'TYPES.Item.backpack', type: 'system' },
    weapon: { id: 'weapon', name: 'TYPES.Item.weapon', type: 'system' },
    tool: { id: 'tool', name: 'TYPES.Item.tool', type: 'system' },
    loot: { id: 'weapon', name: 'TYPES.Item.loot', type: 'system' },
}

/**
 * Groups
 */
export const GROUP = {
    ...ITEM_TYPE,

    ...FEATURES,

    abilities: { id: 'abilities', name: 'DND4E.Ability', type: 'system' },
    skills: { id: 'skills', name: 'DND4E.Skills', type: 'system' },

    conditions: { id: 'conditions', name: 'tokenActionHud.dnd4e.conditions', type: 'system' },
    passiveEffects: { id: 'passive-effects', name: 'tokenActionHud.dnd4e.effectPassive', type: 'system' },
    temporaryEffects: { id: 'temporary-effects', name: 'tokenActionHud.dnd4e.effectTemporary', type: 'system' },

    rests: { id: 'rests', name: 'DND4E.Rests', type: 'system' },
    saves: { id: 'saves', name: 'tokenActionHud.dnd4e.saves', type: 'system' },
    healing: { id: 'healing', name: 'DND4E.Healing', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },

    ...POWER_GROUPS
}



