const deepClone = require('../libs/deep-clone')
const Creature = require('./Creature')

/**
 * @typedef ActionBlueprint {object}
 * @property type {string}
 * @property itemType {string}
 * @property stackable {boolean}
 * @property weaponCategory {string}
 * @property weaponType {string}
 * @property ammoType {string} AMMO_TYPE_*
 * @property damage {string}
 * @property damageTypes {string[]}
 * @property reach {string} MELEE WEAPON ONLY
 * @property initiative {number}
 * @property accuracy {number}
 * @property weight {number}
 * @property properties {array}
 * @property rof {number} SMALL ARM ONLY
 * @property clipSize {number} SMALL ARM ONLY
 * @property ammoType {string} SMALL ARM ONLY
 *
 * @typedef ActionItem {object}
 * @property type {string}
 * @property itemType {string}
 * @property stackable {boolean}
 * @property weaponCategory {string}
 * @property weaponType {string}
 * @property ammoType {string} AMMO_TYPE_*
 * @property damage {string}
 * @property damageTypes {string[]}
 * @property reach {string} MELEE WEAPON ONLY
 * @property initiative {number}
 * @property accuracy {number}
 * @property weight {number}
 * @property properties {array}
 * @property rof {number} SMALL ARM ONLY
 * @property clipSize {number} SMALL ARM ONLY
 * @property ammoType {string} SMALL ARM ONLY
 * @property owner {string} item owner id
 * @property stackCount {string} number of items in the stack (if stackable)
 *
 */

class Rules {
    constructor () {
        this._items = {}
        this._creatures = {}
        this._blueprints = {}
    }

    /**
     * Collection of defined blueprints for item creation
     * @returns {Object.<string, ActionBlueprint>}
     */
    get blueprints () {
        return this._blueprints
    }

    /**
     * Creates an item out of a given blueprint
     * @param id {string} new item identifier
     * @param sResRef {string} blueprint identifier
     * @param stackCount {number} number of items in the stack
     * @returns {*|{}|number|string|boolean}
     */
    createItem (id, sResRef, stackCount = 1) {
        const blueprint = this._blueprints[sResRef]
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
     */
    createCreature (id) {
        const oCreature = new Creature()
        oCreature.id = id
        this._creatures[id] = oCreature
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
}
