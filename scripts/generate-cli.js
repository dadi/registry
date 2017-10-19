'use strict'

const fs = require('fs-extra')
const path = require('path')

const cliPath = path.resolve(
  process.cwd(),
  process.argv[2]
)
const outputDir = path.join(
  __dirname,
  '..',
  'output'
)

try {
  const corePkgJson = require(
    path.join(cliPath, 'core', 'package.json')
  )
  const wrapperPkgJson = require(
    path.join(cliPath, 'wrapper', 'package.json')
  )
  const payload = {
    generated: Date.now(),
    versionCore: corePkgJson.version,
    versionWrapper: wrapperPkgJson.version
  }

  fs.ensureDir(
    path.join(outputDir, 'v1')
  ).then(() => {
    const endpointPath = path.join(
      outputDir,
      'v1',
      'cli.json'
    )

    return fs.writeJson(endpointPath, payload)
  })
} catch (err) {
  console.log('Could not load CLI package.json')
}
