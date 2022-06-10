const PromFS = require('../prom-fs')
const path = require('path')

const JAVASCRIPT_EXTENSION = '.js'
const JSON_EXTENSION = '.json'

async function main (sBasePath) {
  if (Array.isArray(sBasePath)) {
    return Promise
      .all(sBasePath.map(s => main(s)))
      .then(aAll => aAll.flat())
  }
  const t1 = await PromFS.tree(sBasePath)
  const t2 = t1.filter(x => x.endsWith(JAVASCRIPT_EXTENSION)).map(x => {
    const filename = x
    const dir = path.dirname(x)
    const oModule = require(path.resolve(sBasePath, filename))
    const name = x.endsWith(JAVASCRIPT_EXTENSION)
      ? path.basename(filename, JAVASCRIPT_EXTENSION)
      : path.basename(filename, JSON_EXTENSION)
    const id = path.posix.join(dir, name)
    return {
      id,
      module: oModule
    }
  })
  const t3 = {}
  t2.forEach(({ id, route, module: m }) => {
    t3[id] = m
  })
  return t3
}

module.exports = main
