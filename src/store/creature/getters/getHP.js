/**
 * Renvoie le nombre de points de vie restant à la creature
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => getters.getAttributeLIF - getters.getDamages