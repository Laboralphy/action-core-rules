const Reactor = require('../libs/o876-rudimentary-reactor')
const { buildInitialState } = require('./creature-state-definition')
const CONFIG = require('./config')
const { getNextId } = require('./IdentifierRegistry')

class Creature {
    constructor () {
        this._id = getNextId()
        this._state = buildInitialState()
        this._store = new Reactor({
            state: this._state,
            getters: this._configureGetters(),
            mutations: this._configureMutations()
        })
        this._effectProcessor = null
    }

    get CONSTS () {
        return CONSTS
    }

    set effectProcessor (value) {
        this._effectProcessor = value
    }

    get effectProcessor () {
        return this._effectProcessor
    }

    set id (value) {
        this._id = value
    }

    get id () {
        return this._id
    }

    get store () {
        return this._store
    }

    setAttribute (sAttr, nValue) {
        const oMutations = this._store.mutations
        const sMutName = this._getAttributeMutationName(sAttr)
        if (sMutName in oMutations) {
            oMutations[sMutName]({ value: nValue })
        } else {
            throw new Error('ERR_UNKNOWN_ATTRIBUTE: ' + sAttr)
        }
    }

    getAttribute (sAttr) {
        return this._store.getters[this._getAttributeGetterName(sAttr)]
    }

    applyEffect (oEffect, {
        target,
        duration = 0,
        source = null
    }) {
        oEffect.target = target
        oEffect.source = source || target
        oEffect.duration = duration || 0
        this._effectProcessor.m
        this.store.state.effects.push(oEffect)
    }

    processEffects () {

    }

    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */
    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */
    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */

    /**
     * Keep a value ina range
     * @param value {number}
     * @param min {number}
     * @param max {number}
     * @returns {number}
     * @private
     */
    _clamp (value, min, max) {
        return Math.max(min, Math.min(max, value))
    }

    /**
     * Compose attribute mutation name
     * @param sAttr {string}
     * @returns {string} mutation name
     * @private
     */
     _getAttributeMutationName (sAttr) {
        return 'setAttribute' + sAttr.toUpperCase()
    }

    /**
     * Compose a given attribute getter name
     * @param sAttr {string} attribute
     * @returns {string} getter name
     * @private
     */
    _getAttributeGetterName (sAttr) {
        return 'getAttribute' + sAttr.toUpperCase()
    }

    /**
     * Compose bonus getter name for a given attribute
     * @param sAttr {string} attribute
     * @returns {string} getter name
     * @private
     */
    _getBonusGetterName (sAttr) {
        return 'getBonus' + sAttr.toUpperCase()
    }

    /**
     * Configure getters for a main attribute
     * @param oGetters
     * @param sAttribute {string}
     * @private
     */
    _configureMainAttributeGetter (oGetters, sAttribute) {
        oGetters[this._getAttributeGetterName(sAttribute)] = (state, getters) => {
            return Math.max(0,
                state.attributes.main[sAttribute].value +
                getters[this._getBonusGetterName(sAttribute)]
            )
        }
    }

    /**
     * Configure getters for attribute bonus
     * @param oGetters
     * @param sAttribute {string}
     * @private
     */
    _configureAttributeBonusGetter (oGetters, sAttribute) {
        oGetters[this._getBonusGetterName(sAttribute)] = state =>
            Math.max(0, state
                .effects
                .filter(eff => eff.tag === CONFIG.ATTRIBUTE_MODIFIER_EFFECT && eff.data.attribute === sAttribute)
                .reduce((value, eff) => value + eff.amp, 0)
            )
    }

