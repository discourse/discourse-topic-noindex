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
  if (api.addTopicAdminMenuButton) {
    api.addTopicAdminMenuButton((topic) => {
      const canManageTopic = api.getCurrentUser()?.canManageTopic;
      const noindex = topic.get("noindex");

      if (!topic.isPrivateMessage && canManageTopic) {
        return {
          icon: noindex ? "far-eye" : "far-eye-slash",
          label: noindex
            ? "topic.actions.noindex_stop"
            : "topic.actions.noindex",
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
  } else {
    let helper = null;

    api.attachWidgetAction(
      "topic-admin-menu:adminMenuButtons",
      "toggleNoIndex",
      () => {
        const topic = helper?.attrs?.topic;
        if (!topic) {
          return;
        }
        ajax(`/t/${topic.id}/toggle-noindex`, {
          type: "PUT",
        }).then(() => {
          topic.reload();
        });
      }
    );

    api.decorateWidget("topic-admin-menu:adminMenuButtons", (_helper) => {
      helper = _helper;
      const noindex = helper?.attrs?.topic?.noindex;
      if (
        !helper?.attrs?.topic?.isPrivateMessage &&
        helper?.widget?.currentUser?.canManageTopic
      ) {
        return {
          buttonClass: "popup-menu-button",
          action: "toggleNoIndex",
          icon: noindex ? "far-eye" : "far-eye-slash",
          label: noindex ? "actions.noindex_stop" : "actions.noindex",
          topicId: helper?.attrs?.topic?.id,
        };
      }
    });
  }
}
