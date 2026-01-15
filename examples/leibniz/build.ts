#!/usr/bin/env node

/**
 * Leibniz Example - Build script
 * 
 * This demonstrates how to use systematic-cv as a library
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { DataLoader, CVGenerator } from "../../src/index.js";
import { cvQueries } from "./cv-definitions.js";

const execAsync = promisify(exec);

/**
 * Extract person name from CV data or query overrides
 * Converts full name to lowercase slug (e.g., "John Doe" -> "john-doe")
 */
function extractPersonName(data: any, query: any): string {
  let name: string | undefined;
  
  // Try to get name from query overrides first
  if (query.overrides?.name) {
    name = typeof query.overrides.name === 'string' 
      ? query.overrides.name 
      : query.overrides.name.en || Object.values(query.overrides.name)[0];
  }
  
  // Fall back to CV data
  if (!name && data.basics?.name) {
    name = typeof data.basics.name === 'string'
      ? data.basics.name
      : data.basics.name.en || Object.values(data.basics.name)[0];
  }
  
  if (!name) {
    throw new Error("Could not extract person name from CV data or query overrides");
  }
  
  // Convert to lowercase slug
  return name.toLowerCase().replace(/\s+/g, '-');
}

async function main() {
  console.log("🚀 Building Leibniz CV examples...");

  try {
    // Ensure dist directory exists
    await mkdir("./dist", { recursive: true });

    // Load CV data from the leibniz data directory
    console.log("📂 Loading Leibniz CV data...");
    const loader = new DataLoader(".");
    const data = await loader.loadAllData();

    // Initialize generator
    const generator = new CVGenerator();

    console.log(`📝 Generating ${cvQueries.length} CV variants...`);

    // Generate all CVs
    for (const query of cvQueries) {
      console.log(`Building: ${query.name} (${query.language})`);

      // Extract person name
      const personName = extractPersonName(data, query);
      
      // Create role-specific directory
      const roleDir = join("./dist", query.name);
      await mkdir(roleDir, { recursive: true });

      // Generate JSON files
       const resume = generator.generate(data, query);
       const facts = generator.generateFacts(data, query);

       // Construct file paths with new structure: ${query.name}/${person-name}-${lang}.ext
       const resumePath = join(roleDir, `${personName}-${query.language}.resume.json`);
       const factsPath = join(roleDir, `${personName}-facts-${query.language}.json`);
       
       await writeFile(resumePath, JSON.stringify(resume, null, 2));
       if (facts.length > 0) {
         await writeFile(factsPath, JSON.stringify(facts, null, 2));
       }

      // Generate HTML
      try {
        const htmlPath = join(roleDir, `${personName}-${query.language}.html`);
        await execAsync(
          `npx resume export ${htmlPath} --resume ${resumePath} --theme ${query.theme || 'elegant'}`
        );
        console.log(`✅ Generated: ${query.name} (${query.language})`);
      } catch (error) {
        console.warn(`⚠️  HTML generation failed for ${query.name} (${query.language})`);
      }
    }

    console.log("📊 Build completed!");
    console.log(`📁 Output: ./dist/`);

  } catch (error) {
    console.error("💥 Build failed:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}