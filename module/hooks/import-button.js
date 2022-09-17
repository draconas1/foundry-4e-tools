import CreatureImporterScreen from "../screens/creature-import.js";
import DnD4eTools from "../4e-tools.js";

export function addImportMonsterButton(activeTab, html) {
    // fire only for GM on actors tab
    if (activeTab.options.id === "actors" && game.user.isGM) {
        DnD4eTools.log(false, "Adding import button to Actors tab")

        // create localized tooltip
        const tooltip = game.i18n.localize('TOOLS4E.buttons.importer-launch-button');
        const button = $(`<div class="action-buttons flexrow mpimport"><button type='button' id="mp-import-button" title=' ${tooltip}'><i class="fas fa-user"></i>${tooltip}</button></div>`)

        // nuke button to clear historical actors for me
        if (DnD4eTools.devMode()) {
            button.append($(`<button type='button' id="4et-clear-all-button" title='Nuke All Actors'>Nuke All Actors</button>`))
        }

        // find the header button element and add
        const topBar = html.find(`[class="header-actions action-buttons flexrow"]`)
        topBar.after(button)

        html.on('click', '#mp-import-button', (event) => {
            new CreatureImporterScreen().render(true);
        });

        if (DnD4eTools.devMode()) {
            html.on('click', '#4et-clear-all-button', (event) => {
                Dialog.confirm({
                    title: "Are You Sure?",
                    content: "Nuke all The Actors?",
                    yes: () => {
                        game.actors.forEach(t => { if (!t.folder) { t.delete(); } });
                    },
                    no: () => {ui.notifications.info("No was pressed!")},
                    defaultYes: true
                });
            });
        }
    }
}