import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";
import { cloneJSON } from "discourse-common/lib/object";
import I18n from "discourse-i18n";
import topicFixtures from "../fixtures/topic-fixtures";

acceptance("Topic No-index", function (needs) {
  needs.user();
  needs.pretender((server, helper) => {
    server.get("/t/719.json", () => {
      return helper.response(cloneJSON(topicFixtures["/t/719.json"]));
    });
    server.get("/t/720.json", () => {
      const json = cloneJSON(topicFixtures["/t/719.json"]);
      json.noindex = true;
      return helper.response(json);
    });
  });

  test("'hide from search engines' button appears", async function (assert) {
    await visit("/t/-/719");
    assert.dom(".d-icon-wrench").exists("it shows the topic wrench button");
    await click(".topic-admin-menu-trigger");
    assert
      .dom(".topic-admin-menu-content .toggle-noindex")
      .hasText(I18n.t("js.topic.actions.noindex"));
  });

  test("'stop hiding from search engines' button appears", async function (assert) {
    await visit("/t/-/720");
    assert.dom(".d-icon-wrench").exists("it shows the topic wrench button");

    await click(".topic-admin-menu-trigger");
    assert
      .dom(".topic-admin-menu-content .toggle-noindex")
      .hasText(I18n.t("js.topic.actions.noindex_stop"));
  });
});
