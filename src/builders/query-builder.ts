import { CVQuery, CVTag, CVQueryOverrides, Language } from "../types/index.js";

export class QueryBuilder {
  private query: CVQuery;
  private queryLanguages: Language[] = [];

  constructor(name: string, language?: Language | Language[]) {
    if (Array.isArray(language)) {
      this.queryLanguages = language;
      this.query = {
        name,
        language: language[0],
        languages: language,
        tags: {},
      };
    } else {
      this.query = {
        name,
        language: language || "en",
        tags: {},
      };
    }
  }

  include(...tags: CVTag[]): QueryBuilder {
    this.query.tags.include = [...(this.query.tags.include || []), ...tags];
    return this;
  }

  exclude(...tags: CVTag[]): QueryBuilder {
    this.query.tags.exclude = [...(this.query.tags.exclude || []), ...tags];
    return this;
  }

  requireAll(value: boolean = true): QueryBuilder {
    this.query.tags.requireAll = value;
    return this;
  }

  language(lang: Language): QueryBuilder {
    this.query.language = lang;
    return this;
  }

  languages(langs: Language[]): QueryBuilder {
    this.queryLanguages = langs;
    this.query.language = langs[0];
    this.query.languages = langs;
    return this;
  }

  theme(themeName: string): QueryBuilder {
    this.query.theme = themeName;
    return this;
  }

  summaryId(id: string): QueryBuilder {
    this.query.summaryId = id;
    return this;
  }

  override(overrides: CVQueryOverrides | undefined): QueryBuilder {
    if (overrides === undefined) {
      this.query.overrides = undefined;
    } else {
      this.query.overrides = { ...this.query.overrides, ...overrides };
    }
    return this;
  }

  build(): CVQuery {
    return JSON.parse(JSON.stringify(this.query));
  }

  buildMulti(): CVQuery[] {
    const languages =
      this.queryLanguages.length > 0
        ? this.queryLanguages
        : [this.query.language];
    return languages.map((lang) => {
      const query = JSON.parse(JSON.stringify(this.query));
      query.language = lang;
      query.name = `${this.query.name}-${lang}`;
      delete query.languages;
      return query as CVQuery;
    });
  }

  static create(name: string, language?: Language | Language[]): QueryBuilder {
    return new QueryBuilder(name, language);
  }
}
