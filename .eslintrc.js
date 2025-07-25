module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['unused-imports'],
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
    // Critical errors - things that break functionality
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],

    // Warnings - good practices but not critical
    'no-console': 'warn',
    'no-nested-ternary': 'warn',
    'prefer-template': 'warn',
    'object-shorthand': 'warn',
    'unused-imports/no-unused-imports': 'warn',
  },
};
