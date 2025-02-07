---
sidebar_position: 4
---

# Provision Eppo users with SCIM

:::note
If you are interested in provisioning users through SCIM, please contact Eppo support.
:::

Provisioning users through SCIM (the System for Cross-domain Identity Management) provides a secure and automated way to create and manage Eppo users through your preferred IdP (Okta, Microsoft Entra and others). 

We partner with [WorkOS](https://workos.com/docs/integrations/scim) to provide a secure SCIM connection using the 2.0 version of the SCIM protocol. Please contact Eppo with the email of your IT admin; 
they will receive an onboarding email from WorkOS with an onboarding wizard containing the necessary information to complete the setup tailored to your organization.

Eppo offers support for:

* Provisioning new users
* Updating user profiles: name & role.
* De-provisioning users
* User roles via Groups
:::note
Users created with SCIM can only be updated through your IdP.
:::

Existing users can be populated through a programmatic process; please contact Eppo to request this.

## Okta

[Setup guide from WorkOS](https://workos.com/docs/integrations/okta-scim).

* Create a new Okta app, do not show it to end users.
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

To assign users and groups:
* Navigate to the assignments tab.
* Click the Assign button and select Assign to Groups.
* Select the groups you want to assign to the application.
* Click Save.

To push groups for role assignment: (see User roles via Groups below for more details about roles)
* Navigate to the Push Groups tab.
* Click the Push Groups button and select Find groups by name.
* Select the groups for each role.
* Check the box for Push Immediately.
* Click Save.
* In WorkOS, you can now map the groups to the Eppo role.

## Microsoft Entra

[Setup guide from WorkOS](https://workos.com/docs/integrations/entra-id-scim).

* Create a new Entra app or use an existing one configured for SSO. 
* Enable SCIM provisioning.
* On the provisioning tab, enable Microsoft Entra ID Users and Microsoft Entra ID Groups.

## Other IdPs

Eppo supports additional IdPs: OneLogin, PingFederate, Rippling and JumpCloud. Please contact Eppo for onboarding guides on these platforms.

## User roles via Groups

[Directory group role assignment from WorkOS](https://workos.com/docs/directory-sync/identity-provider-role-assignment/directory-group-role-assignment).

<img src="/img/administration/scim/scim-workos-groups.png" alt="Map groups to Eppo roles" width="600" />

To configure user roles via groups, you will need to create a group in your IdP for each Eppo role and map it to the Eppo role in the WorkOS setup.

Our roles are: `Admin`, `Data Owner`, `Experiment Editor`, and `Viewer`. See [our role documentation](/administration/users-and-permissions/) for more details.

We recommend naming the groups after the role, e.g. `Eppo Admin`, `Eppo Data Owner`, `Eppo Experiment Editor`, and `Eppo Viewer`. Once your groups are pushed to WorkOS, you can map them to the Eppo role (see screenshot above).
