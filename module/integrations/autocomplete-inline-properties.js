/**
 * For use with : https://github.com/ghost-fvtt/FVTT-Autocomplete-Inline-Properties
 * @param packageConfig
 */
export function registerAutoCompletePackage(packageConfig) {
    const api = game.modules.get("autocomplete-inline-properties").API;
    const DATA_MODE = api.CONST.DATA_MODE;

    // Define the config for our package
    const config = {
        packageName: "dnd4e",
        sheetClasses: [
            {
                name: "ActiveEffectConfig",
                fieldConfigs: [
                    {
                        selector: `.tab[data-tab="effects"] .key input[type="text"]`,
                        defaultPath: "system",
                        showButton: true,
                        allowHotkey: true,
                        dataMode: DATA_MODE.CUSTOM,
                        customDataGetter: customGetter
                    },
                ],
            }
        ]
    };

    // Add our config
    packageConfig.push(config);
}

function customGetter(sheet) {
    const api = game.modules.get("autocomplete-inline-properties").API;
    const DATA_MODE = api.CONST.DATA_MODE;
    const DATA_GETTERS = api.CONST.DATA_GETTERS;
    const baseData = DATA_GETTERS[DATA_MODE.OWNING_ACTOR_DATA](sheet)

    const powerEffectData = {}

    const effectTypes = ["feat", "item", "power", "racial", "untyped"]
    const keywords = {
        power : [],
        weapon: []
    }

    Object.keys(game.dnd4eBeta.config.effectTypes).forEach((key) => keywords.power.push(key))
    Object.keys(game.dnd4eBeta.config.powerSource).forEach((key) => keywords.power.push(key))
    if (game.dnd4eBeta.config.toolKeys) {
        Object.keys(game.dnd4eBeta.config.toolKeys).forEach((key) => keywords.power.push(key))
        Object.keys(game.dnd4eBeta.config.rangeKeys).forEach((key) => keywords.power.push(key))
    }

    Object.keys(game.dnd4eBeta.config.weaponGroup).forEach((key) => keywords.weapon.push(key))
    Object.keys(game.dnd4eBeta.config.weaponProperties).forEach((key) => keywords.weapon.push(key))

    // old
    if (game.dnd4eBeta.config.implementGroup) {
        Object.keys(game.dnd4eBeta.config.implementGroup).forEach((key) => keywords.weapon.push(key))
    }
    // new
    if (game.dnd4eBeta.config.implement) {
        Object.keys(game.dnd4eBeta.config.implement).forEach((key) => keywords.weapon.push(key))
    }

    Object.keys(game.dnd4eBeta.config.damageTypes).forEach((key) => {
        keywords.power.push(key)
        keywords.weapon.push(key)
    })

    for(const powWep of ["power", "weapon"]) {
        for (const attackDamage of ["attack", "damage"]) {
            for(const keyword of keywords[powWep]) {
                for (const effectType of effectTypes) {
                    createNestedObject(powerEffectData, [powWep,attackDamage,keyword,effectType], 0)
                }
            }
        }
    }

    return {
        ...baseData,
        ...powerEffectData
    }
}

// Function: createNestedObject( base, names[, value] )
//   base: the object on which to create the hierarchy
//   names: an array of strings contaning the names of the objects
//   value (optional): if given, will be the last object in the hierarchy
// Returns: the last object in the hierarchy
function createNestedObject ( base, names, value ) {
    // If a value is given, remove the last name and keep it for later:
    const lastName = arguments.length === 3 ? names.pop() : false;

    // Walk the hierarchy, creating new objects where needed.
    // If the lastName was removed, then the last object is not set yet:
    for( let i = 0; i < names.length; i++ ) {
        base = base[ names[i] ] = base[ names[i] ] || {};
    }

    // If a value was given, set it to the last name:
    if( lastName ) base = base[ lastName ] = value;

    // Return the last object in the hierarchy:
    return base;
}
