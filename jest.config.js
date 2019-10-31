module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [1219]
      }
    }
  }
};