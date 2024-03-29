module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@tw-application/eslint-config-custom`
  extends: [
    "@tw-application/eslint-config-custom"
  ],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
  rules: {
    "jsx-a11y/alt-text": "off",
  }
};
