# frozen_string_literal: true

DiscourseTopicNoindex::Engine.routes.draw do

end

Discourse::Application.routes.draw { mount ::DiscourseTopicNoindex::Engine, at: "discourse-plugin-noindex" }
