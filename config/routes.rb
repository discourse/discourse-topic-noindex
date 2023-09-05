# frozen_string_literal: true

DiscourseTopicNoindex::Engine.routes.draw {}

Discourse::Application.routes.draw do
  mount ::DiscourseTopicNoindex::Engine, at: "discourse-plugin-noindex"
end
