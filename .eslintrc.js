module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    es6: true,
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
