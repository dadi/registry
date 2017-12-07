const fs = require('fs')
const path = require('path')

const DATABASE_BLOCK_PROPERTIES = [
  'hosts',
  'username',
  'password',
  'database',
  'ssl',
  'replicaSet',
  'readPreference',
  'enableCollectionDatabases'
]

const findEnvironments = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(
      path.join(process.cwd(), 'config'),
      'utf8',
      (err, files) => {
        if (err) return reject(err)

        const environments = files.map(file => {
          const match = file.match(/^config\.(.*)\.json$/)

          return match && match[1]
        }).filter(Boolean)

        resolve(environments)
      }
    )
  })
}

const migrateEnvironment = environment => {
  return readJson(`config/config.${environment}.json`).then(result => {
    return writeJson(
      `config/config.${environment}.json.backup-${Date.now()}`,
      result
    )
  }).then(result => {
    let apiConfig = {}
    let mongoDatabases = {}
    let mongoConfig = {}

    Object.keys(result.database).forEach(key => {
      if (DATABASE_BLOCK_PROPERTIES.includes(key)) {
        mongoConfig[key] = result.database[key]
      } else {
        mongoDatabases[key] = result.database[key]
      }
    })

    mongoConfig.databases = mongoDatabases

    if (
      result.auth.database.database &&
      !mongoConfig.databases[result.auth.database.database]
    ) {
      mongoConfig.databases[result.auth.database.database] = result.auth.database
    }

    Object.keys(result).forEach(key => {
      if (key === 'database') {
        apiConfig.database = result.database.database
        apiConfig.datastore = '@dadi/api-mongodb'
      } else if (key === 'auth') {
        apiConfig.auth = Object.assign({}, result.auth, {
          datastore: '@dadi/api-mongodb',
          database: result.auth.database.database
        })
      } else {
        apiConfig[key] = result[key]
      }
    })

    delete mongoConfig.databases[result.auth.database.database].database

    const queue = [
      writeJson(`config/config.${environment}.json`, apiConfig),
      writeJson(`config/mongodb.${environment}.json`, mongoConfig)
    ]

    return Promise.all(queue)
  })
}

const readJson = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(process.cwd(), filePath),
      'utf8',
      (err, data) => {
        if (err) return reject(err)

        try {
          const parsedData = JSON.parse(data)

          resolve(parsedData)
        } catch (err) {
          reject(err)
        }
      }
    )
  })
}

const writeJson = (filePath, contents) => {
  return new Promise((resolve, reject) => {
    let encodedData

    try {
      encodedData = JSON.stringify(contents, null, 2)
    } catch (err) {
      return reject(err)
    }

    fs.writeFile(
      path.join(process.cwd(), filePath),
      encodedData,
      err => {
        if (err) return reject(err)

        resolve(contents)
      }
    )
  })
}

findEnvironments().then(environments => {
  return Promise.all(environments.map(migrateEnvironment))
}).catch(err => {
  console.log('Something went wrong. Are you running this command from a DADI API 2.0 directory?')

  process.exit(1)
})
