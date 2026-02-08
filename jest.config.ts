import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    // ts-jestの設定も型安全に記述できます
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./output/html-report",
        filename: "index.html",
        expand: true,
      },
    ],
  ],
};

export default config;
