const Effects = require('./effects')

/**
 * @class EffectProcessor
 */
class EffectProcessor {
    createEffect (sEffect, ...aArgs) {
        Effects[sEffect].create(...aArgs)
    }

    processEffects (aCreatures) {
        aCreatures.forEach(c => {
            this.processCreatureEffects(c, aCreatures)
        })
    }

    runEffect (oEffect, oCreature, oEntities) {
        const oEffectProg = Effects[oEffect.tag]
        if ('mutate' in oEffectProg) {
            const oSource = oEffect.source
                ? oEntities[oEffect.source]
                : null
            oEffectProg.mutate({
                effect: oEffect,
                source: oSource,
                target: oCreature
            })
        }
    }

    processCreatureEffects (oCreature, oEntities) {
        const aEffects = oCreature.store.state.effects
        aEffects.forEach(eff => {
            this.runEffect(eff, oCreature, oEntities)
            --eff.duration
        })
        // remove dead effects
        for (let i = aEffects.length; i >= 0; --i) {
            if (aEffects.duration <= 0) {
                aEffects.splice(i, 1)
            }
        }
    }
}

module.exports = EffectProcessor
