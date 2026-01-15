import { CVDataFragment } from "../../../src/types/index.js";

const data: CVDataFragment = {
  work: [
    {
      name: "House of Hanover",
      position: {
        en: "Court Mathematician & Librarian",
        fr: "Mathématicien de Cour et Bibliothécaire",
      },
      url: "https://hanover.court",
      startDate: "1676-01-01",
      endDate: "1716-11-14",
      summary: {
        en: "Primary intellectual advisor to the Dukes of Brunswick-Lüneburg and later the Elector of Hanover.",
        fr: "Principal conseiller intellectuel des ducs de Brunswick-Lüneburg et plus tard de l'électeur de Hanovre.",
      },
      highlights: [
        {
          content: {
            en: "Maintained the ducal library with obsessive precision",
            fr: "Maintenu la bibliothèque ducale avec une précision obsessionnelle",
          },
          tags: ["academic", "organization", "precision"],
        },
        {
          content: {
            en: "Wrote family genealogy tracing Hanover lineage to Italian nobility",
            fr: "Rédigé la généalogie familiale retraçant la lignée de Hanovre jusqu'à la noblesse italienne",
          },
          tags: ["research", "genealogy", "nobility", "diplomacy"],
        },
        {
          content: {
            en: "Provided mathematical consultation on mining operations",
            fr: "Fourni des consultations mathématiques sur les opérations minières",
          },
          tags: ["mathematics", "applied-science", "consulting", "mining"],
        },
        {
          content: {
            en: "Diplomatically advised on succession matters (helped secure British throne for Hanover)",
            fr: "Conseillé diplomatiquement sur les questions de succession (aidé à sécuriser le trône britannique pour Hanovre)",
          },
          tags: [
            "diplomacy",
            "politics",
            "succession",
            "british-throne",
            "strategic-thinking",
          ],
        },
      ],
      tags: [
        "court-position",
        "long-term",
        "senior-role",
        "mathematics",
        "diplomacy",
      ],
    },
  ],
};

export default data;

