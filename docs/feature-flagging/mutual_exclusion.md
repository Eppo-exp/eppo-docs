# Layers

:::note
Layers are currently in closed Beta
:::

There are situations when you want to run concurrent experiments on the same surface. Eppo offers Layers as a option to keep your experiments mutual exclusive.

Research from Microsoft has shown that in practice [interaction effects are vanishingly rare](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/a-b-interactions-a-call-to-relax/). Given this, we recommend only using mutual exclusion when the overlap of two new treatments critically degrades the user experience. For instance, a design team might want to run a homepage redesign test while a marketing team might want to experiment on the headline messaging on the same page. If the new layout removes the messaging altogether or makes it unreadable, these experiments should clearly not overlap.

## Creating a Layer

Navigate to the Configuration section and click the "Create" button and select "Layer". You'll be promoted to fill out a number of details including the Layer name, the layer key, parameters, and the default variation.

### Parameters
Parameters are attributes that are changed in different Variations you plan to test within the Layer. They are also configured in code and can accpet the values you provide.

For example, if you want to test the color of a button on the page, you might create a parameter called `cta_button_color` and set it with a default color value. When you create Variations, you'll be able to specify a different value for color and test that Variation in an Experiment.

### Layer Allocations
Layers have four levels of rules, or Allocations

#### Opt-out rule
This is the top-most rule and is evaluated first. This allows you to target a specific group of users and force them into a Variation. In particular, this is useful when you want internal testers to be opted-in to a specific experience so they can test it.

#### Experiments
This is where Experiments will be added and evaluated.

#### Rollout
If you make a decision to ship a Variation from an Experiment, it will rollout to users in this rule. Specifically, Parameter values will be updated with the values from the winning Variation you chose. Any users who are not opted-out and are not in a running experiment will be exposed to the Rollout.

### Default Serving Rule
This is the control Variation that users will see when they are not exposed to an Experiment and before any rollouts have taken place. 

## Setting up an Experiment in a Layer