    /**
     * Configure getters for derivated attribute
     * @param oGetters
     * @param sAttribute
     * @private
     */
    _configureDerivatedAttributeGetter (oGetters, sAttribute) {
        oGetters[this._getAttributeGetterName(sAttribute)] = (state, getters) => {
            const { weights = {}, add = 0 } = state.attributes.derivated[sAttribute]
            let nValue = add + getters[this._getBonusGetterName(sAttribute)]
            for (const sAttr in weights) {
                const w = weights[sAttr]
                if ((sAttr in state.attributes.main) || (sAttr in state.attributes.derivated)) {
                    const nAttrValue = getters[this._getAttributeGetterName(sAttr)]
                    nValue += w * nAttrValue
                }
            }
            return Math.ceil(nValue)
        }
    }

    /**
     * Configure getters for attributes (main and derivated)
     * @returns {{}}
     * @private
     */
    _configureGetters () {
        const oGetters = {}
        for (const a in this._state.attributes.main) {
            this._configureAttributeBonusGetter(oGetters, a)
            this._configureMainAttributeGetter(oGetters, a)
        }
        for (const a in this._state.attributes.derivated) {
            this._configureAttributeBonusGetter(oGetters, a)
            this._configureDerivatedAttributeGetter(oGetters, a)
        }

        oGetters.getDamages = state => state.gauges.damages.lethal + state.gauges.damages.stunning
        oGetters.getHP = (state, getters) => getters.getAttributeLIF - getters.getDamages
        oGetters.isAlive = (state, getters) => getters.getHP > 0
        oGetters.isKO = (state, getters) => getters.getHP <= 0 && state.gauges.damages.stunning > 0
        oGetters.isDead = (state, getters) => state.gauges.damages.lethal >= getters.getAttributeLIF

        return oGetters
    }

    /**
     * Configure mutations for Attribute
     * @returns {{}}
     * @private
     */
    _configureMutations () {
        const oMutations = {}
        Object
            .keys(this._state.attributes.main)
            .forEach(a => {
                oMutations[this._getAttributeMutationName(a)] =
                    ({ state }, { value }) => {
                        state.attributes.main[a].value = Math.max(0, Math.floor(value))
                    }
            })
        /**
         * Inflict PHYSICAL damage to the creature.
         * Type may be 1 (lethal) or 2 (stunning)
         * If a creature get HP below 0, it cannot take stunning damage anymore
         * Instead, the stunning damage (if any, is replaced by lethal)
         * @param state
         * @param getters
         * @param amount {number}
         */
        oMutations.applyLethalDamage = ({ state, getters }, { amount }) => {
            const oDamageGauges = state.gauges.damages
            if (getters.isKO) {
                // replace stunning damage first
                oDamageGauges.stunning = Math.max(0, oDamageGauges.stunning - amount)
            }
            oDamageGauges.lethal += amount
        }
        /**
         * Stunning damage is apply only of creature is alive
         * @param state
         * @param getters
         * @param amount {number}
         */
        oMutations.applyStunningDamage = ({ state, getters }, { amount }) => {
            const oDamageGauges = state.gauges.damages
            if (getters.isAlive) {
                oDamageGauges.stunning += amount
            }
        }
        oMutations.applyDamage = ({ state, getters, mutations }, { amount, type }) => {
            if ((type & 1) === 0) {
                mutations.applyLethalDamage({ amount })
            } else {
                mutations.applyStunningDamage({ amount })
            }
        }
        oMutations.heal = ({ state }, { amount }) => {
            const oDamageGauges = state.gauges.damages
            // stuning damage is healed first, then lethal damage
            if (amount <= oDamageGauges.stunning) {
                // healing stunning damage
                oDamageGauges.stunning = Math.max(0, oDamageGauges.stunning - amount)
            } else {
                amount -= oDamageGauges.stunning
                oDamageGauges.stunning = 0
                if (amount > 0) {
                    oDamageGauges.lethal = Math.max(0, oDamageGauges.lethal - amount)
                }
            }
        }

        oMutations.equipItem = ({ state }, { slot, item }) => {
            if (slot in state.equipment) {
                state.equipment[slot] = item
            } else {
                throw new Error('ERR_EQUIPMENT_SLOT_INVALID: ' + slot)
            }
        }
        return oMutations
    }
}

module.exports = Creature
