const { resolve } = require('path');
module.exports = {
  root: true,
  parserOptions: {
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#eslint
    // Needed to make the parser take into account 'vue' files
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },

  env: {
    browser: true
  },

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:vue/strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)

    'airbnb-base',

    'prettier'
  ],

  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',
  ],

  globals: {
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true
  },

  // add your custom rules here
  rules: {
    'no-param-reassign': 'off',
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'prefer-promise-reject-errors': 'off',

    // TypeScript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // my rules
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-shadow': ["error", { "allow": ["Vue"] }],
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-unused-vars": ["warn"],
    "import/extensions": [
      "warn",
      "never",
      {
        "vue": "always"
      }
    ],
    radix: ["warn", "as-needed"],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-floating-promises": "off",

    "vue/html-indent": ["error", 2, {
      "attribute": 1,
      "closeBracket": 0,
      "ignores": []
    }]
  }
}
