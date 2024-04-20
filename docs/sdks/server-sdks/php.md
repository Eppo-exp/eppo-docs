import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PHP

Eppo's open source PHP SDK can be used for both feature flagging and experiment assignment:

- [GitHub repository](https://github.com/Eppo-exp/php-sdk)
- [Package](https://packagist.org/packages/eppo/php-sdk)

## 1. Install the SDK

Run

```
composer require eppo/php-sdk
```

## 2. Initialize the SDK

Initialize the SDK with a SDK key, which can be generated in the Eppo interface. Initialization should happen when your application starts up to generate a singleton client instance, once per application lifecycle:

```php
use Eppo\EppoClient;

require __DIR__ . '/vendor/autoload.php';

$eppoClient = EppoClient::init(
   "<your_sdk_key>",
   "<base_url>", // optional, default https://eppo.cloud/api
   $assignmentLogger, // optional, must be an instance of Eppo\LoggerInterface
   $cache // optional, must be an instance of PSR-6 CacheInterface. If not passed, FileSystem cache will be used
);
```

To make the experience of using the library faster, there is an option to start a background polling for randomization params.
This way background job will start calling the Eppo API, updating the config in the cache.

For this, create a file, e.g. `eppo-poller.php` with the contents:

```php
$eppoClient = EppoClient::init(
   "<your_sdk_key>",
   "<base_url>", // optional, default https://eppo.cloud/api
   $assignmentLogger, // optional, must be an instance of Eppo\LoggerInterface
   $cache // optional, must be an instance of PSD-16 SimpleInterface. If not passed, FileSystem cache will be used
);

$eppoClient->startPolling();
```

after this, run this script by:

`php eppo-poller.php`

This will start an indefinite process of polling the Eppo API.

### Define an assignment logger (experiment assignment only)

If you are using the Eppo SDK for experiment assignment (i.e randomization), pass in a callback logging function to the `EppoClient::init` function on SDK initialization. The SDK invokes the callback to capture assignment data whenever a variation is assigned.

The code below illustrates an example implementation of a logging callback using Segment. You could also use your own logging system, the only requirement is that the SDK receives a class with `logAssignment` method. Here we define an implementation of the `Eppo\Logger\LoggerInterface` interface containing a single function named `logAssignment`:

```php
<?php

use Eppo\Logger\LoggerInterface;

class Logger implements LoggerInterface {
  public function logAssignment(
    string $experiment,
    string $variation,
    string $subject,
    string $timestamp,
    array $subjectAttributes = []
  ) {
    var_dump(
      json_encode([
        'experiment' => $experiment,
        'variation' => $variation,
        'subject' => $subject,
        'timestamp' => $timestamp,
      ]);
    );
  }
}
```

The SDK will invoke the `logAssignment` method with the following parameters:

| Field                     | Description                                                                                                              | Example                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `experiment` (string)     | An Eppo experiment key                                                                                                   | "recommendation-algo-allocation-17" |
| `subject` (string)        | An identifier of the subject or user assigned to the experiment variation                                                | UUID                                |
| `variation` (string)      | The experiment variation the subject was assigned to                                                                     | "control"                           |
| `timestamp` (string)      | The time when the subject was assigned to the variation                                                                  | 2021-06-22T17:35:12.000Z            |
| `subjectAttributes` (map) | A free-form map of metadata about the subject. These attributes are only logged if passed to the SDK assignment function | `{ "country": "US" }`               |
| `featureFlag` (string)    | An Eppo feature flag key                                                                                                 | "recommendation-algo"               |
| `allocation` (string)     | An Eppo allocation key                                                                                                   | "allocation-17"                     |

:::note
More details about logging and examples (with Segment, Rudderstack, mParticle, and Snowplow) can be found in the [event logging](/sdks/event-logging/) page.
:::

## 3. Assign variations

Assign users to flags or experiments using `get<Type>Assignment`, depending on the type of the flag.
For example, for a String-valued flag, use `getStringAssignment`:

```php
<?php

use Eppo\EppoClient;

require __DIR__ . '/vendor/autoload.php';

$eppoClient = EppoClient::init(
   "<your_sdk_key>",
   "<base_url>", // optional, default https://eppo.cloud/api
   $assignmentLogger, // optional, must be an instance of Eppo\LoggerInterface
   $cache // optional, must be an instance of PSR-6 CacheInterface. If not passed, FileSystem cache will be used
);

$subjectAttributes = [];
$variation = $eppoClient->getStringAssignment(
  'subject-1', // subject key
  'experiment_5', // flag key
  'control', // default variation
  $subjectAttributes
);

if ($variation === 'control') {
    // do something
}

```

The `getStringAssignment` function takes three required and one optional input to assign a variation:

- `subjectKey` - The entity ID that is being experimented on, typically represented by a uuid.
- `flagKey` - This key is available on the detail page for both flags and experiments. Can also be an experiment key.
- `defaultValue` - The value that will be returned if no allocation matches the subject, if the flag is not enabled, if `getStringAssignment` is invoked before the SDK has finished initializing, or if the SDK was not able to retrieve the flag configuration. Its type must match the `get<Type>Assignment` call.
- `subjectAttributes` - An optional map of metadata about the subject used for targeting. If you create rules based on attributes on a flag/experiment, those attributes should be passed in on every assignment call.


### Typed assignments

The following typed functions are available:

```
getBoolAssignment(...)
getNumericAssignment(...)
getIntegerAssignment(...)
getStringAssignment(...)
getJSONAssignment(...)
```

:::note
It may take up to 10 seconds for changes to Eppo experiments to be reflected by the SDK assignments.
:::
