import { createQuery } from "../../src/builders/index.js";
const DEFAULT_THEME = "elegant";
export const cvQueries = [
  // Universal polymath CV showcasing all aspects
  createQuery("leibniz-universal-en", "en")
    .include("polymath", "mathematics", "philosophy", "diplomacy")
    .theme(DEFAULT_THEME)
    .build(),
  createQuery("leibniz-universal-fr", "fr")
    .include("polymath", "mathematics", "philosophy", "diplomacy")
    .theme(DEFAULT_THEME)
    .build(),
  // Mathematics-focused CV
  createQuery("leibniz-mathematician-en", "en")
    .include("mathematics", "innovation", "calculus", "binary", "logic")
    .exclude("diplomacy", "politics")
    .theme(DEFAULT_THEME)
    .build(),
  // Philosophy-focused CV
  createQuery("leibniz-philosopher-en", "en")
    .include(
      "philosophy",
      "metaphysics",
      "theodicy",
      "logic",
      "possible-worlds",
    )
    .exclude("applied-science", "mining")
    .theme(DEFAULT_THEME)
    .build(),
  // Early academic career focused CV
  createQuery("leibniz-academic-en", "en")
    .include(
      "academic",
      "education",
      "law",
      "young-achievement",
      "intellectual-development",
    )
    .theme(DEFAULT_THEME)
    .build(),
  // Modern CV showing relevance to computer science
  createQuery("leibniz-modern-relevance-en", "en")
    .include(
      "binary",
      "computers",
      "innovation",
      "modern-relevance",
      "automation",
    )
    .override({
      summary: {
        en: "17th-century polymath whose binary system and calculating machine concepts laid the foundation for modern computing. Seeking opportunities to apply systematic thinking and innovative problem-solving to contemporary challenges.",
      },
      email: "g.leibniz@modernworld.com",
      phone: "+1-555-BINARY",
    })
    .theme(DEFAULT_THEME)
    .build(),
];
export default cvQueries;
//# sourceMappingURL=cv-definitions.js.map

