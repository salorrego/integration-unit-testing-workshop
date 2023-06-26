module.exports = {
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '<rootDir>/coverage',
  testTimeout: 10000,
  testMatch: [
    '**/*.test.ts',
    '!**/stryker-tmp/**',
    '!**/test-helpers.js**',
    '!**/*global-setup*',
  ],
  globalSetup: '<rootDir>/test/support/global-setup.ts',
  globalTeardown: '<rootDir>/test/support/global-teardown.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false,
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/html-report',
        filename: 'report.html',
        expand: true,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: 'test_reports/jest',
        outputName: 'results.xml',
      },
    ],
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/main.ts',
    '!**/node_modules/**',
    '!**/src/libraries/**',
    '!**/test/**',
    '!**/*test*.ts',
    '!**/*entity*.ts',
    '!**/migration/*.ts',
  ],
  forceExit: true,
  notify: true,
  notifyMode: 'change',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-master',
    [
      'jest-watch-toggle-config',
      {
        setting: 'verbose',
      },
    ],
    [
      'jest-watch-toggle-config',
      {
        setting: 'collectCoverage',
      },
    ],
  ],
};
