/**
 * Applique des dégâts stunning à la creature
 * @param state
 * @param getters
 * @param amount {number} quantité
 */
module.exports = ({ state, getters }, { amount }) => {
    const oDamageGauges = state.gauges.damages
    if (getters.isAlive) {
        oDamageGauges.stunning += amount
    }
}
