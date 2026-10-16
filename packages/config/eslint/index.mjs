/**
 * Shared ESLint configuration for Civet monorepo
 */

// Base configuration for all packages
export const base = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
    '**/.turbo/**',
  ],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    // Possible Errors
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // Best Practices
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-return-await': 'error',
    'prefer-promise-reject-errors': 'error',

    // ES6+
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
  },
};

// TypeScript-specific configuration
export const typescript = {
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true,
    },
  },
  plugins: {
    '@typescript-eslint': '@typescript-eslint/eslint-plugin',
  },
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
  },
};

// React-specific configuration
export const react = {
  files: ['**/*.tsx', '**/*.jsx'],
  plugins: {
    'react': 'eslint-plugin-react',
    'react-hooks': 'eslint-plugin-react-hooks',
  },
  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript
    'react/jsx-no-target-blank': 'error',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};

// Next.js-specific configuration
export const nextjs = {
  files: ['apps/**/*.ts', 'apps/**/*.tsx'],
  plugins: {
    '@next/next': '@next/eslint-plugin-next',
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
  },
};

// Export combined configurations
export default [base, typescript, react, nextjs];
