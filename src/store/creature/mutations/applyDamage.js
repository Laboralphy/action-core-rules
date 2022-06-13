/**
 * Applique des dégâts à la créature
 * @param state
 * @param getters
 * @param mutations
 * @param amount {number} quantité de dégâts à appliquér
 * @param type {number} type de dégâts DAMAGE_TYPE_*
 */
module.exports = ({ state, getters, mutations }, { amount, type }) => {
    if ((type & 1) === 0) {
        mutations.applyLethalDamage({ amount })
    } else {
        mutations.applyStunningDamage({ amount })
    }
}
