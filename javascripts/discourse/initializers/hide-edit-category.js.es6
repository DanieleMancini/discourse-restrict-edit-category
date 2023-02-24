import { withPluginApi } from "discourse/lib/plugin-api";
import { authorizesOneOrMoreExtensions } from "discourse/lib/uploads";
import discourseComputed from "discourse-common/utils/decorators";

export default {
  name: "restrict-edit-category",
  initialize() {
    withPluginApi("0.8", (api) => {
      let currentUser = api.getCurrentUser();
      let canModifyTopicCategory;

      if (currentUser) {
        canModifyTopicCategory =
          currentUser.trust_level >= settings.restrict_to_trust_level ||
          currentUser.staff;
      }

      if (!canModifyTopicCategory) {
        // Prevent editing from Topic Title Edit
        api.modifyClass("controller:topic", {
          pluginId: "RestrictCategoryChangeTopic",
          showCategoryChooser: false,
          didInsertElement: function () {
            let miniTagChoser = document.getElementsByClassName("mini-tag-chooser")[0];
            miniTagChoser.style.marginLeft = "0";
          },
        });
        // Prevent editing category from Edit First Post (courtesy of @Canapin)
        api.modifyClass("component:composer-title", {
          pluginId: "PreventCategoryChangeComposerFirst",
          showCategoryChooser: false,
          didInsertElement: function () {
            // let categoryInput = document.getElementsByClassName("category-input")[0];
            // if (categoryInput != null) {
            //     categoryInput.remove();  
            // }
            let miniTagChoser = document.getElementsByClassName("mini-tag-chooser")[0];
            if (miniTagChoser != null) {
              miniTagChoser.style.marginLeft = "0";
            }
          },
        });
      }
    });
  },
};