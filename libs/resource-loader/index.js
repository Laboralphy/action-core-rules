const path = require('path')
const AdmZip = require('adm-zip')
const PromFS = require('../prom-fs')

/**
 * bibliothèque basée sur ARCHIVER
 * Extraction complete d'un ZIP, en mémoire
 * Produit un tableau d'entrées :
 * {
 *   path: string,
 *   content: string
 * }
 * possibilité d'évaluer le contenu des entrée en tant que texte brut, JSON, ou script JS
 */

class ResourceLoader {
  constructor () {
    this._resources = {}
  }

  get resources () {
    return this._resources
  }

  /**
   * supprime la totalité des ressources enregistrées
   */
  clearResources () {
    this._resources = {}
  }

  /**
   * Ajoute une ressource
   * Selon le type de ressource, un traitement supplémentaire est effectué
   * (compilation, parsing etc...)
   * @param sEntryName {string} nom de fichier de la ressource (avec extension)
   * @param data {string}
   */
  addResourceEntry (sEntryName, data) {
    const sExt = path.extname(sEntryName)
    switch (sExt) {
      case '.json': {
        this._resources[sEntryName] = JSON.parse(data)
        break
      }
      case '.js': {
        if (sEntryName.startsWith('events')) {
          if (!(sEntryName in this._resources)) {
            this._resources[sEntryName] = []
          }
          this._resources[sEntryName].push(data)
        } else {
          this._resources[sEntryName] = data
        }
        break
      }
      default: {
        this._resources[sEntryName] = data
        break
      }
    }
  }

  /**
   * Chargement de l'intégralité du fichier ZIP en mémoire
   * @param sFile {string} nom du fichier ZIP
   */
  loadFromArchive (sFile) {
    const zip = new AdmZip(sFile, {})
    for (const oZipEntry of zip.getEntries()) {
      if (!oZipEntry.isDirectory) {
        this.addResourceEntry(
          oZipEntry.entryName,
          oZipEntry.getData().toString()
        )
      }
    }
  }

  /**
   * Charge les ressources à partir d'un dossier
   * @param sPath {string}
   * @returns {Promise<void>}
   */
  async loadFromFolder (sPath) {
    const aTree = await PromFS.tree(sPath)
    for (const sFile of aTree) {
      const sFullName = path.resolve(sPath, sFile)
      const data = await PromFS.read(sFullName)
      this.addResourceEntry(sFile, data)
    }
  }

  /**
   * Chargement des ressources contenues dans un zip ou dans un dossier
   * @param sLocation
   * @returns {Promise<object>}
   */
  async load (sLocation) {
    const oStat = await PromFS.stat(sLocation)
    if (!oStat) {
      throw new Error('ERR_MODULE_NOT_FOUND')
    }
    if (oStat.dir) {
      await this.loadFromFolder(sLocation)
    } else {
      this.loadFromArchive(sLocation)
    }
    return Promise.resolve(this._resources)
  }
}

module.exports = ResourceLoader
