const { Validator } = require('jsonschema')
const { suggest } = require('@laboralphy/did-you-mean')
const PROPS = require('./blueprints-props')
const ACTORS = require('./blueprints-actors')
const ITEMS = require('./blueprints-items')
const SCHEMAS = require('./schemas')

class BlueprintFactory {
  constructor () {
    this._blueprints = {
      ...PROPS,
      ...ACTORS,
      ...ITEMS
    }
    this.SCHEMAS = SCHEMAS
    this._validBlueprints = {}
    this._validator = new Validator()
  }

  addBlueprint (sResRef, oBlueprint) {
    this._blueprints[sResRef] = oBlueprint
  }

  /**
   * Renvoie la liste de tous les blueprints définis dans la factory
   * @returns {*|{}}
   */
  getBlueprints () {
    return this._blueprints
  }

  /**
   * Renvoie le blueprint spécifié
   * Le blueprint est validé par le schema
   * @param sResRef {string} ressource reference : identifiant du blueprint
   * @returns {*}
   */
  getBlueprint (sResRef) {
    if (typeof sResRef !== 'string') {
      throw new TypeError('resref is expected to be a string ; ' + (typeof sResRef) + ' given.')
    }
    if (sResRef in this._validBlueprints) {
      return this._validBlueprints[sResRef]
    } else if (sResRef in this._blueprints) {
      const bp = this._blueprints[sResRef]
      let res
      switch (bp.entityType) {
        case 'ENTITY_TYPE_ACTOR':
          res = this._validator.validate(bp, this.SCHEMAS.CREATURE_BLUEPRINT)
          break

        case 'ENTITY_TYPE_ITEM':
          res = this._validator.validate(bp, this.SCHEMAS.ITEM_BLUEPRINT)
          break

        default:
          res = { valid: true }
      }
      if (res.valid) {
        this._validBlueprints[sResRef] = bp
      } else {
        res.errors.forEach(err => console.error(err.stack))
        throw new Error('this blueprint (' + sResRef + ') is invalid : ')
      }
      return bp
    } else {
      throw new Error('could not find "' + sResRef + '". did you mean : ' + suggest(sResRef, Object.keys(this._blueprints)) + ' ?')
    }
  }
}

module.exports = BlueprintFactory
