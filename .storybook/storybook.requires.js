/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
} from "@storybook/react-native";

import { decorators, parameters } from "./preview";

if (decorators) {
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

const getStories = () => {
  return [
    require("./button-example/button-example.stories.tsx"),
    require("../src/components/feedback/alert-toast.stories.tsx"),
    require("../src/components/image-uploader/image-uploader.stories.tsx"),
    require("../src/screens/profile-screen/edit-profile-screen.stories.tsx"),
  ];
};

configure(getStories, module, false);
