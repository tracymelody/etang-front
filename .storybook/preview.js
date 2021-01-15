import { configure, addDecorator, addParameters } from "@storybook/react";
import { withOptions } from "@storybook/addon-options";
import { withKnobs } from "@storybook/addon-knobs";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { withNextRouter } from "storybook-addon-next-router";

import { OutLineDecorator } from "./OutlineDecorator";

export const parameters = {
  name: "Saleor Storefront",
  url: "https://github.com/mirumee/saleor-storefront",
  goFullScreen: false,
  sidebarAnimations: true,
  controls: { expanded: true },
  viewport: { viewports: INITIAL_VIEWPORTS },
};

export const decorators = [OutLineDecorator, withNextRouter];
