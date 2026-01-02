import {
  CVData,
  CVQuery,
  CVTag,
  LocalizedString,
  TaggedContent,
} from "../types/index.js";

export class CVFilter {
  static filterData(data: CVData, query: CVQuery): CVData {
    const filtered: CVData = {
      basics: data.basics,
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
      letter: data.letter,
      tags: data.tags,
    };

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
    ];

    for (const section of arraySections) {
      if (data[section]) {
        (filtered[section] as any[]) = (data[section] as any[]).filter((item) =>
          this.matchesTags(item.tags || [], query.tags),
        );
      }
    }

    const withFilteredHighlights = this.filterHighlights(filtered, query);
    return this.filterCoverLetter(withFilteredHighlights, query);
  }

  private static matchesTags(
    itemTags: CVTag[],
    queryTags: CVQuery["tags"],
  ): boolean {
    const { include = [], exclude = [], requireAll = false } = queryTags;

    if (exclude.length > 0 && exclude.some((tag) => itemTags.includes(tag))) {
      return false;
    }

    if (include.length === 0) {
      return true;
    }

    if (requireAll) {
      return include.every((tag) => itemTags.includes(tag));
    } else {
      return include.some((tag) => itemTags.includes(tag));
    }
  }

  static filterCoverLetter(data: CVData, query: CVQuery): CVData {
    if (!data.letter) {
      return data;
    }

    const filteredLetter = this.filterLetterContent(data.letter, query);

    return { ...data, letter: filteredLetter };
  }

  private static filterLetterContent(letter: any, query: CVQuery): any {
    const filteredLetter = { ...letter };

    if (filteredLetter.content?.body) {
      filteredLetter.content.body = filteredLetter.content.body.filter(
        (paragraph: any) => {
          if (
            typeof paragraph === "string" ||
            this.isLocalizedContent(paragraph)
          ) {
            return true;
          }

          if (this.isTaggedContent(paragraph)) {
            const paragraphTags =
              paragraph.tags && paragraph.tags.length > 0
                ? paragraph.tags
                : letter.tags || [];
            return this.matchesTags(paragraphTags, query.tags);
          }

          return true;
        },
      );
    }

    return filteredLetter;
  }

  private static filterHighlights(data: CVData, query: CVQuery): CVData {
    const filterHighlightArray = (
      highlights:
        | Array<LocalizedString | TaggedContent<LocalizedString>>
        | undefined,
      parentTags: CVTag[] = [],
    ) => {
      if (!highlights) return undefined;

      return highlights.filter((highlight) => {
        if (
          typeof highlight === "string" ||
          this.isLocalizedContent(highlight)
        ) {
          return true;
        }

        if (this.isTaggedContent(highlight)) {
          const highlightTags =
            highlight.tags && highlight.tags.length > 0
              ? highlight.tags
              : parentTags;
          return this.matchesTags(highlightTags, query.tags);
        }

        return true;
      });
    };

    return {
      ...data,
      work: data.work?.map((work: any) => ({
        ...work,
        highlights: filterHighlightArray(work.highlights, work.tags || []),
      })),
      projects: data.projects?.map((project: any) => ({
        ...project,
        highlights: filterHighlightArray(
          project.highlights,
          project.tags || [],
        ),
      })),
    };
  }

  private static isLocalizedContent(obj: any): boolean {
    return (
      typeof obj === "object" &&
      obj !== null &&
      !("content" in obj) &&
      !("tags" in obj)
    );
  }

  private static isTaggedContent<T>(obj: any): obj is TaggedContent<T> {
    return typeof obj === "object" && obj !== null && "content" in obj;
  }
}
