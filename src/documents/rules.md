# RULES

## Derivated attributes
Formulas for derivated attributes are stored in file __./creature-state-definition.js__.

## Using weapon with insufficient strength
1) For every point below the STR minimum, the character suffers a -1
INI and -1 to all skill rolls involving that weapon. 
2) In the case of __melee weapons and bows__, the character also does 1d6 less than
the listed damage for the weapon.
3) These penalties are in addition to any initiative (Init) and accuracy (Acc) modifiers listed for the weapon. 
4) If damage for a melee weapon is reduced to “0d6” due to insufficient STR,
then the character cannot wield the weapon well enough to inflict damage
with it in a fight.

