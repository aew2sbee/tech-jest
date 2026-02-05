import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
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
