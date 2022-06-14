const CONSTS = require('./consts')
const CONFIG = require('./config')
const deepClone = require('../libs/deep-clone')
const deepFreeze = require('../libs/deep-freeze')
const Creature = require('./Creature')
const path = require('path');
const TreeSync = require("../libs/tree-sync");
const { Validator } = require('jsonschema')
const { suggest } = require("@laboralphy/did-you-mean");
const Dice = require('../libs/dice')

// BLUEPRINTS
const BLUEPRINT_PATH = path.resolve(__dirname, './blueprints')
const ITEM_BLUEPRINTS = TreeSync.recursiveRequire(path.join(BLUEPRINT_PATH, 'items'), true)

const SCHEMAS = {
    blueprintItem: require('./schemas/blueprint-item.json'),
    blueprintCreature: {}
}

/**
 * @typedef ActionBlueprintWeaponRanged {object}
 * @property rof {number} rate of fire
 * @property clipSize {number} number of shots available per combat
 * @property ammoType {string} type of ammo
 *
 * @typedef ActionBlueprintWeaponMelee {object}
 * @property reach {number}
 * @property material {string}
 *
 * @typedef ActionBlueprintWeapon {object}
 * @property category {string}
 * @property damage {string}
 * @property damageTypes {string[]}
 * @property initiative {number}
 * @property accuracy {number}
 * @property minStrength {number}
 * @property [melee] {ActionBlueprintWeaponMelee}
 * @property [ranged] {ActionBlueprintWeaponRanged}
 *
 * @typedef ActionBlueprintItem {object}
 * @property type {string}
 * @property itemType {string}
 * @property stackable {boolean}
 * @property weight {number}
 * @property properties {array}
 * @property [weapon] {ActionBlueprintWeapon}
 *
 *
 */

class Rules {
    constructor () {
        this._dice = new Dice()
        this._validator = new Validator()
        this._items = {}
        this._creatures = {}
        this._blueprints = {
            ...ITEM_BLUEPRINTS
        }
        this._validBlueprints = {}
    }

    roll (s) {
        return this._dice.evaluate(s)
    }

    /**
     * Collection of defined blueprints for item creation
     * @returns {ActionBlueprintItem}
     */
    getBlueprint (resref) {
        if (resref in this._validBlueprints) {
            return this._validBlueprints[resref]
        }
        if (resref in this._blueprints) {
            const bp = this._blueprints[resref]
            let oSchema
            switch (bp.type) {
                case CONSTS.ENTITY_TYPE_ITEM: {
                    oSchema = SCHEMAS.blueprintItem
                    break
                }

                case CONSTS.ENTITY_TYPE_CREATURE: {
                    oSchema = SCHEMAS.blueprintCreature
                    break
                }

                default: {
                    throw new Error('ERR_ENTITY_TYPE_INVALID: ' + bp.type)
                }
            }
            const res = this._validator.validate(bp, SCHEMAS.blueprintItem)
            if (res.valid) {
                deepFreeze(bp)
                this._validBlueprints[resref] = bp
                return bp
            } else {
                res.errors.forEach(err => console.error(err.stack))
                throw new Error('ERR_BLUEPRINT_INVALID: ' + resref)
            }
        } else {
            const s = suggest(resref, Object.keys(this._blueprints)).join(', ')
            throw new Error('ERR_BLUEPRINT_NOT_FOUND: ' + resref + ' - suggestion: ' + s)
        }
    }

    addBlueprint (sResRef, oBlueprint) {
        this._blueprints[sResRef] = oBlueprint
    }

    /**
     * Creates an item out of a given blueprint
     * @param id {string} new item identifier
     * @param sResRef {string} blueprint identifier
     * @param stackCount {number} number of items in the stack
     * @returns {*|{}|number|string|boolean}
     */
    createItem (id, sResRef, stackCount = 1) {
        const blueprint = this.getBlueprint(sResRef)
        const bStackable = blueprint.stackable
        if (!bStackable && stackCount !== 1) {
            throw new Error('ERR_NON_STACKABLE_ITEM_MUST_HAVE_ONE_STACKCOUNT: given ' + stackCount)
        }
        const oItem = {
            id,
            resref: sResRef,
            blueprint,
            owner: '',
            stackCount
        }
        this._items[id] = oItem
        return oItem
    }

    /**
     * Creates an instance of Creature
     * @param id {string} new creature id
     * @return {Creature}
     */
    createCreature (id) {
        const oCreature = new Creature()
        oCreature.id = id
        this._creatures[id] = oCreature
        return oCreature
    }

