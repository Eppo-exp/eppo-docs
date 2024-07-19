---
sidebar_position: 4
---

# Provision Eppo users with SCIM

:::note
Provisioning users through SCIM is currently in closed Beta.
:::

## Configuring Directory Sync (SCIM)

Provisioning users through SCIM (the System for Cross-domain Identity Management) provides a secure and automated way to create and manage Eppo users through your preferred IdP (Okta, Microsoft Entra and others).

Eppo offers support for:

* Provisioning new users
* Updating user profiles: name & role.
* De-provisioning users

Users created with SCIM can only be updated through your IdP.

We partner with WorkOS to provide a secure SCIM connection.Follow the steps from the WorkOS setup guide that you receive from your Eppo.

## Okta

* Create a new Okta app or use an existing one configured for SSO. 
* Enable SCIM provisioning.

<img src="/img/administration/scim/scim1.png" alt="enable SCIM provisioning" width="600" />

In the WorkOS setup console, you can now proceed to `Step 2: Configure Okta API Integration`. Scroll down until you see the Endpoint and Bearer Token. 

<img src="/img/administration/scim/scim2.png" alt="configure Okta API Integration" width="600" />

You will copy these into your Okta app. Go to the Provisioning tab, then click on Integration in the side bar and click Edit.

<img src="/img/administration/scim/scim3.png" alt="configure Okta API Integration" width="600" />

Fill out the fields as shown in the screenshot above: Paste the base URL from the WorkOS setup guide into the SCIM connector base URL field. 

* For Unique identifier field for users, set to "email". 
* Check the Push New Users and Push Profile Updates. 
* For Authentication Mode, select HTTP Header and paste the Bearer Token from the WorkOS set up to the field. 
* Click Save.  

### Attributes and Roles

Set up Attribute Mapping, you will see that we support a custom attribute called `eppoMemberRole`. This optional custom attribute allows an IT admin to set the user's Eppo role from within the IdP.

That attribute can only have the following attributes (strings): `default`, `viewer`, `experiment_editor`, `data_owner`, `admin`

The `default` value is useful for migrating to managing roles in the Idp: it will keep the user's role as it is in Eppo, or if the user is new, it will assume the default user role as configured in Eppo.

<img src="/img/administration/scim/scim-custom-attribute.png" alt="configure Okta API Integration" width="600" />
