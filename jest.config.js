module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    transform: {
        transform_regex: ['ts-jest', { /* ts-jest config goes here in Jest */ }],
    },
    testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    collectCoverage: true, // Enable test coverage
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    globals: {
        isolatedModules: true,
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
};
