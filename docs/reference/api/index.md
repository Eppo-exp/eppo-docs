# REST API

Eppo has an HTTP REST API which allows you to read and write data related to experiments, metrics, definitions, and more. To use the API, you first need to authenticate with an API Key that has the appropriate permissions.

Admins can create and manage REST API Keys by visiting Admin > API Keys

#### Make a request to the Eppo API
```
curl --header 'X-Eppo-Token: <api key>' https://eppo.cloud/api/v1/experiments
```

#### Explore the API Swagger documentation
https://eppo.cloud/api/docs

:::note
API keys are distinct from SDK keys that are used to connect SDK with our Feature flag and assignment configuration tool.
:::
