module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['chakra-ui', '@typescript-eslint'],
  overrides: [
    {
      files: ['**/*.ts'],
      rules: { '@typescript-eslint/no-floating-promises': 'error' },
    },
  ],
}
