import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    {
      name: "@storybook/addon-mcp",
      options: {
        toolsets: {
          dev: true,  // Tools for story URLs and UI building instructions
          docs: true, // Tools for component documentation
        },
        experimentalFormat: "markdown", // Output format: 'markdown' or 'xml'
      },
    },
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  features: {
    experimentalComponentsManifest: true, // Enable component manifest for docs toolset
  },
};

export default config;
