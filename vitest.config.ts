import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    target: "node18",
  },
  test: {
    globals: true,
    environment: "node",

    reporters: process.env.CI ? ["junit", "default"] : ["default"],
    outputFile: {
      junit: "./test-results.xml",
    },

    include: ["test/**/*.test.ts"],

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "cobertura"],
      exclude: ["test/**", "dist/**", "**/*.d.ts"],
    },
  },
});

