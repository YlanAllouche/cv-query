import {
  CVData,
  CVQuery,
  Language,
  LocalizedString,
  TaggedContent,
  CVBasics,
  CVWork,
  CVEducation,
  CVSkill,
  CVProject,
  CVLanguageSkill,
  CVInterest,
  CVFact,
  CVVolunteer,
  CVAward,
  CVCertificate,
  CVPublication,
  CVReference,
  CoverLetter,
  JsonResume,
  JsonResumeBasics,
  JsonResumeWork,
  JsonResumeEducation,
  JsonResumeSkill,
  JsonResumeProject,
  JsonResumeLanguage,
  JsonResumeInterest,
  JsonResumeVolunteer,
  JsonResumeAward,
  JsonResumeCertificate,
  JsonResumePublication,
  JsonResumeReference,
  SummaryRegistry,
} from "../types/index.js";
import { CVFilter } from "./filter.js";

export class CVGenerator {
  generate(data: CVData, query: CVQuery): JsonResume {
    const filteredData = CVFilter.filterData(data, query);
    const dataWithOverrides = this.applyOverrides(
      filteredData,
      query,
      data.summaries,
    );
    return this.convertToJsonResume(dataWithOverrides, query.language);
  }

  private convertToJsonResume(data: CVData, language: Language): JsonResume {
    const resume: JsonResume = {
      $schema:
        "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
      meta: {
        language: language,
      },
    };

    if (data.basics) {
      resume.basics = this.convertBasics(data.basics, language);
    }

    if (data.work && data.work.length > 0) {
      resume.work = data.work.map((work) => this.convertWork(work, language));
    }

    if (data.education && data.education.length > 0) {
      resume.education = data.education.map((edu) =>
        this.convertEducation(edu, language),
      );
    }

    if (data.skills && data.skills.length > 0) {
      resume.skills = data.skills.map((skill) =>
        this.convertSkill(skill, language),
      );
    }

    if (data.projects && data.projects.length > 0) {
      resume.projects = data.projects.map((project) =>
        this.convertProject(project, language),
      );
    }

    if (data.languages && data.languages.length > 0) {
      resume.languages = data.languages.map((lang) =>
        this.convertLanguage(lang, language),
      );
    }

    if (data.interests && data.interests.length > 0) {
      resume.interests = data.interests.map((interest) =>
        this.convertInterest(interest, language),
      );
    }

    if (data.volunteer && data.volunteer.length > 0) {
      resume.volunteer = data.volunteer.map((vol) =>
        this.convertVolunteer(vol, language),
      );
    }

    if (data.awards && data.awards.length > 0) {
      resume.awards = data.awards.map((award) =>
        this.convertAward(award, language),
      );
    }

    if (data.certificates && data.certificates.length > 0) {
      resume.certificates = data.certificates.map((cert) =>
        this.convertCertificate(cert, language),
      );
    }

    if (data.publications && data.publications.length > 0) {
      resume.publications = data.publications.map((pub) =>
        this.convertPublication(pub, language),
      );
    }

    if (data.references && data.references.length > 0) {
      resume.references = data.references.map((ref) =>
        this.convertReference(ref, language),
      );
    }

    return resume;
  }

  private convertBasics(
    basics: CVBasics,
    language: Language,
  ): JsonResumeBasics {
    return {
      name: this.localizeString(basics.name, language),
      label: this.localizeString(basics.label, language),
      image: basics.image,
      email: basics.email,
      phone: basics.phone,
      url: basics.url,
      summary: this.localizeString(basics.summary, language),
      location: basics.location
        ? {
            address: this.localizeString(basics.location.address, language),
            postalCode: basics.location.postalCode,
            city: this.localizeString(basics.location.city, language),
            countryCode: basics.location.countryCode,
            region: this.localizeString(basics.location.region, language),
          }
        : undefined,
      profiles: basics.profiles,
    };
  }

  private convertWork(work: CVWork, language: Language): JsonResumeWork {
    return {
      name: this.localizeString(work.name, language),
      position: this.localizeString(work.position, language),
      url: work.url,
      startDate: work.startDate,
      endDate: work.endDate,
      summary: this.localizeString(work.summary, language),
      highlights: work.highlights
        ? work.highlights.map((h: any) => this.localizeHighlight(h, language))
        : undefined,
    };
  }

