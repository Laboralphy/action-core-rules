module.exports = (state, getters) => {
    const oWeapon = getters.getEquippedWeapon
    return oWeapon
        ? oWeapon.accuracy
        : 0
}
