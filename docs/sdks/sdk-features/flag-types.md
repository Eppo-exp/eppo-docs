# Typed assignments

The SDKs provide functions for getting assignments by different types. Visit [this page](/feature-flagging/flag-variations) to learn how to configure flag variations in the Eppo application.

The [Javascript client SDK](/sdks/client-sdks/javascript) for example has the following 5 functions:

```javascript
getStringAssignment(...)
getBooleanAssignment(...)
getIntegerAssignment(...)
getNumericAssignment(...)
getJSONAssignment(...)
```

The function names differ slightly according to naming conventions in the respective SDK languages. The function used to get the assignment must match the type of the feature flag. To get assignments for a JSON-typed feature flag being used as a dynamic config, for example, you would use `getJSONAssignment`, whereas incorrectly calling `getNumericAssignment` would return the default variation and no assignments would occur.
