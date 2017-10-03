'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const EXTENSION = '.tgz'
const OUTPUT_DIR = path.join(__dirname, 'output')

const files = fs.readdirSync(__dirname)

let boilerplateVersions = {}

files.forEach(file => {
  if (file.indexOf('.') === 0) return

  const stats = fs.statSync(path.join(__dirname, file))

  if (stats.isDirectory()) {
    try {
      const versions = fs.readdirSync(
        path.join(__dirname, file, 'boilerplate')
      )

      boilerplateVersions[file] = versions.filter(file => {
        return path.extname(file) === EXTENSION
      }).map(version => {
        return path.basename(version, EXTENSION)
      })
    } catch (e) {}
  }
})

mkdirp.sync(OUTPUT_DIR)
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'versions.json'),
  JSON.stringify(boilerplateVersions)
)
