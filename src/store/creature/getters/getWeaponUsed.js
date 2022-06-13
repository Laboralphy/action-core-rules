/**
 * Renvoie l'arme qui est actuellement utilisée par la creature
 * @param state
 * @returns {*}
 */
module.exports = state => state.equipment[state.weaponUsed]