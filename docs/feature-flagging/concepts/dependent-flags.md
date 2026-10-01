# Dependent flags

There are times when you want your flag targeting rules driven by what the user experienced with other flags. 

For example, if you have a redesigned UI you're rolling out, you may want iterations on this redesign as their own feature flags that are only applicable to users who are eligible to see this UI revamp. Only users who are enabled for the new UI should also be enrolled in this new flag.

In Eppo, this is extremely easy when using targeting rules for Dependent Flags.

## Using Dependent Flags in a Targeting Rule

In a flag, add a feature gate or experiment assignment. From here, you'll be able to add a targeting rule. Select `Dependent Flags` as the type of rule to add and you'll be able to select any other flag created in Eppo.

![Select dependent flag rule](/img/feature-flagging/dependent-flags/dependent-flag-select.png)

Once a flag is selected, you're able to select the parent variation(s) the user was assigned to (by variation key) in order to be eligible for this assignment.

![Select the parent variations for eligibility](/img/feature-flagging/dependent-flags/dependent-flag-value.png)

Once you save, you'll see your dependent flag rule in the flag waterfall view. You can choose to make the Dependent Flag rule first so that it's evaluated first, or you can order it below other rules depending on what meets your needs.

![Flag waterfall with a Dependent Flag rule](/img/feature-flagging/dependent-flags/dependent-flag-waterfall.png)

## Configuring Dependent Flags in code

Like other targeting rules, the `get_*_assignment` function must pass the relevant information to evaluate the user for the Dependent Flag rule. Pass two subject attributes:

- `dependent_flag` — the parent flag key (the same key you pass to `get_*_assignment` on the parent).
- `variation_served` — the **variation key** the parent assigned, not the flag key and (for JSON flags) not the parsed JSON value.

The SDK evaluates these attributes literally against the dependent-flag rule conditions. The value must match the variation key stored for the selected parent variation.

### Use the parent's variation key

Every variation has a key, a string that is set when the variation is created and never changes afterwards, so assignment logs stay consistent. The key starts out as:

- the value as entered, for String, Numeric, and Integer flags (for example `new-checkout` or `2.50`); a String variation created with an empty value starts with the key `empty-string`;
- `true` or `false`, for Boolean flags;
- the slugified variation name, for JSON flags (for example, `Model 1` → `model-1`).

The value an assignment function returns can therefore differ from the key the rule expects:

- The variation's value was edited after it was created. The key keeps its original text: a String variation created as `new-checkout` and later changed to `checkout-v2` still has the key `new-checkout`, and a Numeric variation created as `1.0` and changed to `1.25` still has the key `1.0`.
- A Numeric value was entered with formatting the SDK doesn't preserve. A variation entered as `2.50` has the key `2.50`, while the SDK returns the number `2.5`.
- Eppo may append a random suffix to keep variation keys unique within a flag (for example, `1.0-2a09e`).
- For JSON flags, the assignment function returns the JSON value, never the key.

So for every flag type, pass the parent's `variationKey` from its assignment details as `variation_served`, rather than the assignment result. If the parent wasn't assigned a variation (for example, the flag is disabled), `variationKey` is `None` in Python (`null` in JavaScript); omit both dependency attributes in that case, and the dependent flag keeps evaluating its other rules as usual.

```python
import eppo_client

client = eppo_client.get_instance()

parent = client.get_string_assignment_details(
  "new-onboarding-flow",
  "<SUBJECT-KEY>",
  {}, # optional subject attributes
  "<DEFAULT-VALUE>"
)
parent_variation_key = parent.evaluation_details["variationKey"]  # e.g. "new-checkout"

subject_attributes = {}  # optional subject attributes
if parent_variation_key is not None:
  subject_attributes["dependent_flag"] = "new-onboarding-flow"
  subject_attributes["variation_served"] = parent_variation_key

variation = client.get_string_assignment(
  "<FLAG-KEY>",
  "<SUBJECT-KEY>",
  subject_attributes,
  "<DEFAULT-VALUE>"
)
```

Use the details function that matches the parent's type (`get_boolean_assignment_details`, `get_numeric_assignment_details`, `get_json_assignment_details`, and so on).

### JSON parent flags

The same pattern applies; only the details function changes:

```python
parent = client.get_json_assignment_details(
  "parent-json-flag",
  "<SUBJECT-KEY>",
  {},
  {},  # default JSON value
)
parent_variation_key = parent.evaluation_details["variationKey"]  # e.g. "exclude"

subject_attributes = {}
if parent_variation_key is not None:
  subject_attributes["dependent_flag"] = "parent-json-flag"
  subject_attributes["variation_served"] = parent_variation_key

variation = client.get_string_assignment(
  "<DEPENDENT-FLAG-KEY>",
  "<SUBJECT-KEY>",
  subject_attributes,
  "<DEFAULT-VALUE>",
)
```

:::note
JSON variation keys are derived from the variation name at creation time (lower-cased, spaces replaced with `-`). They do not change if you rename the variation later. See [Debugging Flag Assignment](/sdks/sdk-features/debugging-flag-assignment) for the full `variationKey` / `variationValue` behavior.
:::

### SDKs without assignment details

Some SDKs don't expose assignment details yet (see [Debugging Flag Assignment](/sdks/sdk-features/debugging-flag-assignment)). With those, mapping the parent's returned value to a variation key in your code is safe only when every returned value identifies exactly one of the parent's variations, and you can tell an actual assignment apart from the default value the SDK returns when nothing was assigned. Different keys can return the same value (Numeric variations created as `1` and `1.0` both return `1`), and the default value can equal a configured variation's value. Otherwise, obtain the parent's variation key through an SDK that exposes assignment details.

### Existing dependent-flag rules with a JSON parent

If you created dependent-flag rules against a JSON parent flag before the Eppo UI stored variation keys correctly, re-open the rule in the flag editor and save it again so `variation_served` is stored as the variation key.
