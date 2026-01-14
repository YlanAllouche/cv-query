import { CVDataFragment } from "../../../../src/types/index.js";

const data: CVDataFragment = {
  work: [
    {
      name: "Tech Innovators Inc",
      position: {
        en: "Senior Full-Stack Developer",
        fr: "Développeuse Full-Stack Senior",
      },
      url: "https://techinnovators.com",
      startDate: "2020-03-01",
      summary: {
        en: "Lead developer for customer-facing web applications serving 50k+ daily users.",
        fr: "Développeuse principale pour les applications web clients desservant 50k+ utilisateurs quotidiens.",
      },
      highlights: [
        {
          content: {
            en: "Architected microservices infrastructure reducing load times by 60%",
            fr: "Architecturé l'infrastructure de microservices réduisant les temps de chargement de 60%",
          },
          tags: ["architecture", "performance", "microservices", "senior"],
        },
        {
          content: {
            en: "Led team of 6 developers in agile development practices",
            fr: "Dirigé une équipe de 6 développeurs dans les pratiques de développement agile",
          },
          tags: ["leadership", "agile", "team-management", "senior"],
        },
        {
          content: {
            en: "Implemented automated testing pipeline increasing code coverage to 95%",
            fr: "Implémenté un pipeline de tests automatisés augmentant la couverture de code à 95%",
          },
          tags: ["testing", "automation", "ci-cd", "quality"],
        },
      ],
      tags: ["current", "senior", "fullstack", "leadership"],
    },
  ],
};

export default data;

