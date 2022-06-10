const Rules = require('../src/Rules')
const CONSTS = require('../src/consts')

describe('Rules basic', function () {
    it('is instanciable', function () {
        expect(() => {
            const r = new Rules()
        }).not.toThrow()
    })
})

describe('Rules item creation', function () {
    it('creates an item', function () {
        const r = new Rules()
        const oItem = r.createItem('itm1', 'wpn-blunt-club')
        expect(oItem.id).toBe('itm1')
        expect(oItem.resref).toBe('wpn-blunt-club')
    })
})