module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { project: null },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {}
    }
  },
  plugins: [
    '@typescript-eslint',
    'jsx-a11y',
    'import'
  ],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always'
      }
    ]
  },
  overrides: [
    {
      files: ['*.config.*', 'scripts/**'],
      rules: {
        'import/no-extraneous-dependencies': 'off'
      }
    },
    {
      files: ['src/app/api/**/*.ts'],
      env: { node: true },
      rules: { 'react-hooks/rules-of-hooks': 'off' }
    }
  ]
};