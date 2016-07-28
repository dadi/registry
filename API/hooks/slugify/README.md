# Slugify hook

This hook will slugify a fields value and insert the output into another field.

## Definition

The hook will handle dot notated `foo.bar` lookups, as long as the field is not a reference field.

## Dependencies

- [underscore](https://www.npmjs.com/package/underscore)
- [underscore.string](https://www.npmjs.com/package/underscore.string)

## Attaching the hook

The layout hook needs to be attached to the `beforeCreate` or `beforeUpdate` hook list.

```json
"hooks": {
  "beforeCreate": [{
    "hook": "slugify",
    "options": {
      "from": "title",
      "to": "furl"
    }
  }]
}
```