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

  if ((fs.existsSync(path.join(cwd, "languages")) || fs.existsSync(path.join(cwd, "content.json"))) && !cwd.endsWith("languages"))
    return path.join(cwd, "languages")
  else
    return path.join(cwd)
}
