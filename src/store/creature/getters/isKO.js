/**
 * Renvoie true si la créature est KO : ne possède plus de point de vie, mais les dégâts fatals encaissés reste inférieur
 * au nombre de point de vie totaux
 * (créature toujours vivante mais sonnée par les dégâts stunning)
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => getters.getHP <= 0 && state.gauges.damages.stunning > 0
