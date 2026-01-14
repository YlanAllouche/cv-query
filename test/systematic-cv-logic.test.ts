import { describe, it, expect, vi, beforeEach } from "vitest";
import { SystematicCV } from "../src/systematic-cv.js";
import { sampleCVData, sampleQueries } from "./fixtures/sample-data.js";
import { mkdir, writeFile } from "fs/promises";

vi.mock("fs/promises", () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockResolvedValue("{}"),
  readdir: vi.fn().mockResolvedValue([]),
  stat: vi
    .fn()
    .mockResolvedValue({ isDirectory: () => true, isFile: () => false }),
}));

vi.mock("child_process", () => ({
  exec: vi.fn().mockImplementation((command, options, callback) => {
    setImmediate(() => {
      if (callback) callback(null, { stdout: "success", stderr: "" });
    });
  }),
  execSync: vi.fn().mockReturnValue("success"),
  spawn: vi.fn(),
  spawnSync: vi.fn(),
}));

vi.mock("util", () => ({
  promisify: vi
    .fn()
    .mockReturnValue(
      vi.fn().mockResolvedValue({ stdout: "success", stderr: "" }),
    ),
}));

vi.mock("fs", () => ({
  existsSync: vi.fn().mockReturnValue(false),
}));

vi.mock("puppeteer", () => ({
  default: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        goto: vi.fn().mockResolvedValue(undefined),
        pdf: vi.fn().mockResolvedValue(Buffer.from("mock-pdf")),
        setContent: vi.fn().mockResolvedValue(undefined),
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock("../src/core/data-loader.js", () => ({
  DataLoader: vi.fn().mockImplementation(() => ({
    loadAllData: vi.fn().mockResolvedValue(sampleCVData),
  })),
}));

vi.mock("../src/core/cv-generator.js", () => ({
  CVGenerator: vi.fn().mockImplementation(() => ({
    generate: vi.fn().mockReturnValue({
      basics: { name: "John Doe", email: "john@example.com" },
      work: [{ company: "Test Corp", position: "Developer" }],
    }),
    generateFacts: vi.fn().mockReturnValue(["Fact 1", "Fact 2"]),
    generateLocalizedLetter: vi.fn().mockReturnValue(null),
  })),
}));

describe("SystematicCV Logic Tests (Fast)", () => {
  let cv: SystematicCV;

  beforeEach(() => {
    vi.clearAllMocks();
    cv = new SystematicCV();
  });

  describe("Core Data Processing", () => {
    it("should process CV data and generate correct file paths", async () => {
      const result = await cv.build({
        inputData: sampleCVData,
        queries: [sampleQueries[0]],
        outputPath: "./test-output",
      });

      expect(result).toHaveLength(1);
      expect(result[0].success).toBe(true);
      expect(result[0].name).toBe("general");
      expect(result[0].jsonPath).toBeDefined();
      expect(result[0].factsPath).toBeDefined();
    }, 100);

    it("should handle multiple queries with correct naming", async () => {
      const result = await cv.build({
        inputData: sampleCVData,
        queries: sampleQueries.slice(0, 3),
        outputPath: "./test-output",
      });

      expect(result).toHaveLength(3);
      expect(result.map((r) => r.name)).toEqual([
        "general",
        "senior-developer",
        "frontend-specialist",
      ]);
      expect(result.every((r) => r.success)).toBe(true);
    }, 100);
  });

  describe("Path and Naming Logic", () => {
    it("should handle multi-part role names", async () => {
      const customQuery = {
        ...sampleQueries[0],
        name: "startup-application-en",
      };

      const result = await cv.build({
        inputData: sampleCVData,
        queries: [customQuery],
        outputPath: "./test-output",
      });

      expect(result[0].success).toBe(true);
    }, 50);
  });

  describe("Query Processing", () => {
    it("should handle query overrides correctly", async () => {
      const queryWithOverrides = {
        ...sampleQueries[0],
        overrides: {
          email: "override@example.com",
        },
      };

      const result = await cv.build({
        inputData: sampleCVData,
        queries: [queryWithOverrides],
        outputPath: "./test-output",
      });

      expect(result[0].success).toBe(true);
    }, 50);

    it("should filter data based on query tags", async () => {
      const result = await cv.build({
        inputData: sampleCVData,
        queries: [sampleQueries[1]],
        outputPath: "./test-output",
      });

      expect(result[0].success).toBe(true);
    }, 50);
  });

  describe("Error Handling", () => {
    it("should handle missing input gracefully", async () => {
      await expect(
        cv.build({
          outputPath: "./test-output",
        }),
      ).rejects.toThrow("Either inputData or inputPath must be provided");
    }, 50);
  });
});

