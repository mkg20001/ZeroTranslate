const jsonfile = require("jsonfile")

function log() {
  const a = [].slice.call(arguments, 0)
  if (typeof a[0] == "string")
    a[0] = " => " + a[0]
  else
    a.unshift(" =>")
  console.log.apply(console, a)
}

module.exports = function Lang(code, content, file) {
  function save() {
    log("Save %s...", code)
    jsonfile.writeFileSync(file, this.content, {
      spaces: 2
    })
  }
  this.content = content
  this.save = save
  this.code = code
  this.file = file
}
