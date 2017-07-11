# Oembed Cache hook

This hook queries embed providers and caches the HTML content of the objects within a document. It should run as a `afterCreate` or `afterUpdate` hook.

## Format

Embeds should be objects containing:

- `provider`: Name of the embed provider (e.g. `twitter`)
- `url`: URL of the object (e.g. `https://twitter.com/Linus__Torvalds/status/636194310552064000`)

*Example:*

```json
{
	"provider": "twitter",
	"url": "https://twitter.com/Linus__Torvalds/status/636194310552064000"
}
```

## How to use

Add the hook to the collection schema. The `options` object contains two properties:

- `source`: The name of the field containing the embeds
- `target`: The name of the property within `source` in which the cached content should be injected

*Example:*

```json
"hooks": {
  "afterCreate": [
    {
      "hook": "oembed-cache",
      "options": {
        "source": "embeds",
        "target": "content"
      }   
    }
  ]
}
```

The example above would look for a field named `embeds` and inject the cached HTML content in `embeds.content`.
