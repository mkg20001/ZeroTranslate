const fs = require("fs")
const path = require("path")

console.log("")

const r = process.argv[2] || process.cwd()

function mod(m) {
  return require(__dirname + "/lib/" + m)
}

if (!fs.existsSync(r)) {
  throw new Error("ENOTFOUND " + r)
}

const getRoot = mod("getRoot")
const treeLoad = mod("treeLoad")
const jsonfile = require("jsonfile")
const Lang = mod("lang")
const Index = mod("_index")

const root = getRoot(r)

function readJson(file) {
  return jsonfile.readFileSync(path.join(root, file))
}


if (!fs.existsSync(root)) {
  throw new Error("ENOTFOUND " + root)
}

function log() {
  const a = [].slice.call(arguments, 0)
  if (typeof a[0] == "string")
    a[0] = " => " + a[0]
  else
    a.unshift(" =>")
  console.log.apply(console, a)
}
log("Loading from %s...", root)

let index
let langs = {
  0: [],
  1: []
}

var imod
if (!fs.existsSync(path.join(root, "_.json"))) {
  log("No index found, creating...")
  index = new Index([], path.join(root, "_.json"))
  imod = true
} else {
  log("Read index...")
  index = new Index(readJson("_.json"), path.join(root, "_.json"))
}
treeLoad(root).array.forEach(lang => {
  if (lang.file.startsWith("_")) return
  var l = new Lang(path.basename(lang.file, ".json"), lang.r, path.join(root, lang.file))
  langs[0].push(l)
  langs[1].push(path.basename(lang.file, ".json"))
  langs[path.basename(lang.file, ".json")] = l
  Object.keys(lang.r).forEach(key => {
    if (index.indexOf(key) == -1) imod = true
    if (index.indexOf(key) == -1) log("Adding string to index: " + JSON.stringify(key))
    if (index.indexOf(key) == -1) index.i.push(key)
  })
})
if (imod) index.save()

log("Index has %s word(s)", index.i.length)
log("Languages: %s", langs[1].join(", "))
log("Total of %s language(s)", langs[0].length)

console.log("")

require("colors")
require("console.table")

const readline = require("readline")

const rl = readline.createInterface(process.stdin, process.stdout)
const p = root.split("/")
rl.setPrompt(("translate:" + p[p.indexOf("languages") - 1] + "> ").bold.white)

/*function sortstring(a, b)    {
    a = a.toLowerCase()
    b = b.toLowerCase()
    if (a < b) return -1
    if (a > b) return 1
    return 0
}*/

var hi = [0, 0, 0]
const help = [
  ["sync", "[<lang>]", "Add missing strings (call before translating). Accepts *"],
  ["unsync", "[<lang>]", "Remove empty strings (call after translating). Accepts *"],
  ["add", "[<string>]", "Add new string to index (does not sync)"],
  ["rm", "[<string>]", "Remove string from index (does sync)"],
  ["use", "[<lang>]", "Use language"],
  ["langs", "", "List all languages"],
  ["langadd", "<lang>", "Add new language"],
  ["help", "", "Show this help"],
  ["index", "", "List all words in the index"],
  ["untranslated", "[<lang>]", "List all untranslated strings. Accepts *"],
  ["exit", "", "Close the app"]
] //.sort((a,b) => sortstring(a[0],b[0]))
const help_text = help.map(h => {
  Object.keys(h).map(i => {
    if (h[i].length > hi[i]) hi[i] = h[i].length
  })
  return h
}).map(h => {
  var f = true
  return Object.keys(h).map(i => {
    while (h[i].length < hi[i]) h[i] += " "
    if (f) {
      f = !f;
      return h[i].bold
    } else return h[i]
  }).join(" ")
}).join("\n")

let cLang

function toObject(arr) {
  var rv = {}
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i]
  return rv
}

function getLang(arg) {
  return langs[0].filter(l => l.code == arg)[0]
}

