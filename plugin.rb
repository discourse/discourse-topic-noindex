# frozen_string_literal: true

# name: discourse-topic-noindex
# about: TODO
# version: 0.0.1
# authors: chrism
# url: TODO
# required_version: 2.7.0

enabled_site_setting :plugin_name_enabled

module ::MyPluginModule
  PLUGIN_NAME = "discourse-topic-noindex"
end

require_relative "lib/my_plugin_module/engine"

after_initialize do
  reloadable_patch do
    module ::TopicControllerNoIndexExtension

      Discourse::Application.routes.prepend do
        put "t/:topic_id/toggle-noindex" => "topics#toggle_noindex",
          :constraints => {
            topic_id: /\d+/,
          }
      end

      def toggle_noindex
        topic_id = params.require(:topic_id).to_i

        #guardian.ensure_can_change_topic_noindex!
        begin
          topic = Topic.find(topic_id)
          current = topic.custom_fields["noindex"]
          newval = nil
          if current.nil? or current=='f'
            newval = "t"
          else
            newval = "f"
          end
          topic.custom_fields["noindex"]=newval
          topic.save!

          render json: success_json
        rescue ActiveRecord::RecordInvalid
          render json: failed_json, status: 422
        end
      end

      def show
        super
        response.headers["X-Robots-Tag"] = "noindex" if @topic_view.topic.noindex
      end
    end

    ::TopicsController.prepend ::TopicControllerNoIndexExtension

    require_dependency 'topic'
    class ::Topic
      def noindex
        custom_fields["noindex"]=="t"
      end
    end

    add_to_serializer(:topic_view, :noindex) do
      object.topic.noindex
    end

    require_dependency 'topic_guardian'
    module ::TopicGuardian
      def can_change_topic_noindex?
        is_staff?
      end
    end
  end
end


