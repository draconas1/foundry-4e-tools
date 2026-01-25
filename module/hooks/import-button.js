import CreatureImporterScreen from "../screens/creature-import.js";
import DnD4eTools from "../4e-tools.js";


export function addImportMonsterButton(app, html, data) {

    if (game.user.hasPermission("ACTOR_CREATE") && !html.querySelector(".mp-import-button")) {
        DnD4eTools.log(false, "Adding import button to Actors tab")

        const label = game.i18n.localize('TOOLS4E.buttons.importer-launch-button');
        const button = document.createElement("button");
        button.className = "mp-import-button";
        button.innerHTML = `<i class="fas fa-file-import"></i> ${label}`;
        button.style.flex = "1";
        button.style.flexBasis = "100%";

        button.addEventListener("click", (e) => new CreatureImporterScreen().render(true));

        // assuming `html` is a jQuery object, you’ll want its raw element:
        const container = html.querySelector(".header-actions");
        if (container) {
            container.append(button);
        }

        // nuke button to clear historical actors for me
        if (DnD4eTools.devMode()) {
            const nukeButton = document.createElement("button");
            nukeButton.className = "mp-import-button";
            nukeButton.innerHTML = `Nuke All Actors`;
            nukeButton.style.flex = "1";
            nukeButton.style.flexBasis = "100%";

            nukeButton.addEventListener("click", (e) => {
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

            const container = html.querySelector(".header-actions");
            if (container) {
                container.append(nukeButton);
            }
        }
    }
}