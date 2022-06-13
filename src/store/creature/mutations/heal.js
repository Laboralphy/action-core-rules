/**
 * Soigne la créature
 * @param state
 * @param amount {number} nombre de points de santé restauré.
 */
module.exports = ({ state }, { amount }) => {
    const oDamageGauges = state.gauges.damages
    // stuning damage is healed first, then lethal damage
    if (amount <= oDamageGauges.stunning) {
        // healing stunning damage
        oDamageGauges.stunning = Math.max(0, oDamageGauges.stunning - amount)
    } else {
        amount -= oDamageGauges.stunning
        oDamageGauges.stunning = 0
        if (amount > 0) {
            oDamageGauges.lethal = Math.max(0, oDamageGauges.lethal - amount)
        }
    }
}
