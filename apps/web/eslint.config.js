const baseConfig = require("@coffee-daily/config/eslint");
const nextPlugin = require("@next/eslint-plugin-next");

module.exports = [
  ...baseConfig,
  nextPlugin.configs["core-web-vitals"],
  {
    ignores: [".next/**"],
  },
];
