import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-topic-noindex",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.addTopicAdminMenuButton((topic) => {
        const canManageTopic = api.getCurrentUser()?.canManageTopic;

        if (canManageTopic && !topic.isPrivateMessage) {
          return {
            className: "toggle-noindex",
            icon: topic.noindex ? "far-eye" : "far-eye-slash",
            label: topic.noindex
              ? "topic.actions.noindex_stop"
              : "topic.actions.noindex",
            action: async () => {
              await ajax(`/t/${topic.id}/toggle-noindex`, { type: "PUT" });
              topic.reload();
            },
          };
        }
      });
    });
  },
};
