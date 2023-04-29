const organizeImports = require('prettier-plugin-organize-imports')

module.exports = {
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  plugins: [organizeImports],
};
