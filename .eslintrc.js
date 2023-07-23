module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['chakra-ui'],
  overrides: [
    {
      files: ['**/*.ts'],
      rules: { '@typescript-eslint/no-floating-promises': 'error' },
    },
  ],
}
