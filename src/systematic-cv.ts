#!/usr/bin/env node

import { mkdir, writeFile, readFile } from "fs/promises";
import { join, resolve } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import { Command } from "commander";
import { DataLoader } from "./core/data-loader.js";
import { CVGenerator } from "./core/cv-generator.js";
import { createWatcher } from "./watch.js";
import type { CVData, CVQuery } from "./types/index.js";

const execAsync = promisify(exec);

interface SystematicCVOptions {
  inputPath?: string;
  inputData?: CVData;
  outputPath: string;
  queriesPath?: string;
  queries?: CVQuery[];
  theme?: string;
}

interface BuildResult {
  name: string;
  success: boolean;
  jsonPath?: string;
  factsPath?: string;
  letterPath?: string;
  letterPdfPath?: string;
  htmlPath?: string;
  pdfPath?: string;
  error?: string;
}

export class SystematicCV {
  private theme: string;

  constructor(theme: string = "awesomish") {
    this.theme = theme;
  }

  private localizeString(value: any, language: string): string | undefined {
    if (!value) return undefined;

    if (typeof value === "string") {
      return value;
    }

    return value[language] || value["en"] || Object.values(value)[0];
  }

  private async generatePdfFromHtml(
    htmlPath: string,
    pdfPath: string,
  ): Promise<void> {
    try {
      const puppeteer = await import("puppeteer");
      const browser = await puppeteer.default.launch({
        executablePath:
          process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "1cm",
          right: "1cm",
          bottom: "1cm",
          left: "1cm",
        },
      });

      await browser.close();
    } catch (error) {
      throw new Error(
        `PDF generation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private extractPersonName(data: CVData, query: CVQuery): string {
    let name: string | undefined;

    if (query.overrides?.name) {
      name =
        typeof query.overrides.name === "string"
          ? query.overrides.name
          : query.overrides.name.en || Object.values(query.overrides.name)[0];
    }

    if (!name && data.basics?.name) {
      name = this.localizeString(data.basics.name, query.language);
    }

    if (!name) {
      throw new Error(
        "Could not extract person name from CV data or query overrides",
      );
    }

    return name.toLowerCase().replace(/\s+/g, "-");
  }

  async build(options: SystematicCVOptions): Promise<BuildResult[]> {
    const { outputPath, theme = this.theme } = options;

    await this.ensureDirectory(outputPath);

    const data = await this.loadData(options);

    const queries = await this.loadQueries(options);

    if (queries.length === 0) {
      console.warn("⚠️ No queries found - nothing to build");
      return [];
    }

    const generator = new CVGenerator();

    console.log(`🚀 Building ${queries.length} CV variants...`);

    const results: BuildResult[] = [];
    for (const query of queries) {
      const result = await this.buildSingleCV(
        generator,
        data,
        query,
        outputPath,
        theme,
      );
      results.push(result);
    }

    await this.generateIndex(results, outputPath);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(
      `\n📊 Build completed: ${successful.length} successful, ${failed.length} failed`,
    );
    if (failed.length > 0) {
      failed.forEach((result) =>
        console.log(`❌ ${result.name}: ${result.error}`),
      );
    }

    return results;
  }

  async dev(options: SystematicCVOptions): Promise<void> {
    console.log("🔧 Starting dev mode...");

    await this.build(options);

    const watchPaths = ["./src"];

    if (options.inputPath) {
      watchPaths.push(options.inputPath);
    } else {
      watchPaths.push("./data");
    }

    if (options.queriesPath) {
      watchPaths.push(options.queriesPath);
    } else {
      watchPaths.push(
        "./cv-definitions.ts",
        "./cv-definitions.js",
        "./queries.json",
      );
    }

    createWatcher({
      command: `systematic-cv build --output ${options.outputPath} ${options.inputPath ? `--input ${options.inputPath}` : ""} ${options.queriesPath ? `--queries ${options.queriesPath}` : ""}`,
      description: "Rebuilding CVs",
      watchPaths,
    });

    console.log("👀 Watching for changes...");
    return new Promise(() => {});
  }

  private async loadData(options: SystematicCVOptions): Promise<CVData> {
    if (options.inputData) {
      return options.inputData;
    }

    if (options.inputPath) {
      const loader = new DataLoader(options.inputPath);
      return await loader.loadAllData();
    }

    throw new Error("Either inputData or inputPath must be provided");
  }

  private async loadQueries(options: SystematicCVOptions): Promise<CVQuery[]> {
    let rawQueries: CVQuery[] = [];

    if (options.queries) {
      rawQueries = options.queries;
    } else if (options.queriesPath) {
      if (options.queriesPath.endsWith(".json")) {
        const content = await readFile(options.queriesPath, "utf-8");
        rawQueries = JSON.parse(content);
      } else {
        const module = await import(resolve(options.queriesPath));
        rawQueries = module.cvQueries || module.queries || module.default;
      }
    } else {
      const defaultPaths = [
        "./queries.json",
        "./cv-definitions.ts",
        "./cv-definitions.js",
      ];
      for (const path of defaultPaths) {
        if (existsSync(path)) {
          console.log(`📋 Using default queries file: ${path}`);
          if (path.endsWith(".json")) {
            const content = await readFile(path, "utf-8");
            rawQueries = JSON.parse(content);
          } else {
            const module = await import(resolve(path));
            rawQueries = module.cvQueries || module.queries || module.default;
          }
          break;
        }
      }
    }

    if (rawQueries.length === 0) {
      throw new Error("No queries provided and no default queries file found");
    }

    return this.expandQueries(rawQueries);
  }

  private expandQueries(queries: CVQuery[]): CVQuery[] {
    const expandedQueries: CVQuery[] = [];

    for (const query of queries) {
      if (query.languages && query.languages.length > 0) {
        for (const lang of query.languages) {
          const expanded = JSON.parse(JSON.stringify(query));
          expanded.language = lang;
          expanded.name = `${query.name}-${lang}`;
          delete expanded.languages;
          expandedQueries.push(expanded as CVQuery);
        }
      } else {
        expandedQueries.push(query);
      }
    }

    return expandedQueries;
  }

  private async buildSingleCV(
    generator: CVGenerator,
    data: CVData,
    query: CVQuery,
    outputPath: string,
    theme: string,
  ): Promise<BuildResult> {
    const result: BuildResult = {
      name: query.name,
      success: false,
    };

    try {
      console.log(`📝 ${query.name} (${query.language})`);

      const queryNameParts = query.name.split("-");
      const role =
        queryNameParts.length > 1 &&
        ["en", "fr", "de", "es", "it", "pt", "ja"].includes(
          queryNameParts[queryNameParts.length - 1],
        )
          ? queryNameParts.slice(0, -1).join("-")
          : query.name;

      const personName = this.extractPersonName(data, query);

      const roleDir = join(outputPath, role);
      await this.ensureDirectory(roleDir);

      const resume = generator.generate(data, query);
      const jsonPath = join(
        roleDir,
        `${personName}-${query.language}.resume.json`,
      );
      await writeFile(jsonPath, JSON.stringify(resume, null, 2));
      result.jsonPath = jsonPath;

      const facts = generator.generateFacts(data, query);
      const factsPath = join(
        roleDir,
        `${personName}-${query.language}.facts.json`,
      );
      await writeFile(factsPath, JSON.stringify(facts, null, 2));
      result.factsPath = factsPath;

      const letter = generator.generateLocalizedLetter(data, query);
      if (letter) {
        const letterPath = join(
          roleDir,
          `${personName}-${query.language}.letter.json`,
        );
        await writeFile(letterPath, JSON.stringify(letter, null, 2));
        result.letterPath = letterPath;

        try {
          const letterPdfPath = join(
            roleDir,
            `${personName}-${query.language}.letter.pdf`,
          );
          const env = {
            ...process.env,
            PUPPETEER_EXECUTABLE_PATH:
              process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
          };
          await execAsync(
            `./node_modules/.bin/build-cover-letter ${letterPath} --pdf "${letterPdfPath}"`,
            { env, timeout: 60000 },
          );
          result.letterPdfPath = letterPdfPath;
        } catch (error) {
          console.warn(
            `⚠️ Cover letter PDF generation failed for ${query.name}`,
          );
        }
      }

      try {
        const htmlPath = join(roleDir, `${personName}-${query.language}.html`);
        const env = {
          ...process.env,
          PUPPETEER_EXECUTABLE_PATH:
            process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
        };
        await execAsync(
          `resume export ${htmlPath} --resume ${jsonPath} --theme ${theme}`,
          { env, timeout: 30000 },
        );
        result.htmlPath = htmlPath;
      } catch (error) {
        console.warn(`⚠️ HTML generation failed for ${query.name}`);
      }

      try {
        const pdfPath = join(roleDir, `${personName}-${query.language}.pdf`);
        const env = {
          ...process.env,
          PUPPETEER_EXECUTABLE_PATH:
            process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
        };
        await execAsync(
          `resume export "${pdfPath}" --resume "${result.jsonPath}" --theme ${theme}`,
          { env, timeout: 60000 },
        );
        result.pdfPath = pdfPath;
      } catch (error) {
        console.warn(
          `⚠️ PDF generation failed for ${query.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      result.success = true;
      console.log(`✅ ${query.name}`);
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      console.error(`❌ ${query.name}: ${result.error}`);
    }

    return result;
  }

  private async generateIndex(
    results: BuildResult[],
    outputPath: string,
  ): Promise<void> {
    const successful = results.filter((r) => r.success);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Systematic CV</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { text-align: center; margin-bottom: 3rem; }
        .cv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .cv-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; }
        .cv-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; }
        .cv-links { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .cv-link { padding: 0.5rem 1rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-size: 0.875rem; }
        .cv-link:hover { background: #2563eb; }
        .cv-link.json { background: #10b981; }
        .cv-link.html { background: #f59e0b; }
        .cv-link.pdf { background: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Systematic CV</h1>
        <p>${successful.length} CV variants generated</p>
    </div>

    <div class="cv-grid">
        ${successful
          .map((result) => {
            const role = result.name.split("-").slice(0, -1).join("-");
            const language = result.name.split("-").slice(-1)[0];
            const jsonFileName = result.jsonPath?.split("/").pop() || "";
            const personName =
              jsonFileName
                .replace(".resume.json", "")
                .replace(`-${language}`, "") || "CV";
            return `
            <div class="cv-card">
                <div class="cv-title">${result.name}</div>
                  <div class="cv-links">
                       ${result.jsonPath ? `<a href="${role}/${personName}-${language}.resume.json" class="cv-link json">JSON</a>` : ""}
                       ${result.factsPath ? `<a href="${role}/${personName}-${language}.facts.json" class="cv-link json">Facts</a>` : ""}
                       ${result.letterPath ? `<a href="${role}/${personName}-${language}.letter.json" class="cv-link json">Letter</a>` : ""}
                       ${result.htmlPath ? `<a href="${role}/${personName}-${language}.html" class="cv-link html">HTML</a>` : ""}
                       ${result.pdfPath ? `<a href="${role}/${personName}-${language}.pdf" class="cv-link pdf">Resume PDF</a>` : ""}
                       ${result.letterPdfPath ? `<a href="${role}/${personName}-${language}.letter.pdf" class="cv-link pdf">Letter PDF</a>` : ""}
                   </div>
            </div>
          `;
          })
          .join("")}
    </div>
</body>
</html>`;

    await writeFile(join(outputPath, "index.html"), html);
  }

  private async ensureDirectory(path: string): Promise<void> {
    await mkdir(path, { recursive: true });
  }
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.env.SYSTEMATIC_CV_CLI === "true"
) {
  const program = new Command();

  program
    .name("systematic-cv")
    .description("Generate multiple targeted resumes from tagged data")
    .version("1.0.0");

  program
    .command("build")
    .description("Build CV variants")
    .requiredOption("-o, --output <path>", "Output directory")
    .option("-i, --input <path>", "Input data directory/file")
    .option("-q, --queries <path>", "Queries file (JSON or TS/JS)")
    .option("-t, --theme <name>", "Resume theme", "awesomish")
    .action(async (options) => {
      const cv = new SystematicCV(options.theme);
      try {
        await cv.build({
          outputPath: options.output,
          inputPath: options.input,
          queriesPath: options.queries,
          theme: options.theme,
        });
      } catch (error) {
        console.error(
          "❌",
          error instanceof Error ? error.message : String(error),
        );
        process.exit(1);
      }
    });

  program
    .command("dev")
    .description("Start development mode with file watching")
    .requiredOption("-o, --output <path>", "Output directory")
    .option("-i, --input <path>", "Input data directory/file")
    .option("-q, --queries <path>", "Queries file (JSON or TS/JS)")
    .option("-t, --theme <name>", "Resume theme", "awesomish")
    .action(async (options) => {
      const cv = new SystematicCV(options.theme);
      try {
        await cv.dev({
          outputPath: options.output,
          inputPath: options.input,
          queriesPath: options.queries,
          theme: options.theme,
        });
      } catch (error) {
        console.error(
          "❌",
          error instanceof Error ? error.message : String(error),
        );
        process.exit(1);
      }
    });

  program.parse();
}

export default SystematicCV;

