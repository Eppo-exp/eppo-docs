---
sidebar_position: 9
---

# Configuration obfuscation

During SDK initialization, a configuration file is retrieved from Eppo, which includes information about the feature flag/experiment variations, traffic allocations, and targeting rules. The SDK stores these configurations locally for rapid lookup. However, when the SDK is initialized in certain mobile and browser clients, this configration may be accessible by users, and so Eppo hashes data in the configuration to obfuscate it. The configuration cannot be hashed entirely without compromising functionality, so the hashed fields in the configuration that can be used without leaking sensitive data are shown below.


```json
{
    "flags": {
        "<hashed_flag_key>": {
            "rules": [
                {
                    "conditions": [
                        {
                            "attribute": "<hashed_attribute>",
                            "operator": "<hashed_operator>",
                            "value": "<hashed_or_encoded_value>"
                        }
                    ],
                    "allocationKey": "allocation-123"
                },
                ...
            ],
            "allocations": [ ... ],
            ...
        },
        ...
    }
}
```

## Targetting rule values are conditionally hashed

The `value` field in `conditions` may or may not be hashed depending on the configured `operator` for the targetting rule in the allocation.

| `operator`                 | `value` |
| -------------------------- | ------- |
| is one of                  | hashed  |
| is not one of              | hashed  |
| less than (<)              | encoded |
| less than or equal (<=)    | encoded |
| greater than (>)           | encoded |
| greater than or equal (>=) | encoded |
| matches regex              | encoded |

The targetting rule's `operator` is configured in the UI during allocation setup.

<img src="/img/feature-flagging/select-rule-operator.gif" alt="Selecting rule operator" width="600" />

For `operator` types that do not support hashing, we recommend against entering sensitive data for the `value`.

## Allocation data is not hashed

Information about allocations is not hashed, which includes percent exposure and variation names and values. We therefore also recommend against entering sensitive data when configuring variations.

## Supported SDKs

| SDK                                                                 | Min version | Hashed data                          |
| ------------------------------------------------------------------- | ----------- | ------------------------------------ |
| [Android](https://search.maven.org/artifact/cloud.eppo/android-sdk) | v0.3.0      | feature flag key                     |
| [Javascript](https://www.npmjs.com/package/@eppo/js-client-sdk)     | v1.3.0      | feature flag key and targeting rules |

