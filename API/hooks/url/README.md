# URL hook

This hook will facilitates the creation of a multi-component url. 

## Definition

The hook comprises of the following options:

- *parts*
-  `value` must be a String
-  `field` must be a field in the existing document
- *to* is the field to write the results to
- *leadingSlash* decides whether to force a leading slash on the result
- *trailingSlash* decides whether to force a trailing slash on the result

## Dependencies

- [underscore](https://www.npmjs.com/package/underscore)

## Attaching the hook

The URL hook needs to be attached to the `beforeCreate` or `beforeUpdate` hook list.

```json
"hooks": {
  "beforeCreate": [{
    "hook": "url",
    "options": {
      "parts": [{
        "value": "tags"
      }, {
        "field": "furl"
      }],
      "to": "url",
      "leadingSlash": true,
      "trailingSlash": true
    }
  }]
}
```

## Example

#### Execution

```json
"hooks": {
  "beforeCreate": [{
    "hook": "url",
    "options": {
      "parts": [{
        "value": "foo"
      }, {
        "field": "furl"
      }, {
        "value": "bar"
      }],
      "to": "url",
      "leadingSlash": true,
      "trailingSlash": true
    }
  }]
}
```

#### Result

`/foo/my-tag/bar/`