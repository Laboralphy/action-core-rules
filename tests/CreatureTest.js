const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')

describe('instantiation', function () {
    it('should be defined', function () {
        expect(() => {
            return new Creature()
        }).not.toThrow()
    })
})

describe('attributes', function () {
    it('should have 0 str at start', function () {
        const c = new Creature()
        expect(c.getAttribute('str')).toBe(0)
    })

    it('should express attribute mutations', function () {
        const c = new Creature()
        expect(c.getAttribute('str')).toBe(0)
        c.setAttribute('str', 5)
        expect(c.getAttribute('str')).toBe(5)
    })
})

describe('derivated attributes', function () {
    it('check values', function () {
        const c = new Creature()
        c.setAttribute('str', 5)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 3)
        c.setAttribute('pre', 2)
        c.setAttribute('int', 3)
        c.setAttribute('wil', 3)

        expect(c.getAttribute('def')).toBe(14)
        expect(c.getAttribute('ini')).toBe(4)
        expect(c.getAttribute('tgh')).toBe(4)
        expect(c.getAttribute('lif')).toBe(15)
        expect(c.getAttribute('mov')).toBe(8)
    })
    it('check values after mutation', function () {
        const c = new Creature()
        c.setAttribute('str', 10)
        c.setAttribute('ref', 20)
        c.setAttribute('hlt', 30)
        c.setAttribute('pre', 40)
        c.setAttribute('int', 50)
        c.setAttribute('wil', 60)

        expect(c.getAttribute('def')).toBe(30)                       // ref + 10
        expect(c.getAttribute('ini')).toBe(35)                       // (ref + int) / 2
        expect(c.getAttribute('tgh')).toBe((10 + 60) / 2)            // (str + wil) / 2
        expect(c.getAttribute('lif')).toBe(3 * 30 + 2 * 60)          // 3 * hlt + 2 * wil
        expect(c.getAttribute('mov')).toBe(20 + (10 + 30) / 2)       // ref + (str + hlt) / 2

        c.setAttribute('str', 1)
        c.setAttribute('ref', 200) // new init : 200 + 50 / 2 = 125
        // il semble que le getter getAttributeINI ne track plus M-REF.value
        // si un premier getter fait appel à une propriété A
        // si un second getter fait aussi appel à A
        // alors le second getter ne sera plus réactif

        expect(c.getAttribute('def')).toBe(210)
        expect(c.getAttribute('ref')).toBe(200)
        expect(c.getAttribute('ini')).toBe(125)

        c.setAttribute('str', 6)
        c.setAttribute('ref', 250) // new init : 200 + 50 / 2 = 125

        expect(c.getAttribute('def')).toBe(260)
        expect(c.getAttribute('ini')).toBe(150)

    })

    it('check values after mutation', function () {
        const c = new Creature()
        c.setAttribute('str', 5)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 3)
        c.setAttribute('pre', 2)
        c.setAttribute('int', 3)
        c.setAttribute('wil', 3)

        expect(c.getAttribute('def')).toBe(14)    // ref + 10
        expect(c.getAttribute('ini')).toBe(4)     // (ref + int) / 2
        expect(c.getAttribute('tgh')).toBe(4)     // (str + wil) / 2
        expect(c.getAttribute('lif')).toBe(9 + 6) // 3 * hlt + 2 * wil
        expect(c.getAttribute('mov')).toBe(8)     // ref + (str + hlt) / 2

        c.setAttribute('str', 1)
        c.setAttribute('ref', 1) // new init : 200 + 50 / 2 = 125

        expect(c.getAttribute('ini')).toBe(2) // (ref + int) / 2
    })

    it('morphing check ini bug', function () {
        const c = new Creature()

        c.setAttribute('str', 5)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 3)
        c.setAttribute('pre', 2)
        c.setAttribute('int', 3)
        c.setAttribute('wil', 3)
        expect(c.getAttribute('def')).toBe(14)
        expect(c.getAttribute('ini')).toBe(4)

        c.setAttribute('str', 1)
        c.setAttribute('ref', 1)
        expect(c.getAttribute('ini')).toBe(2)
    })

    it('check ini bug', function () {
        const c = new Creature()
        c.setAttribute('ref', 4)
        c.setAttribute('int', 8)
        expect(c.getAttribute('ini')).toBe(6)

        c.setAttribute('ref', 2)
        c.setAttribute('int', 8)
        expect(c.getAttribute('ini')).toBe(5)

        c.setAttribute('ref', 2)
        c.setAttribute('int', 4)
        expect(c.getAttribute('ini')).toBe(3)
    })
})

describe('attribute bonuses', function () {
    it('should have bonus', function () {
        const c = new Creature()
        c.setAttribute('str', 4)

    })
})

