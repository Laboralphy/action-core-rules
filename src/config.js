module.exports = {
    ATTRIBUTE_MODIFIER_EFFECT: 'attribute-modifier',

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
