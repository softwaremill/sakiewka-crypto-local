module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/src/**/*.test.(ts|js)"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  preset: "ts-jest"
};
