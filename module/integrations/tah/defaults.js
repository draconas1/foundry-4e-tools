import {STATIC_GROUPS, GROUP, POWER_GROUPS} from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    coreModule.api.Logger.info(`Detected dnd4e tokenBarHooks version 3+`)
    if (game.dnd4e.tokenBarHooks.version >= 3) {
        coreModule.api.Logger.info(`Detected dnd4e tokenBarHooks version 3+`)
        // convert the dnd 4e config to a TAH group
        const dndToGroup = (dndGroups, idSuffix) => {
            const group = {}
            for (const [key, value] of Object.entries(dndGroups)) {
                const newId = `${key}${idSuffix}`
                group[newId] = {
                    id: newId,
                    name: value.label,
                    type: 'system'
                }
            }
            return group
        }

        // convert into an array and add nestId
        // sort such that "other" is always at the bottom
        const groupToLayout = (groupType, tahGroup) => {
            const layout =  Object.values(tahGroup).map(group => {
                return {
                    ...group,
                    nestId: `${groupType}_${group.id}`
                }
            })
            layout.sort(function(a, b) {
                if (a.id === "otherPower") {
                    return 1
                }
                if (b.id === "otherPower") {
                    return -1
                }
                return 0
            })
            return layout
        }

        // convert the dnd 4e config to a TAH group
        const featureGroups = dndToGroup(game.dnd4e.config.featureTypes, "")
        const inventoryGroups = dndToGroup(game.dnd4e.config.inventoryTypes, "")

        // Power groups are nested
        /*
        {
	        action: {
		        standard: {label: "DND4E.ActionStandard" }
		        ...
		    },
		    usage: {
         */
        let powerGroupsFlattened = {}
        Object.values(game.dnd4e.config.powerGroupings).forEach(grouping => {
            for (const [key, value] of Object.entries(grouping)) {
                powerGroupsFlattened[key] = value
            }
        })

        // add triggered actions for Fox's sheet
        powerGroupsFlattened.triggered = {
            name: "triggered-actions",
            label: "Fox4e.GroupTriggered"
        }

        const powerGroups = dndToGroup(powerGroupsFlattened, "Power")


        const groups = {
            ...STATIC_GROUPS,
            ...featureGroups,
            ...inventoryGroups,
            ...powerGroups,
        }

        Object.values(groups).forEach(group => {
            group.name = coreModule.api.Utils.i18n(group.name)
            group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
        })


        const groupsArray = Object.values(groups)


        DEFAULTS = {
            layout: [
                {
                    nestId: 'abilities',
                    id: 'abilities',
                    name: coreModule.api.Utils.i18n('DND4E.Ability'),
                    groups: [
                        { ...groups.abilities, nestId: 'abilities_abilities' },
                    ]
                },
                {
                    nestId: 'skills',
                    id: 'skills',
                    name: coreModule.api.Utils.i18n('DND4E.Skills'),
                    groups: [
                        { ...groups.skills, nestId: 'skills_skills' },
                    ]
                },
                {
                    nestId: 'powers',
                    id: 'powers',
                    name: coreModule.api.Utils.i18n('DND4E.Powers'),
                    groups: groupToLayout('powers', powerGroups)
                },
                {
                    nestId: 'features',
                    id: 'features',
                    name: coreModule.api.Utils.i18n('DND4E.Features'),
                    groups: groupToLayout('features', featureGroups)
                },
                {
                    nestId: 'inventory',
                    id: 'inventory',
                    name: coreModule.api.Utils.i18n('DND4E.Inventory'),
                    groups: groupToLayout('inventory', inventoryGroups)
                },
                {
                    nestId: 'effects',
                    id: 'effects',
                    name: coreModule.api.Utils.i18n('tokenActionHud.dnd4e.conditions'),
                    groups: [
                        { ...groups.conditions, nestId: 'effects_conditions' },
                        { ...groups.temporaryEffects, nestId: 'effects_temporary-effects' },
                        { ...groups.passiveEffects, nestId: 'effects_passive-effects' }
                    ]
                },
                {
                    nestId: 'utility',
                    id: 'utility',
                    name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                    groups: [
                        { ...groups.combat, nestId: 'utility_combat' },
                        { ...groups.saves, nestId: 'utility_saves' },
                        { ...groups.healing, nestId: 'utility_heal' },
                        { ...groups.token, nestId: 'utility_token' },
                        { ...groups.rests, nestId: 'utility_rests' },
                        { ...groups.utility, nestId: 'utility_utility' }
                    ]
                }
            ],
            groups: groupsArray
        }
    }
    else {
        coreModule.api.Logger.info(`Detected dnd4e tokenBarHooks version 2.  LEGACY MODE ENGAGED`)
        const groups = GROUP
        Object.values(groups).forEach(group => {
            group.name = coreModule.api.Utils.i18n(group.name)
            group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
        })
        const groupsArray = Object.values(groups)
        const powerGroups = Object.entries(POWER_GROUPS)
            .map(([name, item]) => ({ ...item, nestId: `powers_${name}`}))

        DEFAULTS = {
            layout: [
                {
                    nestId: 'abilities',
                    id: 'abilities',
                    name: coreModule.api.Utils.i18n('DND4E.Ability'),
                    groups: [
                        { ...groups.abilities, nestId: 'abilities_abilities' },
                    ]
                },
                {
                    nestId: 'skills',
                    id: 'skills',
                    name: coreModule.api.Utils.i18n('DND4E.Skills'),
                    groups: [
                        { ...groups.skills, nestId: 'skills_skills' },
                    ]
                },
                {
                    nestId: 'powers',
                    id: 'powers',
                    name: coreModule.api.Utils.i18n('DND4E.Powers'),
                    groups: powerGroups
                },
                {
                    nestId: 'features',
                    id: 'features',
                    name: coreModule.api.Utils.i18n('DND4E.Features'),
                    groups: [
                        { ...groups.raceFeats, nestId: 'features_raceFeats' },
                        { ...groups.classFeats, nestId: 'features_classFeats' },
                        { ...groups.pathFeats, nestId: 'features_pathFeats' },
                        { ...groups.destinyFeats, nestId: 'features_destinyFeats' },
                        { ...groups.feat, nestId: 'features_feat' },
                        { ...groups.ritual, nestId: 'features_ritual' }
                    ]
                },
                {
                    nestId: 'inventory',
                    id: 'inventory',
                    name: coreModule.api.Utils.i18n('DND4E.Inventory'),
                    groups: [
                        { ...groups.consumable, nestId: 'inventory_consumable' },
                        { ...groups.weapon, nestId: 'inventory_weapon' },
                        { ...groups.equipment, nestId: 'inventory_equipment' },
                        { ...groups.backpack, nestId: 'inventory_container' },
                        { ...groups.tool, nestId: 'inventory_tool' },
                        { ...groups.loot, nestId: 'inventory_loot' }
                    ]
                },
                {
                    nestId: 'effects',
                    id: 'effects',
                    name: coreModule.api.Utils.i18n('tokenActionHud.dnd4e.conditions'),
                    groups: [
                        { ...groups.conditions, nestId: 'effects_conditions' },
                        { ...groups.temporaryEffects, nestId: 'effects_temporary-effects' },
                        { ...groups.passiveEffects, nestId: 'effects_passive-effects' }
                    ]
                },
                {
                    nestId: 'utility',
                    id: 'utility',
                    name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                    groups: [
                        { ...groups.combat, nestId: 'utility_combat' },
                        { ...groups.saves, nestId: 'utility_saves' },
                        { ...groups.healing, nestId: 'utility_heal' },
                        { ...groups.token, nestId: 'utility_token' },
                        { ...groups.rests, nestId: 'utility_rests' },
                        { ...groups.utility, nestId: 'utility_utility' }
                    ]
                }
            ],
            groups: groupsArray
        }
    }
    coreModule.api.Logger.info(`Defaults set to:`)
    coreModule.api.Logger.info(JSON.stringify(DEFAULTS))
})
