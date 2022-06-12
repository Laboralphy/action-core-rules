module.exports = (state, getters) => {
    const oWeapon = getters.getEquippedWeapon
    return oWeapon
        ? oWeapon.initiative
        : 0
}
