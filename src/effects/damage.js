const createEffect = require('./abstract')

/**
 * Inflict damage
 * @param nValue
 * @param type {number} DAMAGE_TYPE_
 * @returns {ActionRulesEffect}
 */
function create (nValue, type) {
    return createEffect('damage', nValue, { type })
}

/**
 * Apply effect modification on effect target
 * @param effect {ActionRulesEffect}
 * @param target {Creature}
 */
function mutate ({ effect, target }) {
    // Removing armor and TGH
    target.store.mutations.applyDamage(effect.amp)
}

module.exports = {
    create,
    mutate
}