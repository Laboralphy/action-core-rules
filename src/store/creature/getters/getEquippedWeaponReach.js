/**
 * Renvoie la portée de l'arme équippée
 * @param state
 * @param getters
 * @returns {number}
 */
const { WEAPON_REACH_UNARMED, WEAPON_REACH_RANGED} = require("../../../config");
module.exports = (state, getters) => {
    const oWeapon = getters.getEquippedWeapon
    if (!oWeapon) {
        return WEAPON_REACH_UNARMED
    }
    if (oWeapon.weapon.melee) {
       return oWeapon.weapon.melee.reach
    }
    if (oWeapon.weapon.ranged) {
        return WEAPON_REACH_RANGED
    }
    return WEAPON_REACH_UNARMED
}
