import { Language } from "./json-resume.js";

export type CVTag = string;

export type LocalizedContent = {
  [K in Language]?: string;
};

export type LocalizedString = string | LocalizedContent;

export interface TaggedContent<T> {
  content: T;
  tags?: CVTag[];
  languages?: Partial<Record<Language, T>>;
}

export interface CVQueryOverrides {
  name?: LocalizedString;
  label?: LocalizedString;
  email?: string;
  phone?: string;
  summary?: LocalizedString;
  location?: {
    address?: LocalizedString;
    postalCode?: string;
    city?: LocalizedString;
    countryCode?: string;
    region?: LocalizedString;
  };
  profiles?: Array<{
    network?: string;
    username?: string;
    url?: string;
  }>;
}

export interface CVQuery {
  name: string;
  language: Language;
  languages?: Language[];
  theme?: string;
  summaryId?: string;
  tags: {
    include?: CVTag[];
    exclude?: CVTag[];
    requireAll?: boolean;
  };
  overrides?: CVQueryOverrides;
}

export interface CVBasics {
  name?: LocalizedString;
  label?: LocalizedString;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: LocalizedString;
  location?: {
    address?: LocalizedString;
    postalCode?: string;
    city?: LocalizedString;
    countryCode?: string;
    region?: LocalizedString;
  };
  profiles?: Array<{
    network?: string;
    username?: string;
    url?: string;
  }>;
  tags?: CVTag[];
}

export interface CVWork {
  name?: LocalizedString;
  position?: LocalizedString;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: LocalizedString;
  highlights?: Array<LocalizedString | TaggedContent<LocalizedString>>;
  tags?: CVTag[];
}

export interface CVEducation {
  institution?: LocalizedString;
  url?: string;
  area?: LocalizedString;
  studyType?: LocalizedString;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: Array<LocalizedString>;
  tags?: CVTag[];
}

export interface CVSkill {
  name?: LocalizedString;
  level?: LocalizedString;
  keywords?: Array<LocalizedString>;
  tags?: CVTag[];
}

export interface CVProject {
  name?: LocalizedString;
  description?: LocalizedString;
  highlights?: Array<LocalizedString | TaggedContent<LocalizedString>>;
  keywords?: Array<LocalizedString>;
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: Array<LocalizedString>;
  entity?: LocalizedString;
  type?: LocalizedString;
  tags?: CVTag[];
}

export interface CVLanguageSkill {
  language?: LocalizedString;
  fluency?: LocalizedString;
  tags?: CVTag[];
}

export interface CVInterest {
  name?: LocalizedString;
  keywords?: Array<LocalizedString>;
  tags?: CVTag[];
}

export interface CVFact {
  content: LocalizedString;
  tags?: CVTag[];
}

export interface CVVolunteer {
  organization?: LocalizedString;
  position?: LocalizedString;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: LocalizedString;
  highlights?: Array<LocalizedString | TaggedContent<LocalizedString>>;
  tags?: CVTag[];
}

export interface CVAward {
  title?: LocalizedString;
  date?: string;
  awarder?: LocalizedString;
  summary?: LocalizedString;
  tags?: CVTag[];
}

export interface CVCertificate {
  name?: LocalizedString;
  date?: string;
  issuer?: LocalizedString;
  url?: string;
  tags?: CVTag[];
}

export interface CVPublication {
  name?: LocalizedString;
  publisher?: LocalizedString;
  releaseDate?: string;
  url?: string;
  summary?: LocalizedString;
  tags?: CVTag[];
}

export interface CVReference {
  name?: LocalizedString;
  reference?: LocalizedString;
  tags?: CVTag[];
}

export interface CoverLetter {
  recipient?: {
    company?: LocalizedString;
    name?: LocalizedString;
    title?: LocalizedString;
    address?: {
      street?: LocalizedString;
      city?: LocalizedString;
      postalCode?: string;
      region?: LocalizedString;
      countryCode?: string;
    };
  };
  subject?: LocalizedString;
  content?: {
    opening?: LocalizedString;
    body?: Array<LocalizedString | TaggedContent<LocalizedString>>;
    closing?: LocalizedString;
  };
  sender?: {
    name?: LocalizedString;
    email?: string;
    phone?: string;
    location?: {
      city?: LocalizedString;
      region?: LocalizedString;
      countryCode?: string;
    };
    url?: string;
  };
  date?: string;
  tags?: CVTag[];
}

export interface CVData {
  basics?: CVBasics;
  work?: CVWork[];
  volunteer?: CVVolunteer[];
  education?: CVEducation[];
  awards?: CVAward[];
  certificates?: CVCertificate[];
  publications?: CVPublication[];
  skills?: CVSkill[];
  projects?: CVProject[];
  languages?: CVLanguageSkill[];
  interests?: CVInterest[];
  facts?: CVFact[];
  references?: CVReference[];
  letter?: CoverLetter;
  tags?: CVTag[];
  summaries?: SummaryRegistry;
}

export interface CVDataFragment {
  basics?: Partial<CVBasics>;
  work?: CVWork[];
  volunteer?: CVVolunteer[];
  education?: CVEducation[];
  awards?: CVAward[];
  certificates?: CVCertificate[];
  publications?: CVPublication[];
  skills?: CVSkill[];
  projects?: CVProject[];
  languages?: CVLanguageSkill[];
  interests?: CVInterest[];
  facts?: CVFact[];
  references?: CVReference[];
  letter?: CoverLetter;
  tags?: CVTag[];
  summaries?: SummaryRegistry;
}

export interface SummaryRegistry {
  [id: string]: LocalizedString;
}
