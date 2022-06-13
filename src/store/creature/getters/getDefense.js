const CONFIG = require("../../../config");

module.exports = (state, getters) => {
    // défense de base
    const nDefBase = getters.getAttributeDEF
    const oEncumbrance = getters.getEncumbrance
    let nDefMod = 0
    if (state.combat.aware) {
        // + REF si le défenseur n'est pas pris au dépourvu
        nDefMod += oDefender.getters.getAttributeREF
    }
    if (oDefender.getters.isEquippedWithShield) {
        // + Bonus de bouclier
        nDefMod += CONFIG.DEFENSE_BONUS_USING_SHIELD
    }
    if (oEncumbrance.partially) {
        // - Malus d'encombrement armure
        nDefMod -= CONFIG.DEFENSE_BONUS_PARTIALLY_ENCUMBERED
    }
    if (oEncumbrance.greatly) {
        // - Malus d'encombrement inventaire
        nDefMod -= CONFIG.DEFENSE_BONUS_GREATLY_ENCUMBERED
    }
    return nDefBase + nDefMod
}