# REST API

Eppo has an HTTP REST API which allows you to read and write data related to experiments, metrics, definitions, and more. To use the API, you first need to authenticate with an API Key that has the appropriate permissions.

Admins can create and manage REST API Keys by visiting Admin > API Keys

#### Make a request to the Eppo API
```
curl --header 'X-Eppo-Token: <api key>' https://eppo.cloud/api/v1/experiment-analysis
```

#### Explore the API Swagger documentation
https://eppo.cloud/api/docs
