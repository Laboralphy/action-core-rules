/**
 * Renvoie le bonus d'initiative conféré par l'arme équippée
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getEquippedWeapon
    return oWeapon
        ? oWeapon.weapon.initiative
        : 0
}
