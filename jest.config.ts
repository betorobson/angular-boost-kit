import type { Config } from 'jest';

const jestConfig: Config = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
	modulePaths: ['<rootDir>/'],
	// globalSetup: 'jest-preset-angular/global-setup',
	moduleNameMapper: {
		'^angular-boost-kit$': '<rootDir>/projects/angular-boost-kit/src/public-api.ts',
		'^flat$': '<rootDir>/node_modules/flat/index.js'
	},
	modulePathIgnorePatterns: ['<rootDir>/dist/']
};

export default jestConfig;
