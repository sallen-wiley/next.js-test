import FullPageLoader from "./FullPageLoader";

export default {
  title: "App/FullPageLoader",
  component: FullPageLoader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-page loading spinner that centers itself in the viewport. Used for authentication loading states and other app-level loading scenarios.",
      },
    },
  },
  argTypes: {
    message: {
      control: "text",
      description: "Optional message to display below the spinner",
    },
    showDebug: {
      control: "boolean",
      description:
        "Whether to show debug information (defaults to false in production)",
    },
  },
};

export const Default = {
  args: {
    message: "Loading...",
    showDebug: true,
  },
};

export const Authentication = {
  args: {
    message: "Authenticating...",
    showDebug: true,
  },
};

export const InitializingApp = {
  args: {
    message: "Initializing application...",
    showDebug: true,
  },
};

export const ProductionMode = {
  args: {
    message: "Loading application data...",
    showDebug: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Production mode with debug messages hidden",
      },
    },
  },
};

export const LongMessage = {
  args: {
    message:
      "Connecting to authentication service and verifying your credentials. This may take a moment...",
    showDebug: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Example with a longer debug message to show text wrapping",
      },
    },
  },
};
