const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Use only setupFilesAfterEnv
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react|ldrs)/)", // Ensure these packages are transformed
  ],
  moduleNameMapper: {
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy", // Mock CSS modules
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock image files
  },
};

module.exports = createJestConfig(customJestConfig);
