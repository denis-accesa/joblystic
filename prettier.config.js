/** @type {import("prettier").Config} */
const config = {
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.cjs',
      options: { parser: 'babel' },
    },
    {
      files: '*.svg',
      options: {
        parser: 'html',
      },
    },
  ],
};

export default config;
