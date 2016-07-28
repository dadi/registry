// Hook: Creates a URL-friendly version (slug) of a field
var slugify = require("underscore.string/slugify")
var _ = require('underscore')

var getFieldValue = function(fieldName, object) {
  if (!fieldName) return
    fieldName = fieldName.split('.')
  _.each(fieldName, (child) => {
    if (!_.isUndefined(object[child])) {
      object = object[child]
    } else {
      return
    }
  })
  return Boolean(object.length) ? object : false
}

module.exports = function (obj, type, data) {
  var object = _.clone(obj)
  var field = getFieldValue(data.options.override, object) || getFieldValue(data.options.from, object)
  if (field) {
    obj[data.options.to] = slugify(field)
  }
  return obj
}
