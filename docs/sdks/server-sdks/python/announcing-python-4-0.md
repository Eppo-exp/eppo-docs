# Announcing Python SDK 4.0

We’re excited to announce the release of Python SDK 4.0!

This release signifies a big milestone for the Python SDK.
It’s a complete rewrite of the SDK using a shared Eppo core library written in Rust.

Using a shared core library allows us to centralize our efforts and provide better performance, stability, and deliver new features faster.

## Better performance

Thanks to Rust’s natural speed, the assignment evaluation performance improved 2–5x depending on the feature flag configuration.
You may expect even better performance in the future as we continue to optimize the core library.

Additionally, configuration update now happens in a background thread without ever holding Global Interpreter Lock (GIL), so it runs in parallel with your Python threads without slowing them down.

## New API

### Evaluation details

Python SDK now support [evaluation details](/sdks/sdk-features/debugging-flag-assignment/#evaluation-details).

`EppoClient` exposes a set of new methods:
- `get_string_assignment_details()`
- `get_integer_assignment_details()`
- `get_numeric_assignment_details()`
- `get_boolean_assignment_details()`
- `get_json_assignment_details()`
- `get_bandit_action_details()`

These methods trace the evaluation process and collect tons of details (down to individual conditions).
All this information is extremely helpful to debug why a specific variation was chosen.
However the tracing adds a slight performance overhead, so you should prefer non-detailed methods in production.

All details methods return `EvaluationResult` with evaluation details stored in `evaluation_details` field:
```python
evaluation = client.get_boolean_assignment_details(
    "kill-switch", "test-subject", {"country": "UK", "age": 62}, False
)

print("assignment:", evaluation.variation)
pprint.pp(evaluation.evaluation_details)
```

Prints the following:
```python
assignment: True
{'flagKey': 'kill-switch',
 'subjectKey': 'test-subject',
 'subjectAttributes': {'age': 62.0, 'country': 'UK'},
 'timestamp': '2024-09-09T14:34:15.983952Z',
 'configFetchedAt': '2024-09-09T14:34:15.983905Z',
 'configPublishedAt': '2024-04-17T19:40:53.716Z',
 'environmentName': 'Test',
 'banditEvaluationCode': None,
 'flagEvaluationCode': 'MATCH',
 'flagEvaluationDescription': 'Supplied attributes match rules defined in '
                              'allocation "on-for-age-50+".',
 'variationKey': 'on',
 'variationValue': True,
 'banditKey': None,
 'banditAction': None,
 'allocations': [{'key': 'on-for-NA',
                  'orderPosition': 1,
                  'allocationEvaluationCode': 'FAILING_RULE',
                  'evaluatedRules': [{'matched': False,
                                      'conditions': [{'condition': {'operator': 'ONE_OF',
                                                                    'attribute': 'country',
                                                                    'value': ['US',
                                                                              'Canada',
                                                                              'Mexico']},
                                                      'attributeValue': 'UK',
                                                      'matched': False}]}],
                  'evaluatedSplits': []},
                 {'key': 'on-for-age-50+',
                  'orderPosition': 2,
                  'allocationEvaluationCode': 'MATCH',
                  'evaluatedRules': [{'matched': True,
                                      'conditions': [{'condition': {'operator': 'GTE',
                                                                    'attribute': 'age',
                                                                    'value': 50.0},
                                                      'attributeValue': 62.0,
                                                      'matched': True}]}],
                  'evaluatedSplits': [{'variationKey': 'on',
                                       'matched': True,
                                       'shards': [{'matched': True,
                                                   'shard': {'salt': 'some-salt',
                                                             'ranges': [{'start': 0,
                                                                         'end': 10000}]},
                                                   'shardValue': 1191}]}]},
                 {'key': 'off-for-all',
                  'orderPosition': 3,
                  'allocationEvaluationCode': 'UNEVALUATED',
                  'evaluatedRules': [],
                  'evaluatedSplits': []}]}
```

### Wait for initialization

`EppoClient` has a new `wait_for_initialization()` method. This method parks the current Python thread until the client fetches the configuration. It releases Global Interpreter Lock (GIL) while it waits, so it does not block other Python threads.

If you used `sleep` to wait for `EppoClient` initialization before getting assignments, you may replace it with `client.wait_for_initialization()` now.

### Configuration API

This release extends [advanced configuration control API](/sdks/server-sdks/python/#c-advanced-configuration-control) introduced in 3.7.0.

`EppoClient` now exposes `get_configuration()` method that returns currently-active configuration.

`Configuration` now exposes new methods:
- `get_flags_configuration()`
- `get_flag_keys()`
- `get_bandit_keys()`

This API can be used for debugging or advanced optimizations: caching configuration, faster client-side initialization from server configuration, etc.

### Simpler module structure

As our API surface is pretty small, it is now all exposed from a single `eppo_client` module. If you used to import multiple locations, you may now use a single import:

```diff
-from eppo_client.assignment_logger import AssignmentLogger
-from eppo_client.config import Config
+from eppo_client import AssignmentLogger, Config
```

## Breaking Changes

### Increased minimum Python version to 3.8

Minimum required Python version has been bumped from 3.6 to 3.8.

### Stricter validation

As Rust’s type checking is not optional, it forced us to validate the inputs more strictly.
If you used Python’s type checking or followed the types, there’s nothing to worry about.

Notable places where validation became stricter:
- All attributes are now required to be one of `str`, `int`, `float`, `bool`, or `None`. Previously, this was declared with Python’s type annotation. Now it is enforced with a runtime check.
- `Configuration` now requires `bytes` for initialization. Previously, `str` was also accepted.
- `ClientConfig` now rejects negative values for poll interval and jitter. 0 is not an allowed poll interval either.

### Hidden implementation details

As the previous SDK accidentally exposed too much implementation details, it was impossible to keep API exactly the same as most details are now strictly encapsulated inside the core library.

We have removed methods and functions that we consider implementation details.

An incomplete list of APIs removed:
- `EppoClient.__init__()`
- `EppoClient.get_assignment_variation()`
- `EppoClient.get_assignment_detail()`
- `EppoClient.evaluate_bandit_action()`
- `ExperimentConfigurationRequestor`, `ConfigurationStore`, `HttpClient`, flag and bandit evaluators
- Internal model definitions
- Various helper functions

These all were considered implementation details and thus were unsafe to use.

:::info

If we removed your favorite API, let us know about your use case and we’re happy to bring it back!

:::

### `get_flag_configurations()` is removed

`EppoClient.get_flag_configurations()` has been removed in favor of `EppoClient.get_configuration()` and `Configuration` class.

```diff
-client.get_flag_configurations()
+client.get_configuration().get_flag_configuration()
```

Note that the new function returns an opaque `bytes` instead of dictionary.

## Deprecations

- All modules except top-level `eppo_client` are now deprecated. Other modules still re-export the most important types but they will be removed in the next major release.
- `EppoClient.get_flag_keys()` and `EppoClient.get_bandit_keys()` are deprecated in favor of `Configuration`.
- `BanditResult` has been renamed to `EvaluationResult`. `BanditResult` name is still available as an alias.
- `Config` has been renamed to `ClientConfig` to avoid confusion with the new `Configuration`. The old name is still available as an alias.
