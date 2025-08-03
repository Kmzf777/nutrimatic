/** @type {import('next').NextConfig} */
const eslintConfig = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Desabilitar regras problemáticas temporariamente
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  ignorePatterns: [
    'node_modules/**',
    '.next/**',
    'out/**'
  ]
};

export default eslintConfig;
