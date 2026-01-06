import { readdir, stat } from "fs/promises";
import { join } from "path";
import { CVData, CVDataFragment, SummaryRegistry } from "../types/index.js";
import { loadFile, isSupportedFile } from "../utils/dynamic-loader.js";

export class DataLoader {
  private dataPath: string;

  constructor(dataPath: string = "./data") {
    this.dataPath = dataPath;
  }

  async loadAllData(): Promise<CVData> {
    const fragments = await this.loadDataFragments(this.dataPath);
    return this.mergeFragments(fragments);
  }

  private async loadDataFragments(dirPath: string): Promise<CVDataFragment[]> {
    const fragments: CVDataFragment[] = [];

    try {
      const entries = await readdir(dirPath);

      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          const subFragments = await this.loadDataFragments(fullPath);
          fragments.push(...subFragments);
        } else if (this.isDataFile(entry)) {
          try {
            const fragment = await this.loadDataFile(fullPath);
            if (fragment) {
              fragments.push(fragment);
            }
          } catch (error) {
            console.warn(`Warning: Failed to load ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Failed to read directory ${dirPath}:`, error);
    }

    return fragments;
  }

  private isDataFile(filename: string): boolean {
    if (
      filename.includes("cv-definitions") ||
      filename.includes("queries") ||
      filename.includes("package") ||
      filename.includes("build")
    ) {
      return false;
    }
    return isSupportedFile(filename);
  }

  private async loadDataFile(filePath: string): Promise<CVDataFragment | null> {
    try {
      const data = await loadFile(filePath);
      return data as CVDataFragment;
    } catch (error) {
      console.warn(`Failed to load ${filePath}:`, error);
      return null;
    }
  }

  private mergeFragments(fragments: CVDataFragment[]): CVData {
    const merged: CVData = {
      work: [],
      education: [],
      skills: [],
      projects: [],
      languages: [],
      interests: [],
      facts: [],
      volunteer: [],
      awards: [],
      certificates: [],
      publications: [],
      references: [],
      tags: [],
    };

    let mergedSummaries: SummaryRegistry = {};

    const arraySections: (keyof CVData)[] = [
      "work",
      "education",
      "skills",
      "projects",
      "languages",
      "interests",
      "facts",
      "volunteer",
      "awards",
      "certificates",
      "publications",
      "references",
      "tags",
    ];
    const singleSections: (keyof CVData)[] = ["letter"];

    for (const fragment of fragments) {
      if (fragment.basics) {
        merged.basics = this.mergeBasics(merged.basics, fragment.basics);
      }

      for (const section of arraySections) {
        if (fragment[section]) {
          (merged[section] as any[]) = [
            ...((merged[section] as any[]) || []),
            ...(fragment[section] as any[]),
          ];
        }
      }

      if (fragment.letter) {
        if (!merged.letter) {
          merged.letter = fragment.letter;
        } else {
          merged.letter = { ...merged.letter, ...fragment.letter };
        }
      }

      if (fragment.summaries) {
        mergedSummaries = { ...mergedSummaries, ...fragment.summaries };
      }
    }

    if (Object.keys(mergedSummaries).length > 0) {
      merged.summaries = mergedSummaries;
    }

    return this.inheritTags(merged);
  }

  private mergeBasics(existing: any, newBasics: any): any {
    if (!existing) return { ...newBasics };

    return {
      ...existing,
      ...newBasics,
      location:
        existing.location || newBasics.location
          ? {
              ...existing.location,
              ...newBasics.location,
            }
          : undefined,
      profiles: [...(existing.profiles || []), ...(newBasics.profiles || [])],
    };
  }

  private inheritTags(data: CVData): CVData {
    const globalTags = data.tags || [];

    const addGlobalTags = (items: any[]) => {
      return items.map((item) => ({
        ...item,
        tags: [...globalTags, ...(item.tags || [])],
      }));
    };

    const addGlobalTagsToLetter = (letter: any) => {
      if (!letter) return letter;

      const addGlobalTagsToParagraphs = (paragraphs: any[]) => {
        return paragraphs.map((paragraph) => ({
          ...paragraph,
          tags: [...globalTags, ...(paragraph.tags || [])],
        }));
      };

      return {
        ...letter,
        tags: [...globalTags, ...(letter.tags || [])],
        content: letter.content
          ? {
              ...letter.content,
              body: letter.content.body
                ? addGlobalTagsToParagraphs(letter.content.body)
                : undefined,
            }
          : undefined,
      };
    };

    return {
      ...data,
      work: data.work ? addGlobalTags(data.work) : [],
      education: data.education ? addGlobalTags(data.education) : [],
      skills: data.skills ? addGlobalTags(data.skills) : [],
      projects: data.projects ? addGlobalTags(data.projects) : [],
      languages: data.languages ? addGlobalTags(data.languages) : [],
      interests: data.interests ? addGlobalTags(data.interests) : [],
      volunteer: data.volunteer ? addGlobalTags(data.volunteer) : [],
      awards: data.awards ? addGlobalTags(data.awards) : [],
      certificates: data.certificates ? addGlobalTags(data.certificates) : [],
      publications: data.publications ? addGlobalTags(data.publications) : [],
      references: data.references ? addGlobalTags(data.references) : [],
      letter: data.letter ? addGlobalTagsToLetter(data.letter) : undefined,
    };
  }
}
