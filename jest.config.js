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
    '\\.(json)$': '<rootDir>/tests/__mocks__/jsonMock.js',
    '^./firebase-config.js$': '<rootDir>/tests/__mocks__/firebase-config.js',
    '^\\.\\./firebase-config\\.js$': '<rootDir>/tests/__mocks__/firebase-config.js',
    '^\\.\\.\\./firebase-config\\.js$': '<rootDir>/tests/__mocks__/firebase-config.js',
    '\\./election-data\\.json$': '<rootDir>/tests/__mocks__/election-data.json',
    '\\.\\./election-data\\.json$': '<rootDir>/tests/__mocks__/election-data.json',
    '\\.\\.\\./election-data\\.json$': '<rootDir>/tests/__mocks__/election-data.json',
    '^@google/generative-ai$': '<rootDir>/tests/__mocks__/generative-ai.js',
    '^\\.\\./gemini\\.js$': '<rootDir>/tests/__mocks__/gemini.js',
    '^\\.\\.\\./gemini\\.js$': '<rootDir>/tests/__mocks__/gemini.js'
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
