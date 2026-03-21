---
sidebar_position: 3
---

# Authentication

![Logging in with Okta](/img/reference/okta.png)

Eppo supports the following enterprise authentication options:

- [Okta](/administration/okta)
- Google Workspace
- Microsoft Azure AD
- ADFS
- LDAP
- Ping Federate
- SAML
- OpenID Connect  

Follow the guides linked above or reach out to your Eppo team if you would like one of these options configured for your users.

:::info SSO login flow
Eppo supports **SP-initiated** (Service Provider-initiated) SSO login only. Users must start the login flow from the Eppo login page (`eppo.cloud`), not from the identity provider's app dashboard. IdP-initiated login (clicking the Eppo tile in Okta, Azure AD, etc.) can result in a login loop and is not supported.
:::
