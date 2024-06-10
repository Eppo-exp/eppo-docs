import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Rust

Eppo's Rust SDK can be used for feature flagging and experiment assignment in Rust applications.

- [GitHub repository](https://github.com/Eppo-exp/rust-sdk)
- [Crate](https://crates.io/crates/eppo)
- [Crate documentation](https://docs.rs/eppo/latest/eppo/)

### Getting started

#### Install the SDK

First, add the SDK as a dependency using Cargo:

```sh
cargo add eppo
```

#### Initialize the SDK

To initialize the SDK, you will need an SDK key. You can generate one in [the Eppo interface](https://eppo.cloud/feature-flags/keys).

```rust
let mut client = eppo::ClientConfig::from_api_key("<YOUR_API_KEY>")
    .to_client();

client.start_poller_thread();
```

This creates a client instance that can be reused throughout the application lifecycle, and starts a poller thread to periodically fetch latest feature flag configuration from Eppo server.

#### Assign variations

Assign users to flags or experiments using the appropriate `get_*_assignment` function, depending on the type of the flag. For example, to get a string value from a flag, use `get_string_assignment`:

```rust
let variation = client
    .get_string_assignment(
        "<FLAG_KEY>",
        "<SUBJECT_KEY>",
        <SUBJECT_ATTRIBUTES>,
    )
    .inspect_err(|err| eprintln!("error assigning a flag: {:?}", err))
    .unwrap_or_default()
    .unwrap_or("<DEFAULT_VALUE>".to_owned());

if variation == "fast_checkout" {
    // Handle fast checkout
} else {
    // Handle other variations
}
```

- `<FLAG_KEY>` is the key that you chose when creating a flag. You can find it in [the Eppo interface](https://eppo.cloud/feature-flags).
- `<SUBJECT_KEY>` is a value that identifies each entity in your experiment, typically a user ID.
- `<SUBJECT_ATTRIBUTES>` is a `HashMap` of metadata about the subject used for targeting. If targeting rules are based on attributes, they must be passed in on every assignment call. If no attributes are needed, pass an empty `HashMap`.

That’s it: You can start changing the feature flag on the page and see how it controls your code!

However, if you want to run experiments, there’s a little extra work to configure it properly.

### Assignment Logging for Experiments

If you are using the Eppo SDK for **experiment** assignment (i.e., randomization), we will need to know which subjects were exposed to experiment. For that, you will need to log the assignment information.

Eppo encourages centralizing application event logging as much as possible. Accordingly, instead of implementing a new event logging framework, Eppo's SDK integrates with your existing logging system via a logging callback function defined at SDK initialization.

The code below illustrates an example implementation of a logging callback to the console and other event platforms. You could also use your own logging system, the only requirement is that you should implement `AssignmentLogger` trait and pass the logger when initializing the SDK.

```rust
let mut client = ClientConfig::from_api_key("<YOUR_API_KEY>")
    .assignment_logger(MyAssignmentLogger)
    .to_client();

client.start_poller_thread();
```

<Tabs>
<TabItem value="console" label="Console">

```rust
use eppo::AssignmentLogger;

struct LocalAssignmentLogger;

impl AssignmentLogger for LocalAssignmentLogger {
    fn log_assignment(&self, assignment: AssignmentEvent) {
        println!("{:?}", assignment);
    }
}
```

</TabItem>
</Tabs>

### Typed Assignment Calls

The SDK provides typed assignment functions for different types of values:

- `get_boolean_assignment`
- `get_integer_assignment`
- `get_numeric_assignment`
- `get_string_assignment`
- `get_json_assignment`

All of these functions have the same input parameters as mentioned in the "Assign variations" section.

Example usage for a boolean assignment:

```rust
if client.get_boolean_assignment("<FLAG_KEY>", "<SUBJECT_KEY>", SUBJECT_ATTRIBUTES).unwrap_or_default().unwrap_or(false) {
    // Handle true assignment
} else {
    // Handle false assignment
}
```
