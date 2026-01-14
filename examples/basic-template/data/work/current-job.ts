import { CVDataFragment } from "../../../../src/types/index.js";

const data: CVDataFragment = {
  work: [
    {
      name: "Your Company Name",
      position: {
        en: "Your Job Title",
        fr: "Votre Titre de Poste",
      },
      url: "https://company-website.com",
      startDate: "2022-01-01",
      // endDate: "2024-12-31", // Leave empty for current position
      summary: {
        en: "Brief description of your role and main responsibilities.",
        fr: "Brève description de votre rôle et principales responsabilités.",
      },
      highlights: [
        {
          content: {
            en: "Achieved specific measurable result (e.g., improved performance by 30%)",
            fr: "Obtenu un résultat mesurable spécifique (ex: amélioré les performances de 30%)",
          },
          tags: ["achievement", "performance", "senior"],
        },
        {
          content: {
            en: "Led team initiative or project with clear outcomes",
            fr: "Dirigé une initiative d'équipe ou un projet avec des résultats clairs",
          },
          tags: ["leadership", "teamwork", "senior"],
        },
        {
          content: {
            en: "Implemented new technology or process improvement",
            fr: "Mis en place une nouvelle technologie ou amélioration de processus",
          },
          tags: ["technical", "innovation", "process-improvement"],
        },
      ],
      tags: ["current", "senior", "full-time"],
    },
  ],
};

export default data;

