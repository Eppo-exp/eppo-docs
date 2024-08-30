---
sidebar_position: 4
---
# Authenticating with Okta

:::info
We currently do not support identity provider-initiated logins. Users must navigate to `https://eppo.cloud` to kick off the login process.
:::

## Summary

This short series of steps enables Okta admins to connect their Okta instances to Eppo for single sign on. Upon completion, your employees will be able to login to Eppo with Okta by navigating to `https://eppo.cloud` and entering their email address. A **video walk through** of this same sequence is available [here](https://www.loom.com/share/2103c5f66b694e73937d0da3a6ecfcac).

## Steps

Part 1: In your Okta instance, set up a new application for Eppo.

1. Login to the Okta Admin dashboard.
2. Navigate to **Applications > Applications** to set up a new integration.
3. Click **Create App Integration.**
4. Select `OIDC - OpenID Connect` as your **Sign-in method** and `Web Application` for your **Application type**. Hit **Next**.
5. Name your new app `Eppo`.
6. Replace the default `Sign-in redirect URI` to be `https://eppo.us.auth0.com/login/callback`. It’s important that this URL is correct.
7. Remove the default `Sign-out redirect`. It is not needed!
8. Under **Controlled access**, select which members of your organization will have access to Eppo. Most often this is `Allow everyone in your organization to access`.
9. Hit **Save**.
10. Once the new application is saved, under **General Settings** hit **Edit** and uncheck the checkbox **User consent.** This makes login more fluid for your employees, who won’t be prompted with an additional step on each login to confirm that they’d like to log in with Okta.
11. Hit **Save**.
12. Note down the app’s **Client ID**, **Client Secret**, ****and **Okta Domain** for Part 2.

Part 2: Securely send over your new app’s information to the Eppo team.

1. In a new tab open up **One Time Secret** ([https://onetimesecret.com/](https://onetimesecret.com/)). This will allow you to securely share your app’s sensitive details with the Eppo team via an encrypted link.
2. In the first text box, paste in your app’s **Client ID**, **Client Secret**, ****and **Okta Domain**, each separate by a new line.
3. Below, create a simple pass code for your secret.
4. Below, select **1 Day** as your **Lifetime**.
5. Click **Create a secret link**.
6. Once the link has been created, share the link along with the pass code to your Eppo team over Slack or email. The Eppo team will complete the configuration our end and let you know your integration is ready.