import { withPluginApi } from "discourse/lib/plugin-api";

const PLUGIN_ID = "discourse-topic-noindex";


export default {
  name: "prevent-search-indexing",

  initialize() {
    withPluginApi("0.8.31", initialize);
  }
};

function initialize(api) {
  api.decorateWidget("topic-admin-menu:adminMenuButtons", (helper) => {
    const topic = helper.attrs.topic;
    const { canManageTopic } = helper.widget.currentUser || {};
    if (!topic.isPrivateMessage && canManageTopic) {
      return {
        buttonClass: "btn-default",
        action: "toggleNoIndex",
        icon: "shield-alt",
        label: "actions.noindex",
      };
    }
  });

    api.attachWidgetAction("topic-admin-menu:adminMenuButtons", "toggleNoIndex", ()=>{
      console.log("toggle no index")
    });

}


