# Frequently asked questions

Integrating with Eppo involves assessing risk, and we take reliability seriously. Here are a few commonly asked questions we get from decision makers around reliability, and our responses. If you have a question not listed here please reach out to us on Slack.

## How does Eppo ensure it is available?

- As part of both quarterly and weekly planning we track and improve reliability SLOs measures to make sure our service exceeds contractual commitments.
- Here are some examples of measures that we take to ensure our service reliability:
  - We handle traffic bursts gracefully via autoscalers and over-provisioned resources.
  - We have automated mechanisms to reduce unintended/malicious spikes and prevent DDoS attack.
  - Our services is available across regions. In case of a region goes down, traffic will be routed to other healthy regions.
  - We embrace infrastructure-as-code approach (e.g. code review, validation, CI/CD, vendor settings, etc.) to prevent human error.
  - We have a 24/7 engineer on-call rotation to solve customer-facing alerts and issues.

## Does Eppo use any caching to help with latency?

- All Eppo SDKs cache configurations locally (implementation dependent on SDKs) so that assignments can be near instant.
- We use a highly available, globally distributed CDN to deliver our flag configurations. In most cases update propagation times are less than 10 seconds.

## What else does Eppo do to make sure the service is resilient?

- All our SDKs are designed to be resilient in case there is an issue in the API
  requests, to make sure a seamless experience on your side.
- Client SDKs:
  - These SDKs use the freshest values if it’s able to reach our CDN.
  - If not, then they use cached value from a previous fetch, if available.
  - If not, then they will return the value `null`, which we recommend handling explicitly by delivering your default experience. This means the worst case scenario your users will see your default experiences.
- Server SDKs:
  - These SDKs use the freshest values on initialization and cache those values in memory.
  - If not, then they will return the value `null`, which we recommend handling explicitly by delivering your default experience. This means the worst case scenario your users will see your default experiences.

## What kind of automated testing does Eppo do?

- Unit and integration tests (CI/CD) run on every pull request and deploy.
- Periodic loading testing to detect any performance issues.
- Centralized SDK tests to ensure they all act the same.

## What does Eppo do to protect runtime code?

We use Github and AWS for code and asset storage. We keep track of
the entire CI/CD process from source code to production deployment with
traceable versioning and binary verification.
