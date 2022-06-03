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
            damdeadly: 0,
            damstunning: 0
        },
        effects: []
    }
}

module.exports = {
    buildInitialState
}
