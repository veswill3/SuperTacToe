module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules": {
    "no-console": "off",
    "no-alert": "off",
    "no-underscore-dangle": [2, { "allow": ["_id"] }],
    "no-param-reassign": ["error", { "props": false }]
  },
  "env": {
    "browser": true,
    "node": true,
  },
};
