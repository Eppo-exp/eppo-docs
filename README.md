# Website

This website is built using [Docusaurus 2](https://docusaurus.io/). 

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

We're using [Netlify](https://app.netlify.com/sites/adoring-yonath-6ecb9d/overview) to deploy the docs site. Any pull requests to this repo will trigger a new build, which you can preview in the UI. The main site is built off the `main` branch, which re-deploys automatically on any new changes merged in.

Note that any broken links will break the entire build (thanks, Docusaurus).
