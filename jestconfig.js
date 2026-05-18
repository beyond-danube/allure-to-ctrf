/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/test'],
    testMatch: [
        '**/test/**/*.ts',
        '**/?(*.)+(spec|test).ts',
    ],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: 'test/tsconfig.json' }],
    },
    reporters: [
        'default',
        ['jest-ctrf-json-reporter', {}],
],
};