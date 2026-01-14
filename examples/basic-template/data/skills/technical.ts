import { CVDataFragment } from "../../../../src/types/index.js";

const data: CVDataFragment = {
  skills: [
    {
      name: {
        en: "Programming Languages",
        fr: "Langages de Programmation",
      },
      level: {
        en: "Advanced",
        fr: "Avancé",
      },
      keywords: ["JavaScript", "TypeScript", "Python", "Java"],
      tags: ["programming", "technical", "senior"],
    },
    {
      name: {
        en: "Web Technologies",
        fr: "Technologies Web",
      },
      level: {
        en: "Advanced",
        fr: "Avancé",
      },
      keywords: ["React", "Node.js", "HTML5", "CSS3", "REST APIs"],
      tags: ["web-development", "frontend", "backend", "senior"],
    },
    {
      name: {
        en: "Tools & Platforms",
        fr: "Outils et Plateformes",
      },
      level: {
        en: "Intermediate",
        fr: "Intermédiaire",
      },
      keywords: ["Git", "Docker", "AWS", "Linux", "CI/CD"],
      tags: ["tools", "devops", "cloud"],
    },
  ],
};

export default data;

