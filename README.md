# DADI Registry

DADI registry is the data store behind [DADI CL](https://github.com/dadi/cli). It contains boilerplate applications to be used with the various DADI products, amongst various other utilities.

## Scripts

### Boilerplate generator

*Usage:*

```
node scripts/generate-boilerplates.js
```

*Description:*

Generates a ZIP archive for each boilerplate application and places it in the `output` directory. For example, it takes `api/boilerplate/3.x` and creates `output/boilerplates/api/3.x.zip`.

An endpoint listing the various boilerplate versions is created at `output/v1/boilerplates.json`.

### CLI generatior

*Usage:*

```
node scripts/generate-cli.js
```

Clones the DADI CLI repository, installs its dependencies and generates a binary for each platform supported.

An endpoint listing the binary and wrapper versions is created at `output/v1/cli.json`.

## Development

There is no production web server bundled with this repository, so you can use something like Apache or nginx to serve the static files.

For development purposes, there is a convenience NPM script to launch a Python web server if you're using Mac OS. To use it, run:

```
npm run dev
```

This will start a server on http://localhost:7100.