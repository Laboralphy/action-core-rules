/**
 * Renvoie la quantité de dégâts encaissés par la créature (somme des dégâts mortels et dégât stun)
 * @param state
 * @returns {number}
 */
module.exports = state => state.gauges.damages.lethal + state.gauges.damages.stunning
