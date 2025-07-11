export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Ignore CSS or SCSS files
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    // Mock static file imports (e.g., images)
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest",  // Transpile JSX/ESM with Babel
  },
  extensionsToTreatAsEsm: [".jsx"],
  moduleFileExtensions: ["js", "jsx"],
};
