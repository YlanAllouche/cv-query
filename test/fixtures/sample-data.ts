import { CVData, CVQuery } from "../../src/types/index.js";
import { QueryBuilder } from "../../src/builders/index.js";

export const sampleCVData: CVData = {
  basics: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567",
    summary: {
      en: "Experienced software engineer with 5+ years in full-stack development",
      fr: "Ingénieur logiciel expérimenté avec plus de 5 ans en développement full-stack",
    },
    location: {
      city: "San Francisco",
      countryCode: "US",
      region: "CA",
    },
    profiles: [
      {
        network: "LinkedIn",
        username: "johndoe",
        url: "https://linkedin.com/in/johndoe",
      },
    ],
  },
  letter: {
    recipient: {
      company: {
        en: "Tech Corp",
        fr: "Tech Corp",
      },
      name: {
        en: "Jane Smith",
        fr: "Jane Smith",
      },
      title: {
        en: "Hiring Manager",
        fr: "Responsable du recrutement",
      },
    },
    subject: {
      en: "Application for Senior Full-Stack Developer Position",
      fr: "Candidature pour le poste de Développeur Full-Stack Senior",
    },
    content: {
      opening: {
        en: "I am writing to express my interest in the Senior Full-Stack Developer position at Tech Corp.",
        fr: "J'écris pour exprimer mon intérêt pour le poste de Développeur Full-Stack Senior chez Tech Corp.",
      },
      body: [
        {
          content: {
            en: "With over 5 years of experience in full-stack development, I have successfully led multiple projects from conception to deployment.",
            fr: "Avec plus de 5 ans d'expérience en développement full-stack, j'ai dirigé avec succès plusieurs projets de la conception au déploiement.",
          },
          tags: ["senior", "leadership", "fullstack"],
        },
        {
          content: {
            en: "I specialize in React and Node.js technologies, having built scalable applications serving thousands of users.",
            fr: "Je me spécialise dans les technologies React et Node.js, ayant construit des applications évolutives servant des milliers d'utilisateurs.",
          },
          tags: ["react", "nodejs", "senior"],
        },
        {
          content: {
            en: "During my tenure at Startup Corp, I gained valuable experience in fast-paced environments and agile methodologies.",
            fr: "Pendant mon mandat chez Startup Corp, j'ai acquis une expérience précieuse dans les environnements rapides et les méthodologies agiles.",
          },
          tags: ["junior", "agile"],
        },
      ],
      closing: {
        en: "I would welcome the opportunity to discuss how my skills and experience align with Tech Corp's needs.",
        fr: "Je serais ravi de discuter de la façon dont mes compétences et mon expérience s'alignent sur les besoins de Tech Corp.",
      },
    },
    sender: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-123-4567",
    },
    date: "2024-01-15",
    tags: ["senior", "fullstack", "leadership"],
  },
  work: [
    {
      name: "Tech Innovations Inc.",
      position: {
        en: "Senior Full-Stack Developer",
        fr: "Développeur Full-Stack Senior",
      },
      startDate: "2020-03-01",
      endDate: "2024-12-31",
      summary: {
        en: "Lead development of scalable web applications using modern technologies",
        fr: "Direction du développement d'applications web évolutives utilisant des technologies modernes",
      },
      highlights: [
        {
          content: {
            en: "Architected and implemented microservices serving 100k+ users",
            fr: "Architecture et implémentation de microservices servant plus de 100k utilisateurs",
          },
          tags: ["senior", "architecture", "backend"],
        },
        {
          content: {
            en: "Mentored junior developers and established coding standards",
            fr: "Mentorat des développeurs juniors et établissement des normes de codage",
          },
          tags: ["leadership", "mentoring", "senior"],
        },
      ],
      tags: ["fullstack", "senior", "leadership", "react", "nodejs"],
    },
    {
      name: "Startup Corp",
      position: {
        en: "Junior Developer",
        fr: "Développeur Junior",
      },
      startDate: "2018-06-01",
      endDate: "2020-02-28",
      summary: {
        en: "Built responsive web applications and learned modern development practices",
        fr: "Construction d'applications web responsives et apprentissage des pratiques de développement modernes",
      },
      highlights: [
        {
          content: {
            en: "Developed responsive React components",
            fr: "Développement de composants React responsives",
          },
          tags: ["frontend", "react", "junior"],
        },
      ],
      tags: ["junior", "frontend", "react"],
    },
  ],
  skills: [
    {
      name: {
        en: "JavaScript/TypeScript",
        fr: "JavaScript/TypeScript",
      },
      level: {
        en: "Expert",
        fr: "Expert",
      },
      keywords: [
        { en: "React", fr: "React" },
        { en: "Node.js", fr: "Node.js" },
        { en: "TypeScript", fr: "TypeScript" },
      ],
      tags: ["frontend", "backend", "javascript", "typescript"],
    },
    {
      name: {
        en: "Python",
        fr: "Python",
      },
      level: {
        en: "Intermediate",
        fr: "Intermédiaire",
      },
      keywords: [
        { en: "Django", fr: "Django" },
        { en: "FastAPI", fr: "FastAPI" },
      ],
      tags: ["backend", "python"],
    },
  ],
  projects: [
    {
      name: {
        en: "E-Commerce Platform",
        fr: "Plateforme E-Commerce",
      },
      description: {
        en: "Full-stack e-commerce solution with React frontend and Node.js backend",
        fr: "Solution e-commerce full-stack avec frontend React et backend Node.js",
      },
      highlights: [
        {
          content: {
            en: "Implemented secure payment processing handling $500k+ monthly transactions",
            fr: "Implémentation du traitement sécurisé des paiements gérant plus de 500k$ de transactions mensuelles",
          },
          tags: ["fullstack", "security", "payments"],
        },
      ],
      keywords: [
        { en: "React", fr: "React" },
        { en: "Node.js", fr: "Node.js" },
        { en: "MongoDB", fr: "MongoDB" },
      ],
      startDate: "2022-01-01",
      endDate: "2023-06-01",
      url: "https://github.com/johndoe/ecommerce-platform",
      tags: ["fullstack", "react", "nodejs", "mongodb", "senior"],
    },
  ],
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
      tags: ["communication", "universal"],
    },
    {
      language: {
        en: "French",
        fr: "Français",
      },
      fluency: {
        en: "Fluent",
        fr: "Courant",
      },
      tags: ["communication", "international"],
    },
  ],
  education: [
    {
      institution: {
        en: "University of Technology",
        fr: "Université de Technologie",
      },
      area: {
        en: "Computer Science",
        fr: "Informatique",
      },
      studyType: {
        en: "Bachelor of Science",
        fr: "Licence en Informatique",
      },
      startDate: "2014-09-01",
      endDate: "2018-05-31",
      tags: ["education", "computer-science"],
    },
  ],
  tags: ["senior", "fullstack", "leadership"],
};

export const sampleQueries: CVQuery[] = [
  QueryBuilder.create("general", "en").build(),
  QueryBuilder.create("senior-developer", "en")
    .include("senior", "leadership")
    .exclude("junior")
    .build(),
  QueryBuilder.create("frontend-specialist", "en")
    .include("frontend", "react")
    .exclude("backend", "python")
    .build(),
  QueryBuilder.create("junior-developer", "en")
    .include("junior")
    .exclude("senior")
    .build(),
  QueryBuilder.create("cv-generale", "fr").build(),
];

export const sampleQuery = QueryBuilder.create("test-query", "en")
  .include("senior", "react")
  .exclude("junior")
  .build();

