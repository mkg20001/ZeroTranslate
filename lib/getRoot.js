const fs = require("fs")
const path = require("path")

module.exports = function getRoot(cwd) {
  if (fs.existsSync(path.join(cwd, "languages")) || fs.existsSync(path.join(cwd, "content.json")))
    return path.join(cwd, "languages")
  else
    return path.join(cwd, "languages")
}
