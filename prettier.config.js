export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.jsonc',
      options: {
        trailingComma: 'none',
      },
    },
  ],
}
