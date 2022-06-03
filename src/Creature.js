const Reactor = require('../libs/o876-rudimentary-reactor')
const { buildInitialState } = require('./state-definition')

class Creature {
    constructor () {
        this._state = buildInitialState()
        this._store = new Reactor({
            state: this._state,
            getters: this._configureGetters(),
            mutations: this._configureMutations()
        })
        this._XXX = 0
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

    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */
    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */
    /* *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** PRIVATE METHODS *** */

     _getAttributeMutationName (sAttr) {
        return 'setAttribute' + sAttr.toUpperCase()
    }

    _getAttributeGetterName (sAttr) {
        return 'getAttribute' + sAttr.toUpperCase()
    }

    _getBonusGetterName (sAttr) {
        return 'getBonus' + sAttr.toUpperCase()
    }

    _configureMainAttributeGetter (oGetters, sAttribute) {
        oGetters[this._getAttributeGetterName(sAttribute)] = (state, getters) => {
            return Math.max(0,
                state.attributes.main[sAttribute].value +
                getters[this._getBonusGetterName(sAttribute)]
            )
        }
    }

    _clamp (min, max, value) {
         return Math.max(min, Math.min(max, value))
    }

    _configureAttributeBonusGetter (oGetters, sAttribute) {
        oGetters[this._getBonusGetterName(sAttribute)] = state =>
            Math.max(0, state
                .effects
                .filter(eff => eff.tag === 'attribute-bonus' && eff.data.attribute === sAttribute)
                .reduce((value, eff) => value + eff.amp, 0)
            )
    }

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
        return oGetters
    }

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
        return oMutations
    }
}

module.exports = Creature
