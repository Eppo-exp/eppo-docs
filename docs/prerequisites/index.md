# Prerequisites


To analyze experiments on Eppo you must first:

1. Randomize subjects in your appplication and log assignment data into your application's event stream.
2.  Direct your application's event stream into your data warehouse, commonly achieved using a tool like Segment.


![Data inputs](../../static/img/feature-flagging/data-inputs.png)

If your infastructure lines up with this diagram, you're ready to go! If you need help setting up this digram or understanding best practices, read further into our guides on [feature flagging](./feature-flagging) and [event logging](./event-logging).

