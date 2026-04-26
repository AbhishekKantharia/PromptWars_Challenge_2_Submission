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
    // Map firebase-config.js from ANY relative path to the mock
    'firebase-config\\.js$': '<rootDir>/tests/__mocks__/firebase-config.js',
    // Map election-data.json from any depth
    'election-data\\.json$': '<rootDir>/tests/__mocks__/election-data.json',
    // Map generative-ai
    '^@google/generative-ai$': '<rootDir>/tests/__mocks__/generative-ai.js',
    // Map gemini.js from any relative path
    'gemini\\.js$': '<rootDir>/tests/__mocks__/gemini.js'
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  collectCoverageFrom: [
    'src/js/**/*.js',
    '!src/js/firebase-config.js',
    '!src/js/pwa.js'
  ],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50
    }
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  setupFiles: ['<rootDir>/tests/setup.js']
};
