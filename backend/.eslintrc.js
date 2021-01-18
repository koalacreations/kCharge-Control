module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  extends: [
    "airbnb-base",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-unused-vars": ["warn"],
    "import/extensions": ["warn", "never"],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "off",
    "comma-dangle": "off",
  },
};
