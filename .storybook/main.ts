import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx", // Add MDX support for docs
    "../src/components/mui/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/product/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    { name: "@storybook/addon-docs", options: {} }, // Use object syntax
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["..\\public"],
};
export default config;
