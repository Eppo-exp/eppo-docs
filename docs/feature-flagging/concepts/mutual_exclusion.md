---
sidebar_position: 7
---

# Mutual exclusion (Layers)

:::note
Layers are only available on v3 of Eppo SDKs or higher
:::

There are situations when you want to run concurrent experiments on the same surface. Eppo offers Layers as an option to keep your experiments mutually exclusive.

:::info
Research from Microsoft has shown that in practice [interaction effects are vanishingly rare](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/a-b-interactions-a-call-to-relax/). Given this, we recommend only using mutual exclusion when the overlap of two new treatments critically degrades the user experience. For instance, a design team might want to run a homepage redesign test while a marketing team might want to experiment on the headline messaging on the same page. If the new layout removes the messaging altogether or makes it unreadable, these experiments should clearly not overlap.
:::

## Creating a Layer

Navigate to the Configuration section and click the "Create" button and select "Layer". You'll be prompted to fill out a number of details including the Layer name, the layer key, parameters, and the default variation.

![Create a layer](/img/feature-flagging/create-layer.png)

### Parameters
Parameters are attributes that are changed in different variations you plan to test within the layer. They are also configured in code and can accept the values you provide.

![Parameter example](/img/feature-flagging/parameter-example.jpg)

For example, if you want to test the color of a button on the page, you might create a parameter called `button_color` and set it with a default color value. When you create variations, you'll be able to specify a different value for color and test that variation in an experiment.

![Website with parameters](/img/feature-flagging/website-example.png)

## Layer Allocations
Layers have four levels of rules, or Allocations

![Layer allocations](/img/feature-flagging/layer-allocations.png)

### Opt-out rule
This is the top-most rule and is evaluated first. This allows you to target a specific group of users and force them into a Variation. In particular, this is useful when you want internal testers to be opted into a specific experience so they can test it.

### Experiments
This is where Experiments will be added and evaluated.

### Rollout
If you make a decision to ship a Variation from an Experiment, it will rollout to users in this rule. Specifically, Parameter values will be updated with the values from the winning variation you chose. Any users who are not opted-out and are not in a running experiment will be exposed to the Rollout.

### Default Serving Rule
This is the control Variation that users will see when they are not exposed to an Experiment and before any rollouts have taken place. 

## Setting up an Experiment in a Layer

Click on the Experiment allocations to add a new experiment to the Layer
![Add an experiment allocation](/img/feature-flagging/layer-add-experiment.png)

Here you are able to define the Experiment name, the Variations to include in the experiment (there must be at least two), and how much traffic in the layer your experiment will use. If there are no other experiments configured, a new experiment can use up to 100% of the layer and as little as 2%.
![Creating an experiment allocation](/img/feature-flagging/layer-create-allocation.png)

Once your Experiment allocation is created, you'll want to add an Experiment Analysis to it to understand how it's performing. Do this by clicking on the `Create Analysis` button and filling out information about the Analysis. See [Creating Experiments](/experiment-analysis/configuration) for more information.
![Creating an experiment analysis](/img/feature-flagging/layer-experiment-analysis.png)

## Setting up the Eppo SDK for a Layer

A Layer in Eppo uses the `getJSONAssignment()` SDK method along with the Layer key as the Flag key, and will return the parameters associated with the assignment for that user as an object.
To access a parameter value, you can use the following syntax:

```javascript
const subjectKey = '1727303863768';
const layerKey = 'checkout-page';
const subjectAttributes = {
  app_version: 10.4,
  country: 'us',
};
const defaultValue = {
  sticky_banner: false,
  banner_cta: 'Shop now',
  shoprunner: false,
  promo: null,
};

const layerParameters = eppoClient.getJSONAssignment(
    subjectKey,
    layerKey,
    subjectAttributes,
    defaultValue,
);
const stickyBanner = layerParameters.sticky_banner;
```


Additionally, the assignment logger returns the variation key as the variation to make logging easier:

```javascript
{
  allocation: 'allocation-5561',
  experiment: 'checkout-page-allocation-5561',
  featureFlag: 'checkout-page',
  variation: 'no-banner',
  subject: '1727303863768',
  timestamp: '2024-09-25T22:37:43.889Z',
  subjectAttributes: { app_version: 10.4, country: 'us' },
  metaData: {
    obfuscated: false,
    sdkLanguage: 'javascript',
    sdkLibVersion: '4.0.1'
  },
  evaluationDetails: {
    environmentName: 'Production',
    flagEvaluationCode: 'MATCH',
    flagEvaluationDescription: '1727303863768 belongs to the range of traffic assigned to "no-banner" defined in allocation "allocation-5561".',
    variationKey: 'no-banner',
    variationValue: {
      'sticky_banner': false,
      'banner_cta': 'Sign in for updates on shipping',
      'shoprunner': true,
      'promo': '$20 off $100'
    }
  }
}
```

## Concluding an Experiment and Rolling out a Winning Variation
Once the Experiment concludes, you'll want to free up the space in the layer that the Experiment was occupying and rollout any winners.

First make a decision on the Experiment in the Analysis section. Then you can either `Archive` the experiment if you do not plan to ship a winning variation or `Rollout & Archive` if a treatment won. Eppo will provide a button in either case.
![Rollout & Archive option](/img/feature-flagging/layer-rollout.png)

For a rollout, you'll be able to confirm the winning variation will replace the current default experience in your product. The winning variation will now show in the Rollout allocation of the Layer.
![Approve the rollout](/img/feature-flagging/layer-rollout-confirmation.png)
