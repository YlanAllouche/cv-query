import { CVDataFragment } from "../../../src/types/index.js";

const data: CVDataFragment = {
  basics: {
    name: "Gottfried Wilhelm Leibniz",
    label: {
      en: "Universal Genius & Last Renaissance Man",
      fr: "Génie Universel et Dernier Homme de la Renaissance",
    },
    email: "g.leibniz@hanover.court",
    phone: "+49-511-CALCULUS",
    url: "https://leibniz.org",
    location: {
      address: "Royal Court of Hanover",
      city: "Hanover",
      region: "Lower Saxony",
      postalCode: "30159",
      countryCode: "DE",
    },
    profiles: [
      {
        network: "Royal Society of London",
        username: "leibniz_gw",
        url: "https://royalsociety.org/people/gottfried-leibniz/",
      },
      {
        network: "Berlin Academy of Sciences",
        username: "founder_president",
        url: "https://bbaw.de",
      },
    ],
  },
  languages: [
    {
      language: {
        en: "Latin",
        fr: "Latin",
      },
      fluency: {
        en: "Native (academic)",
        fr: "Natif (académique)",
      },
      tags: ["polymath", "academic", "universal"],
    },
    {
      language: {
        en: "German",
        fr: "Allemand",
      },
      fluency: {
        en: "Native",
        fr: "Natif",
      },
      tags: ["polymath", "academic", "universal"],
    },
    {
      language: {
        en: "French",
        fr: "Français",
      },
      fluency: {
        en: "Fluent (court language)",
        fr: "Courant (langue de cour)",
      },
      tags: ["polymath", "academic", "universal", "diplomacy"],
    },
    {
      language: {
        en: "Italian",
        fr: "Italien",
      },
      fluency: {
        en: "Fluent",
        fr: "Courant",
      },
      tags: ["polymath", "academic", "universal"],
    },
    {
      language: {
        en: "Mathematical Notation",
        fr: "Notation Mathématique",
      },
      fluency: {
        en: "Inventor",
        fr: "Inventeur",
      },
      tags: ["mathematics", "innovation", "genius"],
    },
  ],
  tags: ["leibniz", "polymath", "universal-genius"],
};

export default data;
