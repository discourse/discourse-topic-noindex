# **Discourse Topic Noindex** Plugin

**Allow admins and moderators to request that a given topic be removed from search engines.**



This plugin adds a menu item "Remove from search engines" to the gear icon menu on the topic page. Selecting this results in an `x-robots-tag:noindex` header being added to the topic page response sent to search engines. This is a standard header observed by many search engines to manage page removals.

For more information, please see : https://meta.discourse.org/t/seo-improvement-possibility-to-hide-or-not-articles/267797/1
