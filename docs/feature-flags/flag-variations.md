---
sidebar_position: 4
---

# Flag variations

All Eppo flags return strings. However, since strings are generic, they can be used to represent numbers (e.g `'5'`), booleans (e.g `'true'`), and even maps with arbitrary key-value pairs:

![Typed flags](/img/feature-flagging/typed-flags.png)

In the example above the flag has two variants, each with it’s own JSON value represented as a string. When delivering this flag, _Eppo SDKs will return strings_. It is up to your application to deserialize these strings into maps. The same is true for numbers and booleans. Deserialized typed values can than then be used in your application logic.
