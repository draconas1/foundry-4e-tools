export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        dnd4e = game.dnd4e
        /**
         * Handle action click
         * Called by Token Action HUD Core when an action is left or right-clicked
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionClick (event, encodedValue) {
            const [actionTypeId, actionId] = encodedValue.split(this.delimiter)

            const renderable = ['item']

            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                return this.doRenderItem(this.actor, actionId)
            }

            const knownCharacters = ['Player Character', 'NPC']

            // If single actor is selected
            if (this.actor) {
                await this.#handleAction(event, this.actor, this.token, actionTypeId, actionId)
                return
            }

            const controlledTokens = canvas.tokens.controlled
                .filter((token) => knownCharacters.includes(token.actor?.type))

            // If multiple actors are selected
            for (const token of controlledTokens) {
                const actor = token.actor
                await this.#handleAction(event, actor, token, actionTypeId, actionId)
            }
        }

        /**
         * Handle action hover
         * Called by Token Action HUD Core when an action is hovered on or off
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionHover (event, encodedValue) {}

        /**
         * Handle group click
         * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
         * @override
         * @param {object} event The event
         * @param {object} group The group
         */
        async handleGroupClick (event, group) {}

        /**
         * Handle action
         * @private
         * @param {object} event        The event
         * @param {object} actor        The actor
         * @param {object} token        The token
         * @param {string} actionTypeId The action type id
         * @param {string} actionId     The actionId
         */
        async #handleAction (event, actor, token, actionTypeId, actionId) {
            switch (actionTypeId) {
                case "ability":
                    this.dnd4e.tokenBarHooks.rollAbility(actor, actionId, event);
                    break;
                case "skill":
                    this.dnd4e.tokenBarHooks.rollSkill(actor, actionId, event);
                    break
                case 'power':
                    this.#handlePowerAction(event, actor, actionId);
                    break
                case 'item':
                    this.#handleItemAction(event, actor, actionId)
                    break
                case 'condition':
                    if (!token) return
                    await this.#toggleCondition(event, actor, token, actionId)
                    break
                case 'effect':
                    await this.#toggleEffect(event, actor, actionId)
                    break
                case 'utility':
                    this.#handleUtilityAction(actor, token, actionId)
                    break

            }
        }

        /**
         * Handle item action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleItemAction (event, actor, actionId) {
            const item = actor.items.get(actionId)
            this.dnd4e.tokenBarHooks.rollItem(actor, item, event);
        }

        #handlePowerAction(event, actor, actionId) {
            const item = actor.items.get(actionId)

            if (this.#needsRecharge(actor, item)) {
                event.currentTarget = { closest : (str) => {return {dataset : { itemId : itemId}}} };
                this.dnd4e.tokenBarHooks.rechargePower(actor, item, event)
                return;
            }

            return this.dnd4e.tokenBarHooks.rollPower(actor, item, event)
        }

        #needsRecharge(actor, item) {
            return item.system.useType === "recharge" && !this.dnd4e.tokenBarHooks.isPowerAvailable(actor, item)
        }

        /**
         * Handle utility action
         * @private
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async #handleUtilityAction (actor, token, actionId) {
            switch (actionId) {
                case "toggleVisibility":
                    token.toggleVisibility();
                    break;
                case "saveDialog":
                    this.dnd4e.tokenBarHooks.saveDialog(actor, event)
                    break;
                case "save":
                    this.dnd4e.tokenBarHooks.quickSave(actor, event)
                    break;
                case "healDialog":
                    this.dnd4e.tokenBarHooks.healDialog(actor, event)
                    break;
                case "initiative":
                    await actor.rollInitiative({ createCombatants: true, event });
                    Hooks.callAll("forceUpdateTokenActionHUD");
                    break;
                case "actionPoint":
                    this.dnd4e.tokenBarHooks.actionPoint(actor, event)
                    break;
                case "secondWind":
                    this.dnd4e.tokenBarHooks.secondWind(actor, event)
                    break;
                case "deathSave":
                    this.dnd4e.tokenBarHooks.deathSave(actor, event)
                    break;
                case 'endTurn':
                    if (game.combat?.current?.tokenId === token.id) {
                        await game.combat?.nextTurn()
                    }
                    break
                }
        }




        /**
         * Toggle Condition
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async #toggleCondition (event, actor, token, actionId) {
            if (!token) return

            const isRightClick = this.isRightClick(event)
            const statusEffect = CONFIG.statusEffects.find(statusEffect => statusEffect.id === actionId)
            const isConvenient = (statusEffect?.flags)
                ? Object.hasOwn(statusEffect.flags, 'dfreds-convenient-effects')
                    ? statusEffect.flags['dfreds-convenient-effects'].isConvenient
                    : null
                : null ??
                actionId.startsWith('Convenient Effect')

            if (game.dfreds && isConvenient) {
                isRightClick
                    ? await game.dfreds.effectInterface.toggleEffect(statusEffect.name ?? statusEffect.label, { overlay: true })
                    : await game.dfreds.effectInterface.toggleEffect(statusEffect.name ?? statusEffect.label)
            }
            else {
                const condition = this.#findCondition(actionId)
                if (!condition) return
                const effect = this.#findEffect(actor, actionId)
                if (effect?.disabled) { await effect.delete() }

                isRightClick
                    ? await token.toggleEffect(condition, { overlay: true })
                    : await token.toggleEffect(condition)
            }

            Hooks.callAll('forceUpdateTokenActionHud')
        }

        /**
         * Toggle Effect
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        async #toggleEffect (event, actor, actionId) {
            const effects = 'find' in actor.effects.entries ? actor.effects.entries : actor.effects
            let effect = effects.find(effect => effect.id === actionId)

            // only allow deletion if effect is directly on this actor
            let internalEffect = true

            // if the effect isn't directly on the actor, search all applicable effects for it
            if (!effect) {
                internalEffect = false
                for (const e of actor.allApplicableEffects()) {
                    if (e.id === actionId) {
                        effect = e
                    }
                }
            }

            if (!effect) return

            const isRightClick = this.isRightClick(event)

            if (isRightClick && internalEffect) {
                await effect.delete()
            } else {
                await effect.update({ disabled: !effect.disabled })
            }

            Hooks.callAll('forceUpdateTokenActionHud')
        }

        /**
         * Find condition
         * @private
         * @param {string} actionId The action id
         * @returns {object}        The condition
         */
        #findCondition (actionId) {
            return CONFIG.statusEffects.find((effect) => effect.id === actionId)
        }

        /**
         * Find effect
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         * @returns {object}        The effect
         */
        #findEffect (actor, actionId) {
            if (game.version.startsWith('11')) {
                return actor.effects.find(effect => effect.statuses.every(status => status === actionId))
            } else {
                // V10
                return actor.effects.find(effect => effect.flags?.core?.statusId === actionId)
            }
        }
    }
})
