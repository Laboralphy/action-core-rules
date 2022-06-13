/**
 * Renvoie l'arme actuellement utilisé par le personnage. Ou null, si aucune arme utilisé
 * @param state
 * @returns {*}
 */
module.exports = state => state.equipment[state.combat.weaponUsed]
