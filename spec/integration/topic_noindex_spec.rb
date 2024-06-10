# frozen_string_literal: true

require "rails_helper"

# tests:
# 1. with regular user, validate that toggle_no_index returns error
# 2. with admin user, request /t/-/<topic-id>, validate that noindex is false
# ( call PUT toggle_no_index/<topic-id> )
# 3. validate that topic's noindex is true now
# 4. validate that getting a topic with their slug returns noindex header

describe "discourse-topic-noindex plugin" do
  fab!(:topic)
  fab!(:user)
  fab!(:admin)

  describe "with regular user" do
    before do
      SiteSetting.discourse_topic_noindex_enabled = true
      sign_in(user)
    end

    it "should fail to call /toggle-noindex" do
      put "/t/#{topic.id}/toggle-noindex.json"
      expect(response.status).to eq(403)
    end

    it "should set http header 'X-Robots-Tag: noindex'" do
      get "/t/#{topic.slug}/#{topic.id}"
      expect(response.headers["X-Robots-Tag"]).to be_nil

      topic.custom_fields["noindex"] = true
      topic.save!
      get "/t/#{topic.slug}/#{topic.id}"
      expect(response.headers["X-Robots-Tag"]).to eq("noindex")
    end
  end

  describe "with admin user" do
    before do
      SiteSetting.discourse_topic_noindex_enabled = true
      sign_in(admin)
    end

    it "should toggle topic noindex" do
      get "/t/#{topic.slug}/#{topic.id}.json"
      expect(response.parsed_body["noindex"]).to be_nil

      put "/t/#{topic.id}/toggle-noindex.json"
      topic.reload
      expect(topic.noindex).to eq(true)
    end

    it "should get a topic by their slug and return noindex header" do
      get "/t/#{topic.slug}"
      expect(response.headers["X-Robots-Tag"]).to be_nil

      put "/t/#{topic.id}/toggle-noindex.json"

      get "/t/#{topic.slug}"
      expect(response.headers["X-Robots-Tag"]).to eq("noindex")
    end
  end
end
