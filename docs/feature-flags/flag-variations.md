---
sidebar_position: 4
---

# Flag variations

Eppo flags support multiple types: boolean, string, numeric, and JSON.

![Flag types](/img/feature-flagging/flag-types.png)

## Boolean flags

Boolean flags can only ever have two variants, each corresponding to a `true` or `false` value. We recommend setting boolean flags to `true` when the flag is on and `false` when the flag is off.

## String flags

String flags are the default and cover most use cases.

String flags have a limit of 65KB. Strings are UTF-8 encoded, so certain characters, like emojis and non-ASCII characters, take more than one byte each.

You can use escape sequences in string flag values.

## Numeric flags

Numeric flags are recommended when you want to target variations based on dates, timeouts, or other numerical operations.

Numeric flags can be either an integer or a floating-point type. Eppo will show an error message in the UI if a variation value is not a numeric type.

## JSON flags

JSON flags allow you to send a map of values. This can be helpful to change the user experience without needing to deploy code.

You can write an empty array as `{}` if there is no property value present for a variation.

JSON object and array flags have a size limit of 32KB.

Eppo will show an error message in the UI if a variation value does not validate as proper JSON.