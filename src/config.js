module.exports = {
    ATTRIBUTE_MODIFIER_EFFECT: 'attribute-modifier',

    DEFENSE_BONUS_USING_SHIELD: 2,
    DEFENSE_BONUS_PARTIALLY_ENCUMBERED: -1,
    DEFENSE_BONUS_GREATLY_ENCUMBERED: -1,
    DEFENSE_BONUS_REACH_ADVANTAGE: 3,

    INITIATIVE_BONUS_REACH_ADVANTAGE: 3,

    WEAPON_REACH_UNARMED: 1,
    WEAPON_REACH_RANGED: 4,

    CHARACTER_EVOLUTION: {
        initialAttributePoints: 25,
        initialAttributeMaxValue: 5,
        characterPointChange: 10, // Permet de recycler des attribute points inutilisé en character points
        derivatedAttributeSpecializationCost: { // Nombre de point de caractère qu'on peut dépenser dans la spécialisation d'un attribut dérivé
            def: 5,
            ini: 3,
            tgh: 5,
            lif: 2,
            mov: 5,
        },
        attributeUpgradeCost: 5, // a multiplier par la nouvelle valeur de l'attribut pour savoir combien ca coute en caracter points
    }
}
