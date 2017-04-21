const jsonfile = require("jsonfile")

module.exports = function Lang(content, file) {
  function save() {
    console.log(" => Save Index...")
    jsonfile.writeFileSync(file, this.i, {
      spaces: 2
    })
  }
  this.i = content
  this.indexOf = a => this.i.indexOf(a)
  this.push = a => this.i.push(a)
  this.save = save
}
