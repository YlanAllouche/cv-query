import { CVDataFragment } from "../../../src/types/index.js";

const data: CVDataFragment = {
  work: [
    {
      name: "University of Altdorf",
      position: {
        en: "Doctoral Candidate & Rising Star",
        fr: "Doctorant et Étoile Montante",
      },
      url: "https://altdorf.university",
      startDate: "1666-01-01",
      endDate: "1667-12-31",
      summary: {
        en: "Completed doctorate in law at age 20, declined professorship offer because the world was too big to settle down.",
        fr: "Doctorat en droit accompli à 20 ans, refusé l'offre de professorat car le monde était trop grand pour se poser.",
      },
      highlights: [
        {
          content: {
            en: "Youngest doctoral graduate in university history",
            fr: "Plus jeune diplômé de doctorat de l'histoire de l'université",
          },
          tags: ["achievement", "young-genius", "academic-excellence"],
        },
        {
          content: {
            en: "Dissertation on legal reasoning impressed faculty so much they offered immediate tenure",
            fr: "Dissertation sur le raisonnement juridique a tellement impressionné la faculté qu'elle a offert la titularisation immédiate",
          },
          tags: ["legal-reasoning", "academic-excellence", "impressive-work"],
        },
        {
          content: {
            en: "Politely declined to pursue broader intellectual adventures",
            fr: "Poliment refusé pour poursuivre des aventures intellectuelles plus larges",
          },
          tags: ["ambition", "intellectual-curiosity", "world-exploration"],
        },
      ],
      tags: [
        "academic",
        "law",
        "young-achievement",
        "intellectual-development",
      ],
    },
  ],
};

export default data;
