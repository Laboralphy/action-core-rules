/**
 * Renvoie true si le nombre de HP restant est inférieur à 0
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => state.gauges.damages.lethal >= getters.getAttributeLIF
