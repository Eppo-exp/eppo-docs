# Feature Flag Approvals

Approvals add an extra layer of security to minimize the risk of production changes. When enabled, all Non-admins who make changes in production will have their changes reviewed and approved by Admins.

## Enabling Feature Flag Approvals
Feature Flag Approvals are off by default. To enable, an Admin role should go to the Admin page and select Workflow Settings.
[Admin page](/feature-flags/approvals/admin)

From there, Feature Flag Approvals can be enabled.
[Workflow settings page](/feature-flags/approvals/workflow-settings)

## When Approvlas Are Needed
Approvals are only needed for changes made by Non-admins that will result in a change to the production environment:
* If a production flag is OFF, any changes to allocations and rules DO NOT need approval.
* If a production flag is ON, any changes to allocations and rules WILL need approval.
* If a production flag is OFF, a change to turn it on WILL need approval.
* If a production flag is ON, a change to turn it off WILL need approval.

Admins do not need approvals for any changes made.
Attaching an experiment analysis to an Experiment Allocation never needs approval.

## Requester Workflow
When a Non-admin visits a Flag enabled in production, it will be in a read-only mode. They'll see a banner informing them that they don't have permission to edit the flag and will have to suggest changes. Clicking `Suggest Changes` will change the flag into an edit mode.
[Suggest changes banner](/feature-flags/approvals/suggest-changes)

The Requester can make any changes to allocations and rules at this point. When done making changes, they can click the `Submit for Review` to send an email to Admins to review the changes.
[Submit for review banner](/feature-flags/approvals/submit-for-review)

Additionally, if a production flag is disabled, a Requester can suggest enabling it and send that change to review.
[Suggest enabling flag](/feature-flags/approvals/enable-flag)

The Flag will revert to read-only mode and show the previous state without the suggested changes applied. Any users who visit the Flag will see a banner that changes are pending review.
[Review pending banner](/feature-flags/approvals/review-pending)

Users can view the pending changes by clicking the button on the banner, which will show the changes as a JSON diff. Only one change can be pending at a time. The change will have to be approved or declined before further changes can be made or suggested.
[Pending changes view](/feature-flags/approvals/pending-changes)

Once action is taken. the Requester will receieve an email with the decision made.
[Decision email to Requester](/feature-flags/approvals/approval-email)

## Reviewer Workflow
All Admins will get notified via email when a change is requested.
[Requester email to Admins](/feature-flags/approvals/request-email)

The Feature Flag page will also display the review status of flags. Flags that need review will be marked as such so Admins can review and take action.
[Needs review status](/feature-flags/approvals/needs-review)

On the Flag, Reviewers will see the current state and a banner announcing that there are changes to review. No further changes can be made to the Flag until the changes are reviewed. To take action, the Reviewer should click the `Review Changes` button.
[Requested review banned](/feature-flags/approvals/requested-review)

The Reviewer will see the changes as a JSON diff. They can choose to approve or reject changes. Once done, the Flag will be available for editing and suggesting.
[Review changes view](/feature-flags/approvals/review-changes)