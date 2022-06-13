/**
 * Renvoie le bonus de précision conféré par l'arme utilisée
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const oWeapon = getters.getEquippedWeapon
    return oWeapon
        ? oWeapon.weapon.accuracy
        : 0
}
