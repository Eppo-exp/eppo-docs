# Typed assignments

The SDKs provide functions for getting assignments by different types. Visit [this page](/feature-flagging/concepts/flag-variations) to learn how to configure flag variations in the Eppo application.

The [Javascript client SDK](/sdks/client-sdks/javascript/intro) for example has the following 5 functions:

```javascript
getStringAssignment(...)
getBooleanAssignment(...)
getIntegerAssignment(...)
getNumericAssignment(...)
getJSONAssignment(...)
```

The function names differ slightly according to naming conventions in the respective SDK languages. The function used to get the assignment must match the type of the feature flag. To get assignments for a JSON-typed feature flag being used as a dynamic config, for example, you would use `getJSONAssignment`, whereas incorrectly calling `getNumericAssignment` would return the default variation and no assignments would occur.

## Flag Types

### String Flags

String flags are the most common type of flags. They are useful for both A/B/n tests and advanced targeting use cases.

```javascript
const variant = getStringAssignment(...);

if (variant === "version-a") {
    // ...
} else if (variant === "version-b") {
    // ...
} // ...
```

### Boolean Flags

Boolean flags support simple on/off toggles:

```javascript
if getBooleanAssignment(...) {
    # ...
} else {
    # ...
}
```

That prevents adding a third output. However, `True` can be ambiguous when the flag name names are unclear. For instance, `hide-or-delete-spam` or `no-collapse-price-breakdown`. We typically recommend sticking to strings that offer more explicit naming convention: `keep-and-hide-spam`, `delete-spam`, or `collapse-price-breakdown`, `expand-price-breakdown`, and `delete-price-breakdown`.

### Numeric and Integer Flags

Numeric and integer flags are useful when you want to modify a quantity: the number of product recommendations per page, the minimum spent for free delivery, etc. When someone edits the flag, it will remain a number. This helps prevent obvious configuration issues early.

```javascript
const freeDeliveryThreshold = getIntegerAssignment(...);

if (purchaseAmount >= freeDeliveryThreshold) {
    // apply free delivery
}
```

### JSON Flags

For advanced configuration use cases, consider using JSON flags. This allows us to include structured information, say the text of a marketing copy for a promotional campaign and the address of a hero image. Thanks to this pattern, one developer can configure a very simple landing page; with that in place, whoever has access to the feature flag configuration can decide and change what copy to show to users throughout a promotional period, almost instantly and without them having to release new code.

```javascript
const campaignJson = getJSONAssignment(...);
if (campaignJson !== null) {  
    campaign.hero = true;
    campaign.heroImage = campaignJson.heroImage;
    campaign.heroTitle = campaignJson.heroTitle || "";
    campaign.heroDescription = campaignJson.heroDescription || "";
}
```

Assuming your service can be configured with many input parameters, that flag type enables very flexible configuration changes.
