import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";

// eslint-disable-next-line no-unused-vars
const PLUGIN_ID = "discourse-topic-noindex";

export default {
  name: "discourse-topic-noindex",

  initialize() {
    withPluginApi("0.8.31", initialize);
  },
};

function initialize(api) {
  api.addTopicAdminMenuButton((topic) => {
    const canManageTopic = api.getCurrentUser()?.canManageTopic;
    const noindex = topic.get("noindex");

    if (!topic.isPrivateMessage && canManageTopic) {
      return {
        icon: noindex ? "far-eye" : "far-eye-slash",
        label: noindex ? "topic.actions.noindex_stop" : "topic.actions.noindex",
        action: () => {
          ajax(`/t/${topic.id}/toggle-noindex`, {
            type: "PUT",
          }).then(() => {
            topic.reload();
          });
        },
      };
    }
  });
}
