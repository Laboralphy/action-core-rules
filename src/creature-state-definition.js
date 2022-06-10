const CONSTS = require('./consts')

function buildInitialState () {
    return {
        attributes: {
            groups: ['body', 'mind'],
            main: {
                str: { group: 'body', type: 'pow', value: 0, DEBUG: 'STR' },
                ref: { group: 'body', type: 'apt', value: 0, DEBUG: 'REF' },
                hlt: { group: 'body', type: 'res', value: 0, DEBUG: 'HLT' },
                pre: { group: 'mind', type: 'pow', value: 0, DEBUG: 'PRE' },
                int: { group: 'mind', type: 'apt', value: 0, DEBUG: 'INT' },
                wil: { group: 'mind', type: 'res', value: 0, DEBUG: 'WIL' },
            },
            derivated: {
                def: { weights: { ref: 1.0 }, add: 10 },
                ini: { weights: { ref: 0.5, int: 0.5 } },
                tgh: { weights: { str: 0.5, wil: 0.5 } },
                lif: { weights: { hlt: 3.0, wil: 2.0 } },
                mov: { weights: { ref: 1.0, str: 0.5, hlt: 0.5 } }
            },
        },
        gauges: {
            damages: {
                lethal: 0,
                stunning: 0,
            }
        },
        skills: [],
        effects: [],
        equipment: {
            [CONSTS.EQUIPMENT_SLOT_HEAD]: null,
            [CONSTS.EQUIPMENT_SLOT_NECK]: null,
            [CONSTS.EQUIPMENT_SLOT_CHEST]: null,
            [CONSTS.EQUIPMENT_SLOT_BACK]: null,
            [CONSTS.EQUIPMENT_SLOT_ARMS]: null,
            [CONSTS.EQUIPMENT_SLOT_WAIST]: null,
            [CONSTS.EQUIPMENT_SLOT_FEET]: null,
            [CONSTS.EQUIPMENT_SLOT_LEFTFINGER]: null,
            [CONSTS.EQUIPMENT_SLOT_RIGHTFINGER]: null,
            [CONSTS.EQUIPMENT_SLOT_MELEEWEAPON]: null,
            [CONSTS.EQUIPMENT_SLOT_RANGEDWEAPON]: null,
            [CONSTS.EQUIPMENT_SLOT_AMMO]: null
        }
    }
}

module.exports = {
    buildInitialState
}
