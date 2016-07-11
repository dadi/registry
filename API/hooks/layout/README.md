# Layout hook

This hook allows API to deliver an aggregator of multiple instances of any field in the collection, whilst still storing data in each respective field (and therefore retaining per-field validation logic and the ability to query fields individually).

## Definition

The layout is stored in a field of type `Object` and defined by a layout schema, represented in a `schema` property in the field definition.

A layout can contain **fixed** fields, with a pre-defined position in the document, as well as multiple **free** sections, which define a combination of any type of field in the schema, with the option to impose constraints.

*Example:*

```json
"_layout": {
  "type": "Object",
  "schema": [
    {
      "source": "title"
    },
    {
      "source": "subtitle"
    },
    {
      "free": true,
      "name": "body",
      "displayName": "Article Body",
      "fields": [
          {
            "source": "paragraph",
            "min": 1
          },
          {
            "source": "image",
            "max": 5
          },
          {
            "source": "pullquote"
          }
      ]
    },
    {
      "source": "author"
    }
  ]
}
```

This defines a document layout with:

- A title
- A subtitle
- Any combination of paragraphs, images and pull quotes where:
  - A minimum of 1 paragraph is required
  - A maximum of 5 images is accepted
- An author

## Attaching the hook

The layout hook needs to be attached to the `afterGet` event for the layout to be resolved, and to `beforeCreate` and `beforeUpdate` for validation.

The name of the field (`_layout` in the example above) can be customised and passed to the hook in its `options` block.

```json
"hooks": {
  "afterGet": [
    {
      "hook": "layout",
      "options": {
        "layoutField": "myCustomField"
      }   
    }
  ],
  "beforeCreate": "...",
  "beforeUpdate": "..."
}
```

## Storing

Fields to be used in **free** sections must be stored as arrays (a field of type `String` will accept an array of strings). Internally, layout just stores references to positions in these arrays and is then resolved just before output.

```json
{
  "title": "My article",
  "subtitle": "A prologue",
  "author": "John Doe",
  "paragraph": ["A first paragraph", "Another paragraph"],
  "image": ["img1.jpg", "img2.jpg"],
  "pullquote": ["Some quote"],
  "_layout": {
    "body": [
      {
        "source": "paragraph",
        "index": 0
      },
      {
        "source": "image",
        "index": 0
      },
      {
        "source": "pullquote",
        "index": 0
      },
      {
        "source": "image",
        "index": 1
      },
      {
        "source": "paragraph",
        "index": 1
      }
    ]
  }
}
```

Is resolved to:

```json
{
  "title": "My article",
  "subtitle": "A prologue",
  "author": "John Doe",
  "paragraph": ["A first paragraph", "Another paragraph"],
  "image": ["img1.jpg", "img2.jpg"],
  "pullquote": ["Some quote"],
  "_layout": [
    {
      "type": "title",
      "content": "My article"
    },
    {
      "type": "subtitle",
      "content": "A prologue"
    },
    {
      "type": "paragraph",
      "content": "A first paragraph",
      "free": true,
      "name": "body",
      "displayName": "Article Body"
    },
    {
      "type": "image",
      "content": "img1.jpg",
      "free": true,
      "name": "body",
      "displayName": "Article Body"      
    },
    {
      "type": "pullquote",
      "content": "Some quote",
      "free": true,
      "name": "body",
      "displayName": "Article Body"
    },
    {
      "type": "image",
      "content": "img2.jpg",
      "free": true,
      "name": "body",
      "displayName": "Article Body"      
    },
    {
      "type": "paragraph",
      "content": "Another paragraph",
      "free": true,
      "name": "body",
      "displayName": "Article Body"
    },
    {
      "type": "author",
      "content": "John Doe"
    }
  ]
}
```
