import { CVDataFragment } from "../../../src/types/index.js";

const data: CVDataFragment = {
  skills: [
    {
      name: {
        en: "Mathematics",
        fr: "Mathématiques",
      },
      level: {
        en: "Revolutionary",
        fr: "Révolutionnaire",
      },
      keywords: [
        {
          en: "Calculus",
          fr: "Calcul infinitésimal",
        },
        {
          en: "Binary System",
          fr: "Système binaire",
        },
        {
          en: "Infinitesimal Analysis",
          fr: "Analyse infinitésimale",
        },
        {
          en: "Topology",
          fr: "Topologie",
        },
        {
          en: "Mathematical Logic",
          fr: "Logique mathématique",
        },
      ],
      tags: ["mathematics", "innovation", "calculus", "binary", "logic"],
    },
    {
      name: {
        en: "Philosophy",
        fr: "Philosophie",
      },
      level: {
        en: "Systematic Genius",
        fr: "Génie Systématique",
      },
      keywords: [
        {
          en: "Metaphysics",
          fr: "Métaphysique",
        },
        {
          en: "Logic",
          fr: "Logique",
        },
        {
          en: "Epistemology",
          fr: "Épistémologie",
        },
        {
          en: "Theodicy",
          fr: "Théodicée",
        },
        {
          en: "Possible Worlds Theory",
          fr: "Théorie des mondes possibles",
        },
      ],
      tags: [
        "philosophy",
        "metaphysics",
        "logic",
        "theodicy",
        "possible-worlds",
      ],
    },
    {
      name: {
        en: "Diplomacy",
        fr: "Diplomatie",
      },
      level: {
        en: "Idealistic",
        fr: "Idéaliste",
      },
      keywords: [
        {
          en: "International Relations",
          fr: "Relations internationales",
        },
        {
          en: "Religious Reconciliation",
          fr: "Réconciliation religieuse",
        },
        {
          en: "Court Politics",
          fr: "Politique de cour",
        },
        {
          en: "Genealogical Research",
          fr: "Recherche généalogique",
        },
      ],
      tags: ["diplomacy", "politics", "reconciliation", "genealogy"],
    },
  ],
};

export default data;
