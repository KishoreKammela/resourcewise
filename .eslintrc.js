module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  ignorePatterns: [
    '.next/**',
    'node_modules/**',
    'out/**',
    'public/**',
    '.husky/**',
    'components.json',
    'apphosting.yaml',
  ],
  rules: {
    // Add any custom rules here
  },
};
