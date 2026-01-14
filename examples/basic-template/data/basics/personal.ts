import { CVDataFragment } from "../../../../src/types/index.js";

const data: CVDataFragment = {
  basics: {
    name: "Your Name",
    label: {
      en: "Your Professional Title",
      fr: "Votre Titre Professionnel",
    },
    email: "your.email@example.com",
    phone: "+1-555-YOUR-PHONE",
    url: "https://yourwebsite.com",
    summary: {
      en: "A brief summary of your professional background and key strengths. Keep it concise but impactful.",
      fr: "Un bref résumé de votre parcours professionnel et de vos atouts clés. Restez concis mais percutant.",
    },
    location: {
      city: {
        en: "Your City",
        fr: "Votre Ville",
      },
      region: {
        en: "Your State/Province",
        fr: "Votre État/Province",
      },
      countryCode: "US", // or your country code
    },
    profiles: [
      {
        network: "LinkedIn",
        username: "yourlinkedin",
        url: "https://linkedin.com/in/yourlinkedin",
      },
      {
        network: "GitHub",
        username: "yourgithub",
        url: "https://github.com/yourgithub",
      },
    ],
  },
  languages: [
    {
      language: {
        en: "English",
        fr: "Anglais",
      },
      fluency: {
        en: "Native",
        fr: "Natif",
      },
      tags: ["professional", "fluent"],
    },
  ],
  tags: ["template-example"],
};

export default data;

