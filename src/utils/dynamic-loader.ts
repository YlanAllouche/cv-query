import { readFile, writeFile, mkdir } from "fs/promises";
import { extname, resolve, join } from "path";
import { pathToFileURL } from "url";
import { tmpdir } from "os";

async function compileTypeScript(filePath: string): Promise<string> {
  let esbuild: any;

  try {
    esbuild = await import("esbuild");
  } catch (importError) {
    throw new Error(
      `TypeScript support requires esbuild. Install it with: npm install esbuild`,
    );
  }

  try {
    const result = await esbuild.build({
      entryPoints: [filePath],
      bundle: false,
      format: "esm",
      target: "node18",
      outdir: join(tmpdir(), "systematic-cv-ts"),
      write: false,
      logLevel: "silent",
    });

    if (result.outputFiles && result.outputFiles.length > 0) {
      const tempDir = join(tmpdir(), "systematic-cv-ts");
      await mkdir(tempDir, { recursive: true });

      const tempFile = join(tempDir, `compiled-${Date.now()}.mjs`);
      await writeFile(tempFile, result.outputFiles[0].text);

      return tempFile;
    }

    throw new Error("No output from TypeScript compilation");
  } catch (error) {
    throw new Error(
      `TypeScript compilation failed: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function loadFile(filePath: string): Promise<any> {
  const ext = extname(filePath).toLowerCase();
  const absolutePath = resolve(filePath);

  try {
    switch (ext) {
      case ".json": {
        const content = await readFile(absolutePath, "utf-8");
        return JSON.parse(content);
      }

      case ".js": {
        const fileUrl = pathToFileURL(absolutePath).href;
        const module = await import(fileUrl);
        return module.default || module;
      }

      case ".ts": {
        const compiledFile = await compileTypeScript(absolutePath);
        const fileUrl = pathToFileURL(compiledFile).href;

        try {
          const module = await import(fileUrl);
          return module.default || module;
        } finally {
          try {
            const { unlink } = await import("fs/promises");
            await unlink(compiledFile);
          } catch (cleanupError) {}
        }
      }

      default:
        throw new Error(
          `Unsupported file extension: ${ext}. Supported: .json, .js, .ts`,
        );
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Syntax error in ${filePath}: ${error.message}`);
    }
    if (
      error instanceof Error &&
      error.message.includes("Cannot find module")
    ) {
      throw new Error(`File not found: ${filePath}`);
    }
    throw new Error(
      `Failed to load ${filePath}: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function loadQueries(filePath: string): Promise<any[]> {
  const data = await loadFile(filePath);

  if (Array.isArray(data)) {
    return data;
  }

  const queryProps = ["cvQueries", "queries", "default"];
  for (const prop of queryProps) {
    if (data[prop] && Array.isArray(data[prop])) {
      return data[prop];
    }
  }

  throw new Error(
    `No valid queries found in ${filePath}. Expected array or object with 'cvQueries', 'queries', or 'default' property.`,
  );
}

export function isSupportedFile(filename: string): boolean {
  const ext = extname(filename).toLowerCase();
  return [".json", ".js", ".ts"].includes(ext);
}

export function getFileExtensions(): string[] {
  return [".ts", ".js", ".json"];
}
