/**
 * Renvoie true si la creature est encombrée (armor trop lourde)
 * @param state
 * @param getters
 * @return { partially: boolean, greatly: boolean }
 */
module.exports = (state, getters) => ({
    partially: getters.isWearingArmorTooHeavy,
    greatly: state.encumbrance > getters.getCarryCapacity
})
