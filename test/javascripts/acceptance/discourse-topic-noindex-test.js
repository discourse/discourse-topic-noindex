import {
  acceptance,
  exists,
  query,
} from "discourse/tests/helpers/qunit-helpers";
import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { cloneJSON } from "discourse-common/lib/object";
import topicFixtures from "../fixtures/topic-fixtures";
import I18n from "I18n";

acceptance("Topic No-index", function (needs) {
  needs.user();
  needs.pretender((server, helper) => {
    server.get("/t/719.json", () => {
      return helper.response(cloneJSON(topicFixtures["/t/719.json"]));
    });
    server.get("/t/719-noindex.json", () => {
      const json = cloneJSON(topicFixtures["/t/719.json"]);
      json.noindex = true;
      return helper.response(json);
    });
  });

  test("'hide from search engines' button appears", async function (assert) {
    await visit("/t/-/719");
    assert.ok(exists(".d-icon-wrench"), "it shows the topic wrench button");
    await click(".topic-admin-menu-button button");
    assert.strictEqual(
      query("ul .topic-admin-menu-undefined li:nth-child(2)").innerText.trim(),
      I18n.t("js.topic.actions.noindex")
    );
  });

  test("'stop hiding from search engines' button appears", async function (assert) {
    await visit("/t/-/719-noindex");
    assert.ok(exists(".d-icon-wrench"), "it shows the topic wrench button");
    await click(".topic-admin-menu-button button");
    assert.strictEqual(
      query("ul .topic-admin-menu-undefined li:nth-child(2)").innerText.trim(),
      I18n.t("js.topic.actions.noindex_stop")
    );
  });
});
