# Testing Feature Flags

## Testing in Staging or Local Environments

Eppo supports separation of feature flags and their allocations between environments. Create an Eppo environment specifically for Staging or QA following this [documentation](/feature-flagging/#environments). Environments are separated by [SDK keys](/sdks/sdk-keys), and no unique key will be shared across Eppo Environments. Once an Environment is created, create an SDK for that Environment.

After a flag has been created, click **Switch Environment** on the flag page and select the testing Environment the flag should run in.

![Screenshot of list of Environments](/img/guides/testing-feature-flags/qa-flag-environments.png)

Click **Add Allocation** on the flag and serve the treatment or the experience to be tested to 100%.

Set your flag to **On** to have it run in the selected environment.

![Screenshot of allocation for Staging Environment](/img/guides/testing-feature-flags/qa-flag-staging-allocation.png)

## Testing in Production

To test in a Production environment, switch the environment on the flag to the **Production Environment**. 

Decide what will indicate an internal user based on what information is available. Create a [Feature Gate](/feature-flagging/feature-gates#create-a-feature-gate) and set up a targeting condition that targets internal users. 

In the example below, we target all users with an internal email address that ends in `@geteppo.com` or a specific user id. 

:::note
While Eppo does not store any raw data, note that targeting attributes will be passed into the logging callback function. If you do not want your logger to store user emails, you can apply the regex match before calling Eppo and then pass in a simple is_internal_user flag to the SDK call.
:::

![Screenshot of targeting of internal audience](/img/guides/testing-feature-flags/qa-flag-internal-audience.png)

Once the Feature Gate has been created, turn on the flag for the Production Environment to make the flag live for the internal audience.

## Duplicating Allocations

Depending on your team's review process, you can test out allocations on a flag in a Staging Environment before updating those allocations in a Production Environment by duplicating them. To duplicate an allocation, click the paper icon in the right hand corner of that allocation and select the Environment it should be duplicated to.

![Screenshot of duplicating an allocation on a flag](/img/guides/testing-feature-flags/duplicating-allocation.png)