rl.on("line", line => {
  let s = line.trim().split(" ").map(l => l.trim()).filter(l => !!l)
  const cmd = s.shift()
  const args = line.replace(cmd + " ", "")
  const arg = s.shift()
  switch (cmd) {
  case "sync": //sync the file (add missing strings)
    if (!getLang(arg) && !cLang) console.log("No language selected and no or invalid language given");
    else {
      const l = getLang(arg) || cLang
      index.i.map(str => {
        if (typeof l.content[str] == "undefined") {
          log("Adding %s to %s...", JSON.stringify(str), l.code)
          l.content[str] = ""
        }
      })
      l.save()
    }
    break;
  case "unsync": //unsync the file (remove empty strings)
    if (!getLang(arg) && !cLang) console.log("No language selected and no or invalid language given");
    else {
      const l = getLang(arg) || cLang
      index.i.map(str => {
        if (typeof l.content[str] != "undefined" && !l.content[str]) {
          log("Removing %s from %s...", JSON.stringify(str), l.code)
          delete l.content[str]
        }
      })
      l.save()
    }
    break;
  case "add": //add new string to index
    if (args) {
      index.i.push(args)
      index.save()
    } else {
      console.log("Usage: add [<str>]")
    }
    break;
  case "rm": //remove string from index
    if (args) {
      langs[0].map(lang => {
        delete lang.content[args]
        lang.save()
      })
      index.i = index.i.filter(c => c != args)
      index.save()
    } else {
      console.log("Usage: rm [<str>]")
    }
    break;
  case "use": //use lang
    if (arg) {
      cLang = getLang(arg)
      if (!cLang) console.log("Language not found")
      if (!cLang) console.log("Did you want to 'langadd %s'?", arg)
    } else {
      console.log("Current Language: ".bold + (cLang ? cLang.code : "(none)"))
    }
    break;
  case "langdel":
    if (!getLang(arg)) {
      console.log("Lang does not exist")
    } else {
      langs[1] = langs[1].filter(c => c != arg)
      langs[0] = langs[0].filter(c => c.code != arg)
      fs.unlinkSync(langs[arg].file)
      delete langs[arg]
      if (cLang.code == arg) cLang = null
    }
    break;
  case "langadd":
    if (getLang(arg)) {
      console.log("Lang already exists")
    } else {
      langs[1].push(arg)
      const l = new Lang(arg, {}, path.join(root, arg + ".json"))
      langs[0].push(l)
      langs[arg] = l
      l.save()
      console.log("Run 'sync %s' to sync the language", arg)
    }
    break;
  case "untranslated":
    const l = lang => Object.keys(lang.content).filter(key => !lang.content[key])
    if (arg == "*") {
      let r = []
      langs[0].map(lang => {
        l(lang).map(s => r.push({
          lang: lang.code,
          string: s
        }))
      })
      console.table("Untranslated strings in all languages", r)
    } else {
      if (!getLang(arg) && !cLang) console.log("No language selected and no or invalid language given");
      else {
        const la = getLang(arg) || cLang
        console.table("Unstranslated strings in " + la.code, l(la).map(c => {
          return {
            lang: la.code,
            string: c
          }
        }))
      }
    }
    break;
  case "langs": //list em all
    console.log("Languages: ".bold + langs[1].join(", "))
    console.log("Current Language: ".bold + (cLang ? cLang.code : "(none)"))
    break;
  case "help": //show help
    console.log(help_text)
    break;
  case "index":
    console.table("Index", toObject(index.i.map(JSON.stringify)))
    break;
  case undefined:
  case "":
    break;
  case "exit":
  case "quit":
    process.exit(0)
    break;
  default:
    console.log("Unknown command%s. Type 'help' for help", cmd ? " " + cmd : "")
  }
  if (cmd) console.log("")
  rl.prompt()
})
rl.prompt()
