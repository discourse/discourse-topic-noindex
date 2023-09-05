# frozen_string_literal: true

module DiscourseTopicNoindex
  class Engine < ::Rails::Engine
    engine_name "discourse-topic-noindex"
    isolate_namespace DiscourseTopicNoindex
    config.autoload_paths << File.join(config.root, "lib")
  end
end