  private convertEducation(
    education: CVEducation,
    language: Language,
  ): JsonResumeEducation {
    return {
      institution: this.localizeString(education.institution, language),
      url: education.url,
      area: this.localizeString(education.area, language),
      studyType: this.localizeString(education.studyType, language),
      startDate: education.startDate,
      endDate: education.endDate,
      score: education.score,
      courses: education.courses
        ? education.courses
            .map((c: any) => this.localizeString(c, language))
            .filter((c): c is string => c !== undefined)
        : undefined,
    };
  }

  private convertSkill(skill: any, language: Language): JsonResumeSkill {
    return {
      name: this.localizeString(skill.name, language),
      level: this.localizeString(skill.level, language),
      keywords: skill.keywords
        ? skill.keywords.map((k: any) => this.localizeString(k, language))
        : undefined,
    };
  }

  private convertProject(project: any, language: Language): JsonResumeProject {
    return {
      name: this.localizeString(project.name, language),
      description: this.localizeString(project.description, language),
      highlights: project.highlights
        ? project.highlights.map((h: any) =>
            this.localizeHighlight(h, language),
          )
        : undefined,
      keywords: project.keywords
        ? project.keywords.map((k: any) => this.localizeString(k, language))
        : undefined,
      startDate: project.startDate,
      endDate: project.endDate,
      url: project.url,
      roles: project.roles
        ? project.roles.map((r: any) => this.localizeString(r, language))
        : undefined,
      entity: this.localizeString(project.entity, language),
      type: this.localizeString(project.type, language),
    };
  }

  private convertLanguage(lang: any, language: Language): JsonResumeLanguage {
    return {
      language: this.localizeString(lang.language, language),
      fluency: this.localizeString(lang.fluency, language),
    };
  }

  private convertInterest(
    interest: any,
    language: Language,
  ): JsonResumeInterest {
    return {
      name: this.localizeString(interest.name, language),
      keywords: interest.keywords
        ? interest.keywords.map((k: any) => this.localizeString(k, language))
        : undefined,
    };
  }

  private convertVolunteer(
    volunteer: CVVolunteer,
    language: Language,
  ): JsonResumeVolunteer {
    return {
      organization: this.localizeString(volunteer.organization, language),
      position: this.localizeString(volunteer.position, language),
      url: volunteer.url,
      startDate: volunteer.startDate,
      endDate: volunteer.endDate,
      summary: this.localizeString(volunteer.summary, language),
      highlights: volunteer.highlights
        ? volunteer.highlights.map((h: any) =>
            this.localizeHighlight(h, language),
          )
        : undefined,
    };
  }

  private convertAward(award: CVAward, language: Language): JsonResumeAward {
    return {
      title: this.localizeString(award.title, language),
      date: award.date,
      awarder: this.localizeString(award.awarder, language),
      summary: this.localizeString(award.summary, language),
    };
  }

  private convertCertificate(
    certificate: CVCertificate,
    language: Language,
  ): JsonResumeCertificate {
    return {
      name: this.localizeString(certificate.name, language),
      date: certificate.date,
      issuer: this.localizeString(certificate.issuer, language),
      url: certificate.url,
    };
  }

  private convertPublication(
    publication: CVPublication,
    language: Language,
  ): JsonResumePublication {
    return {
      name: this.localizeString(publication.name, language),
      publisher: this.localizeString(publication.publisher, language),
      releaseDate: publication.releaseDate,
      url: publication.url,
      summary: this.localizeString(publication.summary, language),
    };
  }

  private convertReference(
    reference: CVReference,
    language: Language,
  ): JsonResumeReference {
    return {
      name: this.localizeString(reference.name, language),
      reference: this.localizeString(reference.reference, language),
    };
  }

  generateFacts(data: CVData, query: CVQuery): string[] {
    const filteredData = CVFilter.filterData(data, query);
    return (filteredData.facts || [])
      .map((fact) => this.localizeString(fact.content, query.language) || "")
      .filter((content) => content !== "");
  }

