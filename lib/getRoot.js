const fs = require("fs")
const path = require("path")

module.exports = function getRoot(cwd_) {
  let cwd

  try {
    cwd = fs.realpathSync(cwd_)
  } catch (e) {
    console.error("ERROR: An error occured while resolving the path to %s", JSON.stringify(cwd_))
    throw e
  }

  if (["content.json", "languages", "package.json"].map(fs.existsSync).filter(e => e)[0])
    return path.join(cwd, "languages")
  else
    return path.join(cwd)
}
