module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
    ".puppeteerrc.cjs",
  ],
  plugins: ["@typescript-eslint", "import", "jsdoc"],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "valid-jsdoc": "off",
    "require-jsdoc": "off",
    "jsdoc/require-jsdoc": "off",
    "no-tabs": "error",
    "max-len": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
