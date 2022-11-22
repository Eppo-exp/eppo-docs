# Prerequisites


To analyze experiments on Eppo you must first:

1. Set up a function to assign subjects to experiments in your application and log those assignments into your application's event stream.
2. Direct your application's event stream into your data warehouse, commonly achieved using a tool like Segment.


![Data inputs](../../../static/img/feature-flagging/data-inputs.png)

If your infastructure lines up with this diagram, you're ready to go! If you are new to experimentation or need help understanding best practices, read further into our guides on [experiment assignment](./experiment-assignment/) and [event logging](./event-logging/).

