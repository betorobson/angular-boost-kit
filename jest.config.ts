import type { Config } from 'jest';

const jestConfig: Config = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
	modulePaths: ['<rootDir>/'],
	// globalSetup: 'jest-preset-angular/global-setup',
	moduleNameMapper: {
		'^flat': 'node_modules/flat/index.js'
	},
  modulePathIgnorePatterns: [
    "/dist/"
  ]
};

export default jestConfig;
