import { CVDataFragment } from "../../../../src/types/index.js";

const data: CVDataFragment = {
  letter: {
    recipient: {
      company: "Tech Innovations Inc.",
      name: "Sarah Johnson",
      title: "Hiring Manager",
      address: {
        street: "123 Innovation Drive",
        city: "San Francisco",
        postalCode: "94105",
        region: "CA",
        countryCode: "US",
      },
    },
    subject: "Application for Senior Software Engineer Position",
    content: {
      opening: "Dear Hiring Manager,",
      body: [
        {
          content: {
            en: "I am writing to express my strong interest in the Senior Software Engineer position at Tech Innovations Inc. With over 8 years of experience in full-stack development and a passion for building scalable, user-centric applications, I am excited about the opportunity to contribute to your innovative team.",
            fr: "J'écris pour exprimer mon vif intérêt pour le poste d'ingénieur logiciel senior chez Tech Innovations Inc. Avec plus de 8 ans d'expérience en développement full-stack et une passion pour la création d'applications évolutives et centrées sur l'utilisateur, je suis enthousiaste à l'idée de contribuer à votre équipe innovante.",
          },
          tags: ["general", "senior"],
        },
        {
          content: {
            en: "In my previous role at Global Solutions, I led the development of a microservices architecture that improved system performance by 40% and reduced deployment time from weeks to hours. I have extensive experience with modern technologies including React, Node.js, and cloud platforms like AWS.",
            fr: "Dans mon rôle précédent chez Global Solutions, j'ai dirigé le développement d'une architecture de microservices qui a amélioré les performances du système de 40% et réduit le temps de déploiement de semaines à heures. J'ai une expérience étendue avec les technologies modernes incluant React, Node.js, et les plateformes cloud comme AWS.",
          },
          tags: ["technical", "leadership", "senior"],
        },
        {
          content: {
            en: "What particularly attracts me to Tech Innovations is your commitment to cutting-edge technology and your focus on solving real-world problems. I am eager to bring my expertise in team leadership and technical innovation to help drive your next generation of products.",
            fr: "Ce qui m'attire particulièrement chez Tech Innovations, c'est votre engagement envers les technologies de pointe et votre concentration sur la résolution de problèmes concrets. Je suis impatient d'apporter mon expertise en leadership d'équipe et en innovation technique pour aider à développer votre prochaine génération de produits.",
          },
          tags: ["innovation", "leadership"],
        },
        {
          content: {
            en: "I would welcome the opportunity to discuss how my background and skills align with your needs. Thank you for considering my application.",
            fr: "J'aimerais avoir l'opportunité de discuter de la façon dont mon parcours et mes compétences correspondent à vos besoins. Merci d'avoir pris en compte ma candidature.",
          },
          tags: ["general"],
        },
      ],
      closing: "Best regards,",
    },
    sender: {
      name: "Your Name",
      email: "your.email@example.com",
      phone: "+1-555-YOUR-PHONE",
      location: {
        city: "Your City",
        region: "Your State",
        countryCode: "US",
      },
      url: "https://yourwebsite.com",
    },
    date: "2024-01-15",
    tags: ["general", "professional"],
  },
};

export default data;

