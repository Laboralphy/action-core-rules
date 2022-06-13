const { EQUIPMENT_SLOT_CHEST } = require("../../../consts");
module.exports = (state, getters) => {
    const nSTR = getters.getAttributeSTR
    const oArmor = state.equipment[EQUIPMENT_SLOT_CHEST]
    const nArmorMinStrength = oArmor
        ? oArmor.armor.minStrength
        : 0
    return nArmorMinStrength > nSTR
}