    /**
     * Get creature with given id
     * @param id {string}
     * @returns {Creature}
     */
    getCreature (id) {
        if (id in this._creatures) {
            return this._creatures[id]
        } else {
            throw new Error('ERR_CREATURE_IDENTIFIER_INVALID')
        }
    }

    /**
     * Get item with given id
     * @param id {string}
     * @returns {*}
     */
    getItem (id) {
        if (id in this._items) {
            return this._items[id]
        } else {
            throw new Error('ERR_ITEM_IDENTIFIER_INVALID')
        }
    }

    /**
     * equip an item on one of the creature equipment slot
     * @param idCreature {string}
     * @param idItem {string}
     * @param slot {string}
     */
    equipItem (idCreature, idItem, slot) {
        const oCreature = this.getCreature(idCreature)
        const oItem = this.getItem(idItem)
        oItem.owner = idCreature
        oCreature.store.mutations.equipItem({ slot, item: oItem })
    }

    /**
     * Déterminer qui de l'attaquant ou du defenseur dispose de l'avantage de portée optimale
     * @param oAttacker
     * @param oDefender
     * @returns {string}
     */
    computeWeaponReaches (oAttacker, oDefender) {
        if (oAttacker.store.getters.getEquippedWeaponReach === oDefender.store.getters.getEquippedWeaponReach) {
            // Les deux combattants utilisent des armes de même portée
            return CONSTS.COMBAT_WEAPON_REACH_BALANCED
        }
        const bAtkOD = oAttacker.store.getters.isAtOptimalDistance
        const bDefOD = oDefender.store.getters.isAtOptimalDistance
        if (bAtkOD && !bDefOD) {
            // l'attaquant à l'avantage
            return CONSTS.COMBAT_WEAPON_REACH_ATTACKER_ADVANTAGED
        }
        if (!bAtkOD && bDefOD) {
            // le defenseur a l'avantage
            return CONSTS.COMBAT_WEAPON_REACH_DEFENDER_ADVANTAGED
        }
        return CONSTS.COMBAT_WEAPON_REACH_BALANCED
    }

    /**
     * Calcule la meilleure initiative entre un attaquant et un defenseur
     * @return {boolean} true = attacker attaque ne premier, false = défenseur attaque en premier
     */
    computeInitiative (oAttacker, oDefender) {
        let nAtkIni =
            oAttacker.store.getAttributeINI +
            oAttacker.store.getEquippedWeaponINIBonus +
            this.roll('1d6')
        let nDefIni =
            oDefender.store.getAttributeINI +
            oDefender.store.getEquippedWeaponINIBonus +
            this.roll('1d6')
        // bonus de portée d'arme
        const bAtkOD = oAttacker.store.getters.isAtOptimalDistance
        const bDefOD = oDefender.store.getters.isAtOptimalDistance

        if (bAtkOD && !bDefOD) {
            // L'attaquant est à distance optimale mais pas le défenseur
            nAtkIni += CONFIG.INITIATIVE_BONUS_REACH_ADVANTAGE
        }

        if (!bAtkOD && bDefOD) {
            // Le défenseur est à distance optimale mais pas l'attaquant'
            nDefIni += CONFIG.INITIATIVE_BONUS_REACH_ADVANTAGE
        }

        if (nAtkIni !== nDefIni) {
            return nAtkIni > nDefIni
        }
        const nAtkInt = oAttacker.store.getAttributeINT
        const nDefInt = oDefender.store.getAttributeINT
        return nAtkInt >= nDefInt
    }

    /**
     * Calcule la défense d'une creature
     * @param oDefender
     * @param oAttacker
     * @returns {number}
     */
    computeDefense (oDefender, oAttacker) {
        let nDef = oDefender.store.getters.getDefense
        // Bonus de situation lorsque les deux combattants n'ont pas la même portée d'arme
        const nReachAtk = oAttacker.store.getter.getEquippedWeaponReach
        const nReachDef = oDefender.store.getter.getEquippedWeaponReach
        if (nReachDef > nReachAtk) {
            // L'arme du défenseur est plus longue que l'arme de l'attaquant
            nDef += CONFIG.DEFENSE_BONUS_REACH_ADVANTAGE
        }
        return nDef
    }



    /**
     * Détermine le jet d'attaque d'une creature
     */
    computeAttack (oAttacker, oDefender) {
        // Déterminer l'arme utilisée pour l'attaque
        const oWeapon = oAttacker.store.getters.getEquippedWeapon
        // Déterminer la catégory de l'arme
        const sCategory = oWeapon.blueprint.weapon.category

    }
}

module.exports = Rules
