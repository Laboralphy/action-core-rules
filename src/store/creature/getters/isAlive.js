/**
 * Renvoie true si le nombre de HP restant est supérieur à 0
 * (créature toujours vivante)
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => getters.getHP > 0
