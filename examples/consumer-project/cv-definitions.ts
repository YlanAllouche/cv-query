import { CVQuery, QueryBuilder } from "../../src/index.js";

const DEFAULT_THEME = "elegant";

export const cvQueries: CVQuery[] = [
  ...QueryBuilder.create("alice-professional", ["en", "fr"])
    .summaryId("professional")
    .include("senior", "fullstack", "professional")
    .exclude("junior", "intern")
    .theme(DEFAULT_THEME)
    .buildMulti(),

  QueryBuilder.create("alice-tech-lead", "en")
    .summaryId("tech-lead")
    .include("leadership", "senior", "team-management", "architecture")
    .exclude("junior")
    .theme(DEFAULT_THEME)
    .build(),

  QueryBuilder.create("alice-startup-application", "en")
    .summaryId("startup")
    .include("fullstack", "performance", "innovation")
    .override({
      email: "alice.startup@gmail.com",
      phone: "+1-555-STARTUP",
    })
    .theme(DEFAULT_THEME)
    .build(),
];

export default cvQueries;

