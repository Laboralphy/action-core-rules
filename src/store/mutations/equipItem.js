/**
 * Equip un item sur la creature
 * @param state
 * @param slot
 * @param item
 */
module.exports = ({ state }, { slot, item }) => {
    if (slot in state.equipment) {
        state.equipment[slot] = item
    } else {
        throw new Error('ERR_EQUIPMENT_SLOT_INVALID: ' + slot)
    }
}
