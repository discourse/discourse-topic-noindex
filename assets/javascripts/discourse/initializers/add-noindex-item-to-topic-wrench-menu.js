import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";

// eslint-disable-next-line no-unused-vars
const PLUGIN_ID = "discourse-topic-noindex";

export default {
  name: "discourse-topic-noindex",

  initialize() {
    withPluginApi("0.8.31", initialize);
  },
};

function initialize(api) {
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
        buttonClass: "btn-default",
        action: "toggleNoIndex",
        icon: noindex ? "far-eye" : "far-eye-slash",
        label: noindex ? "actions.noindex_stop" : "actions.noindex",
        topicId: helper?.attrs?.topic?.id,
      };
    }
  });
}
