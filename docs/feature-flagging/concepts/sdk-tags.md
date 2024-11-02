# SDK tags

Tags allow you to organize your flags in the Eppo UI, but SDK tags include an additional benefit.

Eppo creates a configuration file for the client, but when your program is using hundreds of flags across multiple applications, there may be a concern that you're unnecessarily increasing the size of the configuration file. SDK tags allow you to indicate which flags you'd like to include in the configuration file, reducing each the configuration file size.

## Creating and managing tags

Tags can be created and managed in the Admin section. Each tag has a name and a description. 
![Tag list in admin](/img/feature-flagging/tags/tag-list.png)

Clicking edit allows you to see all SDK keys and flags using the tag and allows you to remove them.

![Tag details](/img/feature-flagging/tags/tag-details.png)

## Tagging SDK keys

When you create or edit an SDK key, you can optionally choose tags to associate with that key. When tags are selected, only flags that have those same tags are included in the configuration file fetched by the application using that SDK key.

![Adding a tag to an SDK key](/img/feature-flagging/tags/sdk-key-tags.png)

If no tags are selected, all flags will be included in the configuration file.

## Tagging flags

When you create or edit a flag, you can optionally choose tags to associate with the flag.

![Adding a tag to a flag](/img/feature-flagging/tags/flag-tags.png)

Once a flag is tagged, the tags will display on the Flag list.

![Flag list page with tags showing](/img/feature-flagging/tags/flag-list-tags.png)

In this case, tags can be useful to organize your list of flags. Use the filter button and select the appropriate tags to only see flags with those included tags in the list.

![Flag list page tags filter](/img/feature-flagging/tags/flag-list-tag-filter.png)
