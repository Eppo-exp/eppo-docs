---
sidebar_position: 3
---

# Adding and Editing Metadata in Feature Flags

Metadata allows you to attach custom information to your feature flags, making it easier to organize, track, and manage them throughout their lifecycle. This guide explains how to add and edit metadata on individual feature flags and how metadata relates to experiments.

## Prerequisites

Before you can add metadata to a feature flag, your workspace administrator needs to [create metadata field definitions](/guides/metadata/managing-metadata-fields). These definitions determine what types of metadata can be added to feature flags.

## Accessing Feature Flag Metadata

To view or edit metadata for a feature flag:

1. Navigate to the feature flag details page
2. Look for the **Metadata** section in the info sidebar on the right side of the page

The metadata section displays all metadata currently attached to the feature flag, organized by field.

![Metadata Feature Flag Info](/img/metadata-fields/metadata-feature-flag-info.png)

## Adding Metadata to a Feature Flag

To add new metadata to a feature flag:

1. In the metadata section, click **Add new metadata**
2. Select the metadata field you want to add from the dropdown
3. Enter or select the value based on the field type:
   - **Freetext fields**: Type your text in the text area (up to 10,000 characters)
   - **Select fields (single-select)**: Select one option from the dropdown
   - **Select fields (multi-select)**: Select one or more options from the dropdown
4. The metadata will be saved automatically

:::note
The dropdown only shows metadata fields that haven't already been added to this feature flag. Once a field is added, it won't appear in the dropdown again until it's removed.
:::

<img src="/img/metadata-fields/metadata-feature-flag-sidebar.png" alt="Metadata Feature Flag Sidebar" width="600" />

## Editing Existing Metadata

To edit metadata that's already attached to a feature flag:

1. Find the metadata field you want to edit in the metadata section
2. Click on the value to start editing
3. Update the value:
   - **Freetext fields**: Modify the text
   - **Select fields**: Select a different option or additional options (for multi-select)
4. Click outside the field or press Enter to save your changes

Changes are saved automatically when you finish editing.

## Removing Metadata from a Feature Flag

To remove a metadata field from a feature flag:

1. Find the metadata field you want to remove
2. Click the delete icon (trash can) next to the field
3. Confirm the deletion if prompted

:::caution
Removing metadata deletes the value for this feature flag but does not delete the metadata field definition. You can add it back later if needed.
:::

<img src="/img/metadata-fields/metadata-ff-deletion.png" alt="Metadata Feature Flag Deletion" width="600" />

## Understanding Required Fields

Some metadata fields may be marked as required by your workspace administrator. Required fields:

- Must be filled out before you can create or save the feature flag
- Cannot be removed once added
- Will show a validation error if left empty

If you see a validation error about a required field, make sure to provide a value before attempting to save.

## Metadata Field Types

### Freetext Fields

Freetext fields allow you to enter any text up to 10,000 characters. Common uses include:

- Links to documentation, tickets, or design files
- Rollout plans or schedules
- Technical notes or implementation details
- Custom identifiers or reference codes

### Single-Select Fields

Single-select fields provide a dropdown of predefined options where you can select one value. Common uses include:

- Team or department ownership
- Product area or category
- Environment (if different from Eppo's environment feature)
- Status or lifecycle stage

### Multi-Select Fields

Multi-select fields let you select multiple values from a dropdown. Common uses include:

- Multiple teams involved
- Multiple product areas affected
- Tags or labels
- Related features or capabilities

## How Metadata Relates to Experiments

Metadata on feature flags has a special relationship with experiments. Understanding this connection is important for maintaining consistency and tracking context.

### Metadata Transfer to Experiments

When you create an experiment from a feature flag, the metadata attached to the feature flag is automatically transferred to the new experiment. This transfer behavior ensures that important context (like team ownership, product area, or related tickets) carries over from the feature flag to the experiment.

**What Gets Transferred:**
- All metadata fields that exist on the feature flag at the time of experiment creation
- The exact values for each field (both Freetext and Select)


### Independent Metadata Management

After metadata is transferred from a feature flag to an experiment:

- The experiment's metadata becomes independent of the feature flag
- Changes to the feature flag's metadata do not automatically update the experiment
- Changes to the experiment's metadata do not affect the feature flag
- Each can be edited or removed separately

This independence allows you to:
- Update experiment-specific metadata without affecting the flag
- Continue using the flag for other purposes with different metadata
- Maintain separate lifecycle tracking for flags and experiments

### Best Practices for Flag and Experiment Metadata

**Use Metadata on Flags for General Information**
Add metadata to feature flags that describes the feature itself, such as:
- Owning team
- Product area
- Related tickets or documentation
- General purpose or goal

This information is often relevant to any experiments created from the flag.

**Update Experiment Metadata for Experiment-Specific Details**
After creating an experiment from a flag, update the experiment's metadata with experiment-specific information:
- Specific success criteria
- Experiment-specific timelines or milestones
- Analysis plan links

**Keep Flag Metadata Current**
Since flag metadata may be transferred to new experiments, keeping it up-to-date ensures that new experiments start with accurate context.

**Use Consistent Fields**
Use the same metadata fields for both flags and experiments (like product area) to maintain consistency and enable cross-cutting reporting.

## Metadata and Feature Flag Lifecycle

Metadata is preserved throughout the feature flag lifecycle:

- **During creation**: Add metadata when setting up the flag
- **During rollout**: Update metadata as the flag progresses through environments or rollout stages
- **When creating experiments**: Metadata can transfer to experiments automatically
- **After full rollout**: Metadata remains for historical tracking
- **When deprecated**: Metadata is retained with deprecated flags

## Example: Feature Flag to Experiment Workflow

Here's a typical workflow showing how metadata flows from a feature flag to an experiment:

1. **Create a feature flag** for a new search algorithm
   - Add metadata: Team = "Search", Product Area = "Discovery", Ticket = "SRCH-123"

2. **Roll out the flag** to users
   - Metadata tracks ownership and context throughout rollout

3. **Create an experiment** from the flag to test effectiveness
   - Metadata automatically transfers: Team = "Search", Product Area = "Discovery", Ticket = "SRCH-123"
   - Add experiment-specific metadata: Hypothesis = "New algorithm will improve CTR by 5%"

4. **Run the experiment** while the flag continues serving users
   - Both flag and experiment maintain their own metadata
   - Updates to either don't affect the other

5. **Experiment completes** and flag continues or is deprecated
   - Both retain their metadata for historical reference and reporting

This workflow demonstrates how metadata provides continuity from feature flag to experiment while allowing independent management of each.

## Best Practices

### Add Metadata Early in the Flag Lifecycle
Add important metadata when creating the feature flag. This ensures consistent tracking from the start and makes metadata available for any experiments created from the flag.

### Review Transferred Metadata
When creating an experiment from a flag, review the transferred metadata and add any experiment-specific fields needed.

### Keep Freetext Concise
While freetext fields support up to 10,000 characters, shorter, more focused entries are often more useful. Consider using links to external documentation for detailed information.

### Use Consistent Naming
When using freetext fields that might be used for filtering or reporting (like team names), be consistent with formatting and naming across both flags and experiments.

### Update Metadata as Flags Evolve
If flag details change (like ownership or status), update the metadata accordingly. While this won't affect existing experiments, it will ensure future experiments start with accurate information.

### Coordinate with Your Team
Work with your team to establish conventions for which metadata should be added to flags versus experiments, ensuring everyone follows the same practices.
