module.exports = {
  root: true,
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 9,
  },
  env: {
    node: true,
  },
  rules: {
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-plusplus': 'off',
  },
};
