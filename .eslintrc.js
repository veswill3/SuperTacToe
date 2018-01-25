module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules": {
    "no-console": "off",
    "no-alert": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "prefer-promise-reject-errors": [0],
    "no-param-reassign": ["error", { "props": false }],
    "react/no-array-index-key": "off",
    "jsx-a11y/click-events-have-key-events": "off",
  },
  "env": {
    "browser": true,
    "node": true,
  },
};
