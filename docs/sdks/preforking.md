# Using Eppo SDK with pre-forking servers

Pre-forking is a strategy used by some server runtimes, like uWSGI, Puma and Spring, to improve performance. In this model, the server creates a pool of worker processes by forking from a single main process. This approach avoids the overhead of repeatedly initializing the server and the framework. Instead, initialization is only done once and the process is "copied" to workers in ready state.

Pre-forking is particularly effective for web servers with long initialization times, as it speeds up the process of spawning new workers.

## Things to keep in mind

Pre-forking is great but it's a tricky/advanced optimization technique and it may cause problems if not used carefully. In particular, forking is incompatible with multi-threading because only the calling thread is copied over to the forked process and the rest of the threads just "disappear" from the process. This may cause some parts of the server not working or leave the system in inconsistent state and cause hangs or crashes.

During initialization, **Python** and **Ruby** Eppo SDKs create a native thread that is responsible for fetching and refreshing Eppo configuration. This is done to offload work from the main thread, so your code can run 100% of the time. Because of this, it is important that Python and Ruby SDKs are **not** initialized before pre-forking.

To avoid issues, defer the initialization of Eppo SDK until after the forking process is complete. Most pre-forking servers provide lifecycle hooks that allow you to execute custom logic after the fork. Use these hooks to initialize the SDK.

### uWSGI

In uWSGI, you can use the post-fork hook to ensure the library is initialized in each worker process:
```python
import eppo_client
from uwsgidecorators import postfork

@postfork
def initialize_eppo():
    eppo_client.init(eppo_client.ClientConfig(...))
```

### Spring
For Rails apps using [Spring](https://github.com/rails/spring), you can use the `after_fork` callback in `config/spring.rb`:

```ruby
Spring.after_fork do
  EppoClient::init(EppoClient::Config.new(...))
end
```

### Puma

For Ruby/Rails applications using [Puma](https://github.com/puma/puma), you can use the `on_worker_boot` callback in `config/puma.rb`:

```ruby
on_worker_boot do
  EppoClient::init(EppoClient::Config.new(...))
end
```

### Unicorn

For [Unicorn](https://github.com/defunkt/unicorn), provide an `after_fork` hook in your `unicorn.rb` config file:

```ruby
after_fork do |server, worker|
  EppoClient::init(EppoClient::Config.new(...))
end
```

### Phusion Passenger

If you use Phusion [Passenger](https://www.phusionpassenger.com/), initialize the client in `config.ru`, or from any code called while loading `config.ru`:

```ruby
if defined?(PhusionPassenger)
  PhusionPassenger.on_event(:starting_worker_process) do |forked|
    EppoClient::init(EppoClient::Config.new(...))
  end
end
```