  generateLocalizedLetter(data: CVData, query: CVQuery): any | null {
    const filteredData = CVFilter.filterData(data, query);
    if (!filteredData.letter) {
      return null;
    }

    return this.localizeCoverLetter(filteredData.letter, query.language);
  }

  private localizeString(
    value: any,
    language: Language,
  ): string | undefined {
    if (!value) return undefined;

    if (typeof value === "string") {
      return value;
    }

    return value[language] || value["en"] || Object.values(value)[0];
  }

  private localizeHighlight(
    highlight: any,
    language: Language,
  ): string {
    if (typeof highlight === "string") {
      return highlight;
    }

    if ("content" in highlight) {
      return this.localizeString(highlight.content, language) || "";
    }

    return this.localizeString(highlight, language) || "";
  }

  private localizeCoverLetter(letter: CoverLetter, language: Language): any {
    const localized: any = {};

    if (letter.recipient) {
      localized.recipient = {
        company: this.localizeString(letter.recipient.company, language),
        name: this.localizeString(letter.recipient.name, language),
        title: this.localizeString(letter.recipient.title, language),
        address: letter.recipient.address
          ? {
              street: this.localizeString(
                letter.recipient.address.street,
                language,
              ),
              city: this.localizeString(
                letter.recipient.address.city,
                language,
              ),
              postalCode: letter.recipient.address.postalCode,
              region: this.localizeString(
                letter.recipient.address.region,
                language,
              ),
              countryCode: letter.recipient.address.countryCode,
            }
          : undefined,
      };
    }

    localized.subject = this.localizeString(letter.subject, language);

    if (letter.content) {
      localized.content = {
        opening: this.localizeString(letter.content.opening, language),
        body: letter.content.body
          ?.map((paragraph: any) => {
            if (typeof paragraph === "string") {
              return paragraph;
            }
            if ("content" in paragraph) {
              return this.localizeString(paragraph.content, language);
            }
            return this.localizeString(paragraph, language);
          })
          .filter((p): p is string => p !== undefined && p !== null),
        closing: this.localizeString(letter.content.closing, language),
      };
    }

    if (letter.sender) {
      localized.sender = {
        name: this.localizeString(letter.sender.name, language),
        email: letter.sender.email,
        phone: letter.sender.phone,
        location: letter.sender.location
          ? {
              city: this.localizeString(letter.sender.location.city, language),
              region: this.localizeString(
                letter.sender.location.region,
                language,
              ),
              countryCode: letter.sender.location.countryCode,
            }
          : undefined,
        url: letter.sender.url,
      };
    }

    localized.date = letter.date;

    return localized;
  }

  private applyOverrides(
    data: CVData,
    query: CVQuery,
    summaries?: any,
  ): CVData {
    const dataWithOverrides = { ...data };

    let summaryToUse = query.overrides?.summary;
    if (query.summaryId && summaries && summaries[query.summaryId]) {
      summaryToUse = summaries[query.summaryId];
    }

    if (dataWithOverrides.basics) {
      dataWithOverrides.basics = {
        ...dataWithOverrides.basics,
        ...(query.overrides?.name && { name: query.overrides.name }),
        ...(query.overrides?.label && { label: query.overrides.label }),
        ...(query.overrides?.email && { email: query.overrides.email }),
        ...(query.overrides?.phone && { phone: query.overrides.phone }),
        ...(summaryToUse && { summary: summaryToUse }),
        ...(query.overrides?.location && {
          location: {
            ...dataWithOverrides.basics.location,
            ...query.overrides.location,
          },
        }),
        ...(query.overrides?.profiles && {
          profiles: query.overrides.profiles,
        }),
      };
    } else if (query.overrides || summaryToUse) {
      dataWithOverrides.basics = {
        name: query.overrides?.name,
        label: query.overrides?.label,
        email: query.overrides?.email,
        phone: query.overrides?.phone,
        summary: summaryToUse,
        location: query.overrides?.location,
        profiles: query.overrides?.profiles,
      };
    }

    return dataWithOverrides;
  }
}
