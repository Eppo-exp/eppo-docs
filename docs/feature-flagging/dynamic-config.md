# Dynamic configuration

## What is Dynamic Configuration?

Dynamic Configuration changes the experience of an application from the Feature Flag without the need for a code deploy.

This is achieved by the engineering team implementing a number of variables in the application that can receive values from the feature flag configuration file. These variables can include front-end changes such as copy and color as well as back-end changes such as which version of an algorithm to utilize.

## Marketing use cases

Once implemented, Dynamic Configuration allows non-technical users to set values in Eppo's UI and see the change live on site in seconds without a deploy. In particular, a marketing user can set different variants with different values, allowing them to run multiple tests all from the same flag without any additional engineering work. This can be used to update or test headline copy, CTA button copy and color, and image assets used.

### Using JSON flags to parameterize frequently tested areas

JSON flags can be used to parameterize your app or site to run experiments without an additional code release. By using a [JSON flag](https://docs.geteppo.com/feature-flagging/flag-variations#json-flags), values from Eppo dynamically update predefined values in your code. Extending the feature flag example above, variables in your code can be created to accept a value defined in the JSON object defined in Eppo. Combine JSON flags with the ability to create multiple experiment allocations on the same flag, and you can create new experiments without releasing additional code.
```jsx
import * as EppoSdk from '@eppo/node-server-sdk';

const client = EppoSdk.getInstance();
const variation = client.getParsedJSONAssignment("<SUBJECT-KEY>", "winter-promo", attributes)

if (variation.show_banner === 'true') {
	return banner_component
}

const background_image = variation.image_url;
const cta = variation.cta;
```
### Running no/low code experiments in Eppo

Often times there is a need for teams to be able to release changes quickly without a code release, or there are frequently tested parts of a site or app where teams would like to execute changes in a self-service manner. Running experiments without having to release additional code is easy to do in Eppo by using a JSON flag type to parameterize parts of the site or app where frequent changes are made and creating additional experiment allocations on the same flag. By combining JSON flags and the ability to create new [experiment allocations on the same flag](/feature-flagging/experiment-assignment#creating-multiple-experiments-on-the-same-flag), teams can ship new experiments without a code release.

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