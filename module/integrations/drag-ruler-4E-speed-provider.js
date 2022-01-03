/**
 * For use with : https://github.com/manuelVo/foundryvtt-drag-ruler
 * @param SpeedProvider
 */
export function registerSpeedProvider(SpeedProvider) {
    class DragRuler4ESpeedProvider extends SpeedProvider {
        get colors() {
            return [
                {id: "walk", default: 0x00FF00, name: "TOOLS4E.dragRuler4ESpeedProvider.speeds.walk"},
                {id: "run", default: 0xffff66, name: "TOOLS4E.dragRuler4ESpeedProvider.speeds.run"},
                {id: "doubleWalk", default: 0xff9966, name: "TOOLS4E.dragRuler4ESpeedProvider.speeds.doubleWalk"},
                {id: "doubleRun", default: 0xff99ff, name: "TOOLS4E.dragRuler4ESpeedProvider.speeds.doubleRun"}
            ]
        }

        getRanges(token) {
            const movement = token.actor.data.data.movement

            // A character can always walk it's base speed and dash twice it's base speed
            const ranges = [
                {range: movement.walk.value, color: "walk"},
                {range: movement.run.value, color: "run"},
                {range: movement.walk.value * 2, color: "doubleWalk"},
                {range: movement.run.value * 2, color: "doubleRun"}
            ]

            return ranges
        }
    }

    dragRuler.registerSystem("dnd4e", DragRuler4ESpeedProvider)
}