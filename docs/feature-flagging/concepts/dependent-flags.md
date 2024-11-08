# Dependent flags

There are times when you want your flag targeting rules driven by what the user experienced with other flags. 

For example, if you have a redesigned UI you're rolling out, you may want iterations on this redesign as their own feature flags that are only applicable to users who are eligible to see this UI revamp. Only users who are enabled for the new UI should also be enrolled in this new flag.

In Eppo, this is extremely easy when using targeting rules for Dependent Flags.

## Using Dependent Flags in a Targeting Rule

In a flag, add a feature gate or experiment assignment. From here, you'll be able to add a targeting rule. Select `Dependent Flags` as the type of rule to add and you'll be able to select any other flag created in Eppo.

![Select dependent flag rule](/img/feature-flagging/dependent-flags/dependent-flag-select.png)

Once a flag is selected, you're able to select the variation(s) of the flag the user is evaluated to in order to be eligible for this assignment.

![Select the values for eligibility](/img/feature-flagging/dependent-flags/dependent-flag-value.png)

Once you save, you'll see your dependent flag rule in the flag waterfall view. You can choose to make the Dependent Flag rule first so that it's evaluated first, or you can order it below other rules depending on what meets your needs.

![Flag waterfall with a Dependent Flag rule](/img/feature-flagging/dependent-flags/dependent-flag-waterfall.png)

## Configuring Dependent Flags in code

Like other targeting rules, the `get_*_assignment` function must pass the relevant information to evaluate the user for the Dependent Flag rule. Specifically the dependent flag key and variation served should be passed in the function, like the following Python example:

```python
import eppo_client

client = eppo_client.get_instance()
variation = client.get_string_assignment(
  "<FLAG-KEY>",
  "<SUBJECT-KEY>",
  { "dependent_flag": "new-onboarding-flow", "variation_served": "true" }, 
  "<DEFAULT-VALUE>")
```