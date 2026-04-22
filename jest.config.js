/**
 * Jest configuration for Election Education Assistant.
 * Supports ES modules and jsdom environment for DOM testing.
 */
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.json' }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase|@google/generative-ai|dompurify)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(json)$': '<rootDir>/tests/__mocks__/jsonMock.js'
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'src/js/**/*.js',
    '!src/js/firebase-config.js'
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  setupFiles: ['<rootDir>/tests/setup.js']
};
