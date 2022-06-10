/**
 * Renvoie la quantité de dégâts encaissés par la créature
 * @param state
 * @returns {number}
 */
module.exports = state => state.gauges.damages.lethal + state.gauges.damages.stunning
