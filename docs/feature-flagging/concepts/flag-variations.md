---
sidebar_position: 0
---

# Flag variations

Variations are the distinct paths that can be taken from a single flag. In the simplest case a flag will have one variation (on/off), but there is no limit if you choose to create a flag with two or more variations.

As a simple example, consider a feature flag that controls the button color of the "Buy Now" button on the checkout page.
In this case, the feature flag may be called `checkout_page_buy_now_button_color` and the variations could be `red`, `green` and `yellow`. 

Eppo flags support multiple types: boolean, string, integer, numeric, and JSON.

![Flag types](/img/feature-flagging/flag-types.png)

## Boolean flags

Boolean flags can only ever have one variant, where the flag being enabled corresponds to a value of `true` and the flag being disabled corresponds to a value of `false`. As such, boolean flags are great for creating simple on/off toggles.

Choosing a one variation flag makes the Flag a Boolean type.

![Feature gate 1](/img/feature-flagging/feature-gate-1.png)

## String flags

String flags are the default for a flag with two or more experiences and is the most common type of flag. They are useful for both A/B/n tests and advanced targeting use cases.

String flags have a limit of 65KB. Strings are UTF-8 encoded, so certain characters, like emojis and non-ASCII characters, take more than one byte each.

You can use escape sequences in string flag values.

## Integer flags

Integer flags are recommended when you want to target variations based on integer operations, such as the number of product recommendations per page, the minimum spent for free delivery, etc.

## Numeric flags

Numeric flags are recommended when you want to target variations based on dates, timeouts, or other numerical operations.

Numeric flags can be either an integer or a floating-point type. Eppo will show an error message in the UI if a variation value is not a numeric type.

## JSON flags

JSON flags allow you to send a map of values. This allows us to include structured information, say the text of a marketing copy for a promotional campaign and the address of a hero image. Thanks to this pattern, one developer can configure a very simple landing page; with that in place, whoever has access to the feature flag configuration can decide and change what copy to show to users throughout a promotional period, almost instantly and without them having to release new code.

You can write an empty array as `{}` if there is no property value present for a variation.

JSON object and array flags have a size limit of 32KB.

Eppo will show an error message in the UI if a variation value does not validate as proper JSON.
