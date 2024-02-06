# Dynamic configuration

## What is Dynamic Configuration?

Dynamic Configuration changes the experience of an application from the Feature Flag without the need for a code deploy.

This is achieved by the engineering team implementing a number of variables in the application that can receive values from the feature flag configuration file. These variables can include front-end changes such as copy and color as well as back-end changes such as which version of an algorithm to utilize.

## Marketing use cases

Once implemented, Dyanamic Configuration allows non-technical users to set values in Eppo's UI and see the change live on site in seconds without a deploy. In particular, a marketing user can set different variants with different values, allowing them to run multiple tests all from the same flag without any additional engineering work. This can be used to update or test headline copy, CTA button copy and color, and image assets used.

## AI use cases

![Dynamic configuration AI example](/img/feature-flagging/dynamic-config-ai.png)

With Dynamic Configuration, AI engineers can put different models into head-to-head tests, comparing vertical-specific models vs. foundational models, proprietary vs. open source, and measure the impact on ROI. From the Eppo UI, it is easy to adjust inputs and parameters within different models, test them rapidly, and make continuous optimizations.

## Setup your first Dynamic Configuration test
 
As a first step, plan the values in the application you want the flag to be able to change. For example, if you want to change the headline of the page, you'll want to create a variable called `headline`.

![Dynamic configuration headline example](/img/feature-flagging/dynamic-config-headline-example.png)

Next, create a new Feature Flag and set the type to JSON. Start by creating a control Variation. Enter in the variables you plan on using along with the default values that you expect to show.

After you have a control variation, you can create additional variations based on tests you want to run. You can create these new variations at any time, so feel free to come back to this step as needed.

From here, create a new Experiment Allocation with two or more Variants to start running a test.

These key value pairs will be returned by the Eppo SDK and available for the application to use.

### Get typed assignments

The SDKs provide functions for getting assignments by type. The [Javascript client SDK](/feature-flags/sdksclient-feature-flags/sdksjavascript) for example has the following 5 functions:

```
getStringAssignment(...)
getBoolAssignment(...)
getNumericAssignment(...)
getJSONStringAssignment(...)
getParsedJSONAssignment(...)
```

The function names differ slightly according to naming conventions in the respective SDK languages. The function used to get the assignment must match the type of the feature flag. To get assignments for a JSON-type feature flag being used as a dynamic config, for example, you would use `getJSONStringAssignment` or `getParsedJSONAssignment`, whereas incorrectly calling `getNumericAssignment` would return `null` and no assignments would occur.
