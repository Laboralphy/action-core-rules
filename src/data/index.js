import path from "path";

/**
 * Charge les ressources à partir d'un dossier
 * @param sPath {string}
 * @returns {Promise<void>}
 */
async function loadFromFolder (sPath) {
    const aTree = await PromFS.tree(sPath)
    for (const sFile of aTree) {
        const sFullName = path.resolve(sPath, sFile)
        const data = await PromFS.read(sFullName)
        this.addResourceEntry(sFile, data)
    }
}


function loadBlueprint (sResRef) {

}