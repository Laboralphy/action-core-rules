const ResourceLoader = require('../libs/resource-loader')
const path = require('path')

let oResourceLoader

async function getResourceLoader () {
    if (!oResourceLoader) {
        oResourceLoader = new ResourceLoader()
        await oResourceLoader.loadFromFolder(path.resolve(__dirname, './data'))
    }
    return oResourceLoader
}

module.exports = {
    getResourceLoader
}
