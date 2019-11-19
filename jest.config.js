module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)test)\\.ts$',
  collectCoverageFrom: [
    'src/**',
    '!src/**/*.d.ts'
  ]
}
