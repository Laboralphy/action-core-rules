const deepClone = require('../libs/deep-clone')

class Rules {
    constructor () {
        this._entities = {}
        this._blueprints = {}
    }

    get blueprints () {
        return this._blueprints
    }

    createItem (id, sResRef) {
        return this._entities[id] = deepClone(this._blueprints[sResRef])
    }
}
