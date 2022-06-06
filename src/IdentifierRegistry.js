let LAST_ID = 0

function getNextId () {
    return ++LAST_ID
}

module.exports = {
    getNextId
}
