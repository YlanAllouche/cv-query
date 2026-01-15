import { CVDataFragment } from "../../../src/types/index.js";

const data: CVDataFragment = {
  education: [
    {
      institution: {
        en: "University of Leipzig",
        fr: "Université de Leipzig",
      },
      url: "https://uni-leipzig.de",
      area: {
        en: "Philosophy and Law",
        fr: "Philosophie et Droit",
      },
      studyType: {
        en: "Bachelor and Master",
        fr: "Licence et Maîtrise",
      },
      startDate: "1661-01-01",
      endDate: "1666-12-31",
      score: "Summa Cum Laude (invented new categories of excellence)",
      courses: [
        {
          en: "Aristotelian Logic (later revolutionized)",
          fr: "Logique aristotélicienne (révolutionnée plus tard)",
        },
        {
          en: "Roman Law (found it insufficiently mathematical)",
          fr: "Droit romain (trouvé insuffisamment mathématique)",
        },
        {
          en: "Scholastic Philosophy (appreciated the systematic approach)",
          fr: "Philosophie scolastique (apprécié l'approche systématique)",
        },
      ],
      tags: ["education", "philosophy", "law", "leipzig", "early-academic"],
    },
    {
      institution: {
        en: "University of Altdorf",
        fr: "Université d'Altdorf",
      },
      url: "https://altdorf.university",
      area: {
        en: "Law",
        fr: "Droit",
      },
      studyType: {
        en: "Doctorate",
        fr: "Doctorat",
      },
      startDate: "1666-01-01",
      endDate: "1667-12-31",
      score: "Distinction (faculty begged him to stay)",
      courses: [
        {
          en: "Jurisprudence",
          fr: "Jurisprudence",
        },
        {
          en: "Legal Philosophy",
          fr: "Philosophie juridique",
        },
        {
          en: "The Art of Making Everything Mathematical",
          fr: "L'art de rendre tout mathématique",
        },
      ],
      tags: ["education", "law", "doctorate", "altdorf", "young-achievement"],
    },
  ],
};

export default data;
