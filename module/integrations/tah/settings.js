import { MODULE } from './constants.js'

/**
 * Register module settings
 * Called by Token Action HUD Core to register Token Action HUD system module settings
 * @param {function} coreUpdate Token Action HUD Core update function
 */
export function register (coreUpdate) {
    game.settings.register(MODULE.ID, 'displayUnequipped', {
        name: game.i18n.localize('tokenActionHud.dnd4e.settings.displayUnequipped.name'),
        hint: game.i18n.localize('tokenActionHud.dnd4e.settings.displayUnequipped.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    game.settings.register(MODULE.ID, 'abbreviateSkills', {
        name: game.i18n.localize('tokenActionHud.dnd4e.settings.abbreviateSkills.name'),
        hint: game.i18n.localize('tokenActionHud.dnd4e.settings.abbreviateSkills.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    game.settings.register(MODULE.ID, 'hideUsedPowers', {
        name: game.i18n.localize('tokenActionHud.dnd4e.settings.hideUsedPowers.name'),
        hint: game.i18n.localize('tokenActionHud.dnd4e.settings.hideUsedPowers.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })

    game.settings.register(MODULE.ID, 'forcePowerColours', {
        name: game.i18n.localize('tokenActionHud.dnd4e.settings.forcePowerColours.name'),
        hint: game.i18n.localize('tokenActionHud.dnd4e.settings.forcePowerColours.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            coreUpdate(value)
        }
    })
}
