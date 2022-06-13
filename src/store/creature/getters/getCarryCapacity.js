/**
 * Renvoie la capacité maximal de portage
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const nSTR = this.getAttributeSTR
    switch (nSTR) {
        case 0: {
            return 0
        }

        case 1: {
            return 2.5
        }

        case 2: {
            return 12.5
        }

        default: {
            return (nSTR - 2) * 50
        }
    }
}