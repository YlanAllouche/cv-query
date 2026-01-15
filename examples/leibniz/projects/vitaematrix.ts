import { CVDataFragment } from "../../../src/types/index.js";

const data: CVDataFragment = {
  projects: [
    {
      name: {
        en: "Binary Number System",
        fr: "Système de Nombres Binaires",
      },
      description: {
        en: "Developed complete binary arithmetic system, connecting it to Chinese I Ching philosophy",
        fr: "Développement d'un système arithmétique binaire complet, le connectant à la philosophie chinoise du I Ching",
      },
      url: "https://leibniz.org/binary",
      startDate: "1679-01-01",
      endDate: "1716-11-14",
      highlights: [
        {
          content: {
            en: "Laid foundation for modern computer science",
            fr: "Posé les bases de l'informatique moderne",
          },
          tags: ["innovation", "computer-science", "foundation"],
        },
        {
          content: {
            en: "Saw theological significance in creation from nothing (0) and something (1)",
            fr: "Vu la signification théologique dans la création à partir de rien (0) et de quelque chose (1)",
          },
          tags: ["theology", "philosophy", "binary", "symbolism"],
        },
        {
          content: {
            en: "Impressed Chinese Emperor with binary interpretation of ancient texts",
            fr: "Impressionné l'empereur chinois avec l'interprétation binaire des textes anciens",
          },
          tags: [
            "cross-cultural",
            "diplomacy",
            "chinese-philosophy",
            "international-relations",
          ],
        },
      ],
      entity: {
        en: "Independent Research",
        fr: "Recherche Indépendante",
      },
      type: {
        en: "Mathematical Innovation",
        fr: "Innovation Mathématique",
      },
      keywords: [
        {
          en: "Binary",
          fr: "Binaire",
        },
        {
          en: "Computing",
          fr: "Informatique",
        },
        {
          en: "Philosophy",
          fr: "Philosophie",
        },
        {
          en: "Cross-cultural Exchange",
          fr: "Échange interculturel",
        },
      ],
      tags: [
        "mathematics",
        "innovation",
        "binary",
        "philosophy",
        "cross-cultural",
      ],
    },
  ],
};

export default data;
