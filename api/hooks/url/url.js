// Hook: Creates a URL-friendly version (slug) of a field
var _ = require("underscore")

module.exports = function (obj, type, data) {
    var url = data.options.leadingSlash ? '/' : ''
    var missingParameter
    _.each(data.options.parts, function(part, index) {
      if (part.value) url += part.value
      else if (part.field) {
        var children = part.field.split(".")
        var object = _.clone(obj)
        _.each(children, (child) => {
          if (!_.isUndefined(object[child])) {
            object = object[child]
          } else {
            missingParameter = true
          }
        })
        if (!missingParameter) {
          url += object
        }
      }

      if (!missingParameter && (index < data.options.parts.length || data.options.trailingSlash)) url += '/'
    }.bind(this))
    if (!missingParameter) {
      obj[data.options.to] = url
    }
    return obj
}
