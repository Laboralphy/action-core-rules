/**
 * Applique des dégâts mortels à la creature
 * @param state
 * @param getters
 * @param amount {number} quantité de dégâts mortels
 */
module.exports = ({ state, getters }, { amount }) => {
    const oDamageGauges = state.gauges.damages
    if (getters.isKO) {
        // replace stunning damage first
        oDamageGauges.stunning = Math.max(0, oDamageGauges.stunning - amount)
    }
    oDamageGauges.lethal += amount
}
