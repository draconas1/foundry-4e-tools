import { SystemManager } from './system-manager.js'
import { MODULE, REQUIRED_CORE_MODULE_VERSION } from './constants.js'

Hooks.on('tokenActionHudCoreApiReady', async () => {
    if (game.dnd4e.tokenBarHooks.version < 3 && game.user.isGM) {
        ui.notifications.warn("DRACS TOOLS: Old D&D 4e system detected.  Please upgrade to version <b>0.4.52</b><br>Token Action Hud support for this version is deprecated and will be removed in future.");
    }

    /**
     * Return the SystemManager and requiredCoreModuleVersion to Token Action HUD Core
     */
    const module = game.modules.get(MODULE.ID)
    module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager
    }
    Hooks.call('tokenActionHudSystemReady', module)
})
