const { posix: path } = require('path')
const File = require('vinyl')

module.exports.register = function ({ config }) {

  const pluralize = (count, noun, suffix = 's', plural = '') => {
    if (count !== 1) {
      return plural !== '' ? plural : `${noun}${suffix}`
    }
    return noun
  }

  const logger = this.getLogger('pageList')
  
  this
  .on('documentsConverted', ({ config }) => {

    const { contentCatalog, siteCatalog } = this.getVariables()

    let pageList = {}

    const myFiles = contentCatalog.getFiles()
    myFiles.forEach( (file) => {
      if (!file.out || !file.asciidoc) return
      pageList[file.src.path] = {
        title: file.asciidoc.doctitle,
        url: file.out.path,
      }
    })
    const pageListFile = generateChangelogFile(pageList)

    siteCatalog.addFile(pageListFile)
  })
}

function generateChangelogFile (pageList) {
    return new File({ contents: Buffer.from(JSON.stringify(pageList)), out: { path: './.meta/pageList' } })
}
