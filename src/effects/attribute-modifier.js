const createEffect = require('./abstract')
/**
 * This effect modifies an attribute by adding/subtracting an fixed value
 * @param sAttribute {string} attribute to be modified
 * @param nValue {number}
 * @returns {ActionRulesEffect}
 */
function create (sAttribute, nValue) {
    return createEffect('attribute-modifier', nValue, {
        attribute: sAttribute
    })
}

module.exports = {
    create
}