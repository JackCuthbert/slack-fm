module.exports = {
  extends: [
    'standard-with-typescript',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
