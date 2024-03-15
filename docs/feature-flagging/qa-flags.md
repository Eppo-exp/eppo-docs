# QA Flags

## Testing Environments

Eppo supports separation of feature flags and their allocations between environments. Create an Eppo environment specifically for Staging or QA following this [documentation](/sdks/api-keys). Environments are separated by [SDK keys](/sdks/api-keys), and no unique key will be shared across Eppo Environments. Once an Environment is created, create an SDK for that Environment.

![Screenshot of SDK key setup](/img/feature-flagging/qa-flag-sdk-key.png)

After a flag has been created, click **Switch Environment** on the flag page and select the testing Environment the flag should run in.

![Screenshot of list of Environments](/img/feature-flagging/qa-flag-environments.png)

Click **Add Allocation** on the flag and serve the treatment or the experience to be tested to 100%.

Set your flag to **On** to have it run in the selected environment.

![Screenshot of allocation for Staging Environment](/img/feature-flagging/qa-flag-staging-allocation.png)

## Testing in Production

To test in a Production environment, switch the environment on the flag to the **Production Environment**. 

Decide what will indicate an internal user based on what information is available. Create a [Feature Gate](/feature-flagging/feature-gates#create-a-feature-gate) and set up a targeting condition that targets internal users. 

In the example below, we target all users with an internal email address that ends in `@geteppo.com` or a specific user id. 

![Screenshot of targeting of internal audience](/img/feature-flagging/qa-flag-internal-audience.png)

Once the Feature Gate has been created, turn on the flag for the Production Environment to make the flag live for the internal audience.