import DnD4eTools from "../4e-tools.js";

export function setDeadIcon() {
    const deadStatus = CONFIG.statusEffects.find(x => x.id === "dead");
    DnD4eTools.FLAGS.ORIGINAL_DEAD_STATUS_ICON = deadStatus.icon;
    DnD4eTools.setDeadIcon()
}