# Source diagnostics

Eppo runs simple checks of your definitions to ensure they are running correctly and efficiently. 

Checks are run based on when a definition is created or updated and when an experiment updates. If an experiment update fails, associated definitions will have their sources checked and marked with errors if appropriate.

Coupled with Slack notifications, source diagnostics alert you to upstream issues with your definitions so you can resolve before it impacts the delivery of experiment results while giving you specific information on how you can fix the error.

## Definition status
On the definitions page for facts, entity properties, assignments, and entry points there is a column that displays the status of the diagnostic check. This status can have these states:

1. Running - the check is running
2. Passed - the check has been run and there are no errors
3. Warning - the check has run but it took longer than five minutes. This is an indication that the underlying query could potentially be rewritten to be more efficient and speed up experiment updates.
4. Error - the check indicates a problem with the SQL that needs to be resolved

![Status shown on the definitions page](/img/data-management/definition-status.png)

## Definition errors
Definition errors can be seen in a number of places.

On a definition page, click on the definition name to open a side-panel with details on the error.

![Error on a definition](/img/data-management/definition-error.png)

The side panel will also show details on warnings for long running SQL as well.

![Warning on a definition](/img/data-management/definition-warning.png)

If an experiment has a computation failure, the experiment diagnostic will also communicate if there is an error with a definition. Navigate to the diganostics tab in an Experiment Analysis and click on the "Fix error" button. This will open a side-panel with details on the error and a link to the specific definition SQL to update.

![Experiment diagnostic compute error details](/img/data-management/compute-error-diagnostic.png)