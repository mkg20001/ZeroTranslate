const fs = require("fs")
const path = require("path")

module.exports = function treeLoad(dir) {
  const res = {}
  res.array = fs.readdirSync(dir).map(file => {
    var r
    try {
      r = require(path.join(dir, file))
      res[file] = r
      return {
        file,
        r
      }
    } catch (e) {
      console.error("Failed to load %s: %s", path.join(dir, file), e)
      res[file] = e
      return {
        file,
        e
      }
    }
  })
  return res
}
