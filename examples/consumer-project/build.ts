#!/usr/bin/env node

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { DataLoader, CVGenerator } from "../../src/index.js";
import { cvQueries } from "./cv-definitions.js";

function extractPersonName(data: any, query: any): string {
  let name: string | undefined;

  if (query.overrides?.name) {
    name =
      typeof query.overrides.name === "string"
        ? query.overrides.name
        : query.overrides.name.en || Object.values(query.overrides.name)[0];
  }

  if (!name && data.basics?.name) {
    name =
      typeof data.basics.name === "string"
        ? data.basics.name
        : data.basics.name.en || Object.values(data.basics.name)[0];
  }

  if (!name) {
    throw new Error(
      "Could not extract person name from CV data or query overrides",
    );
  }

  return name.toLowerCase().replace(/\s+/g, "-");
}

async function main() {
  console.log("🚀 Building Alice's CV variants...");

  try {
    await mkdir("./dist", { recursive: true });

    console.log("📂 Loading CV data...");
    const loader = new DataLoader("./data");
    const data = await loader.loadAllData();

    const generator = new CVGenerator();

    console.log(`📝 Generating ${cvQueries.length} CV variants...`);

    for (const query of cvQueries) {
      console.log(`Building: ${query.name} (${query.language})`);

      const personName = extractPersonName(data, query);

      const roleDir = join("./dist", query.name);
      await mkdir(roleDir, { recursive: true });

      const resume = generator.generate(data, query);
      const facts = generator.generateFacts(data, query);

      await writeFile(
        join(roleDir, `${personName}-${query.language}.resume.json`),
        JSON.stringify(resume, null, 2),
      );
      if (facts.length > 0) {
        await writeFile(
          join(roleDir, `${personName}-facts-${query.language}.json`),
          JSON.stringify(facts, null, 2),
        );
      }

      console.log(`✅ Generated: ${query.name} (${query.language})`);

      if (query.overrides) {
        console.log(`   📧 Custom email: ${query.overrides.email}`);
        console.log(`   📱 Custom phone: ${query.overrides.phone}`);
      }
    }

    // Generate a simple index file
    const indexHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Alice Johnson - CV Variants</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .cv-variant { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
        .cv-links a { margin-right: 15px; text-decoration: none; padding: 8px 16px; background: #007acc; color: white; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Alice Johnson - CV Variants</h1>
    <p>Generated using <strong>systematic-cv</strong></p>
    ${cvQueries
      .map((query) => {
        const personName = extractPersonName(data, query);
        return `
    <div class="cv-variant">
        <h3>${query.name}</h3>
        <div class="cv-links">
            <a href="${query.name}/${personName}-${query.language}.resume.json">Resume JSON</a>
            <a href="${query.name}/${personName}-${query.language}.matrix.json">Matrix JSON</a>
        </div>
    </div>
    `;
      })
      .join("")}
</body>
</html>`;

    await writeFile("./dist/index.html", indexHtml);

    console.log("\n📊 Build completed!");
    console.log(`📁 Output: ./dist/`);
    console.log(`🌐 Index: ./dist/index.html`);

    // Show generated files
    console.log("\n📋 Generated files:");
    for (const query of cvQueries) {
      const personName = extractPersonName(data, query);
      console.log(
        `   📄 ${query.name}/${personName}-${query.language}.resume.json`,
      );
      console.log(
        `   📄 ${query.name}/${personName}-${query.language}.matrix.json`,
      );
    }
  } catch (error) {
    console.error("💥 Build failed:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

