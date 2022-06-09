const createEffect = require('./abstract')
/**
 * This effect add a negative condition to the targetted creature
 * @param condition {string} CONDITION_*
 * @returns {ActionEffect}
 */
function create ({ condition }) {
    return createEffect('condition', 1, {
        condition
    })
}

module.exports = {
    create
}
