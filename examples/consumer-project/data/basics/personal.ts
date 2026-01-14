import { CVDataFragment } from "../../../../src/types/index.js";

const data: CVDataFragment = {
  basics: {
    name: "Alice Johnson",
    label: {
      en: "Senior Full-Stack Developer",
      fr: "Développeuse Full-Stack Senior",
    },
    email: "alice.johnson@example.com",
    phone: "+1-555-FULLSTACK",
    url: "https://alice-dev.com",
    summary: {
      en: "Experienced full-stack developer with 8+ years building scalable web applications. Passionate about clean code, performance optimization, and team collaboration.",
      fr: "Développeuse full-stack expérimentée avec 8+ ans d'expérience dans la création d'applications web évolutives. Passionnée par le code propre, l'optimisation des performances et la collaboration d'équipe.",
    },
    location: {
      city: "San Francisco",
      region: "California",
      countryCode: "US",
    },
    profiles: [
      {
        network: "LinkedIn",
        username: "alice-johnson-dev",
        url: "https://linkedin.com/in/alice-johnson-dev",
      },
      {
        network: "GitHub",
        username: "alice-codes",
        url: "https://github.com/alice-codes",
      },
    ],
  },
  tags: ["alice-cv"],
};

export default data;

