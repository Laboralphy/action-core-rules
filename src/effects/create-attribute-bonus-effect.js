const { createEffect } = require('./create-effect')

/**
 * Créé un bonus pour un attribut ou une compétence
 * @param sAttribute
 * @param nValue
 * @returns {{duration: number, data: {}, amp: number, tag: *, source: number}}
 */
function createAttributeBonusEffect (sAttribute, nValue) {
    return createEffect('attribute-bonus', nValue, {
        attribute: sAttribute
    })
}

module.exports = {
    createAttributeBonusEffect
}