describe('creature damage', function () {
    it('should lower hp with damage lethal', function () {
        const c = new Creature()
        c.setAttribute('str', 4)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 4)
        c.setAttribute('pre', 4)
        c.setAttribute('int', 4)
        c.setAttribute('wil', 4)
        expect(c.store.getters.getHP).toBe(20)
        c.store.mutations.applyDamage({ amount: 5, type: CONSTS.DAMAGE_TYPE_LETHAL })
        expect(c.store.getters.getDamages).toBe(5)
        expect(c.store.getters.getHP).toBe(15)
    })
    it('should lower hp with damage stunning', function () {
        const c = new Creature()
        c.setAttribute('str', 4)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 4)
        c.setAttribute('pre', 4)
        c.setAttribute('int', 4)
        c.setAttribute('wil', 4)
        expect(c.store.getters.getHP).toBe(20)
        c.store.mutations.applyDamage({ amount: 6, type: CONSTS.DAMAGE_TYPE_STUNNING })
        expect(c.store.getters.getDamages).toBe(6)
        expect(c.store.getters.getHP).toBe(14)
    })
    it('should lower hp with damage stunning + lethal', function () {
        const c = new Creature()
        c.setAttribute('str', 4)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 4)
        c.setAttribute('pre', 4)
        c.setAttribute('int', 4)
        c.setAttribute('wil', 4)
        c.store.mutations.applyDamage({ amount: 6, type: CONSTS.DAMAGE_TYPE_STUNNING })
        c.store.mutations.applyDamage({ amount: 3, type: CONSTS.DAMAGE_TYPE_STUNNING })
        expect(c.store.getters.getDamages).toBe(9)
        expect(c.store.getters.getHP).toBe(11)
    })
    it('Dead flag should be on when takin 20 lethal damage', function () {
        const c = new Creature()
        c.setAttribute('str', 4)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 4)
        c.setAttribute('pre', 4)
        c.setAttribute('int', 4)
        c.setAttribute('wil', 4)
        expect(c.store.getters.isAlive).toBeTrue()
        expect(c.store.getters.isKO).toBeFalse()
        expect(c.store.getters.isDead).toBeFalse()
        c.store.mutations.applyDamage({ amount: 20, type: CONSTS.DAMAGE_TYPE_LETHAL })
        expect(c.store.getters.isAlive).toBeFalse()
        expect(c.store.getters.isKO).toBeFalse()
        expect(c.store.getters.isDead).toBeTrue()
    })
    it('KO flag should be on when takin 20 stunning damage', function () {
        const c = new Creature()
        c.setAttribute('str', 4)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 4)
        c.setAttribute('pre', 4)
        c.setAttribute('int', 4)
        c.setAttribute('wil', 4)
        c.store.mutations.applyDamage({ amount: 20, type: CONSTS.DAMAGE_TYPE_STUNNING })
        expect(c.store.getters.isAlive).toBeFalse()
        expect(c.store.getters.isKO).toBeTrue()
        expect(c.store.getters.isDead).toBeFalse()
    })
    it('testing flag progress while taking damage', function () {
        const c = new Creature()
        c.setAttribute('str', 4)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 4)
        c.setAttribute('pre', 4)
        c.setAttribute('int', 4)
        c.setAttribute('wil', 4)
        c.store.mutations.applyDamage({ amount: 5, type: CONSTS.DAMAGE_TYPE_STUNNING })
        c.store.mutations.applyDamage({ amount: 5, type: CONSTS.DAMAGE_TYPE_LETHAL })
        expect(c.store.getters.isAlive).toBeTrue()
        expect(c.store.getters.isKO).toBeFalse()
        expect(c.store.getters.isDead).toBeFalse()
        c.store.mutations.applyDamage({ amount: 5, type: CONSTS.DAMAGE_TYPE_STUNNING })
        c.store.mutations.applyDamage({ amount: 5, type: CONSTS.DAMAGE_TYPE_LETHAL })
        expect(c.store.getters.isAlive).toBeFalse()
        expect(c.store.getters.isKO).toBeTrue()
        expect(c.store.getters.isDead).toBeFalse()
        c.store.mutations.applyDamage({ amount: 5, type: CONSTS.DAMAGE_TYPE_LETHAL })
        expect(c.store.getters.isAlive).toBeFalse()
        expect(c.store.getters.isKO).toBeTrue()
        expect(c.store.getters.isDead).toBeFalse()
        c.store.mutations.applyDamage({ amount: 5, type: CONSTS.DAMAGE_TYPE_LETHAL })
        expect(c.store.getters.isAlive).toBeFalse()
        expect(c.store.getters.isKO).toBeFalse()
        expect(c.store.getters.isDead).toBeTrue()
    })

    it('healing removes damages', function () {
        const c = new Creature()
        c.setAttribute('str', 4)
        c.setAttribute('ref', 4)
        c.setAttribute('hlt', 4)
        c.setAttribute('pre', 4)
        c.setAttribute('int', 4)
        c.setAttribute('wil', 4)
        c.store.mutations.applyDamage({ amount: 10, type: CONSTS.DAMAGE_TYPE_LETHAL })
        c.store.mutations.heal({ amount: 2 })
        expect(c.store.getters.getHP).toBe(12)
    })
})
