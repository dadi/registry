'use strict'

const archiver = require('archiver')
const fs = require('fs-extra')
const path = require('path')
const walk = require('walk')

const outputDir = path.join(__dirname, 'output')
const walker = walk.walk('.', {
  filters: ['.git', 'node_modules'],
  followLinks: false
})

let asyncQueue = []
let boilerplateVersions = {}
let walkerCache = {}

function createZipFromDirectory(directory, destination, name) {
  const output = fs.createWriteStream(destination)
  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  })

  return new Promise((resolve, reject) => {
    archive
      .on('close', resolve)
      .on('error', reject)
      .pipe(output)
      
    archive.directory(directory, name)
    archive.finalize()
  })
}

walker.on('directory', (root, stats, next) => {
  if (walkerCache[root]) {
    return next()
  }

  walkerCache[root] = true

  const parts = root.split('/')

  // Looking for boilerplate directories
  if (parts.length === 4 && parts[2] === 'boilerplate') {
    const product = parts[1]

    // Adding version to versions endpoint.
    boilerplateVersions[product] = boilerplateVersions[product] || []
    boilerplateVersions[product].push(parts[3])

    // Creating ZIP file.
    const destinationDirectory = path.join(
      outputDir,
      root.split('/').slice(0, -1).join('/')
    )

    asyncQueue.push(
      fs.ensureDir(destinationDirectory).then(() => {
        return createZipFromDirectory(
          root,
          path.join(destinationDirectory, `${parts[3]}.zip`),
          parts[3]
        )
      })
    )
  }

  next()
})

walker.on('end', () => {
  // Write versions endpoint.
  fs.writeFileSync(
    path.join(outputDir, 'versions.json'),
    JSON.stringify(boilerplateVersions)
  )

  return Promise.all(asyncQueue)
})
