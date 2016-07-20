var Model = require('@dadi/api').Model
var request = require('request-promise')
var _ = require('underscore')

var Providers = {
  twitter: {
    path: 'html',
    getUrl: function (url) {
      return 'https://publish.twitter.com/oembed?url=' + encodeURIComponent(url)
    }
  }
}

module.exports = function (obj, type, data) {
  // Ensure `obj` is an array
  obj = (obj instanceof Array) ? obj : [obj]

  obj.forEach((doc) => {
    var source = data.options && data.options.source && data.options.target && doc[data.options.source]

    if (!source || !doc._id) return

    // Ensure `source` is an array
    if (!(source instanceof Array)) {
      source = [source]
    }

    var queue = []
    var result = []

    source.forEach((oembed, index) => {
      var provider = oembed && oembed.provider && Providers[oembed.provider]

      if (!provider) return
      queue.push(request({
        json: true,
        uri: provider.getUrl(oembed.url)
      }).then((response) => {
        var value = getPath(response, provider.path)
        var targetPath = buildObjectFromPath(data.options.target, value)

        oembed = _.extend(oembed, targetPath)
      }).catch((err) => {
        return Promise.resolve(true)
      }))
    })

    Promise.all(queue).then(() => {
      var model = Model(data.collection)
      var update = {}

      update[data.options.source] = source

      model.update({_id: doc._id}, update, function (err, res) {
        //console.log('** RESPONSE:', res)
      })
    })
  })

  return obj
}

function buildObjectFromPath(path, value, breadcrumbs) {
  breadcrumbs = breadcrumbs || path.split('.')
  
  var obj = {}
  
  if (breadcrumbs.length === 1) {
    obj[breadcrumbs[0]] = value
    
    return obj
  }
  
  obj[breadcrumbs[0]] = buildObjectFromPath(path, value, breadcrumbs.slice(1))
  
  return obj
}

function getEmbedUrl(provider, url) {
  switch (provider) {
    case 'twitter':
      return 
  }
}

function getPath(object, path, breadcrumbs) {
  breadcrumbs = breadcrumbs || path.split('.')
  
  if (breadcrumbs.length === 1) {
    return object[breadcrumbs[0]]
  }
  
  return getPath(object[breadcrumbs[0]], path, breadcrumbs.slice(1))
}
