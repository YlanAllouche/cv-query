import { CVQuery, QueryBuilder } from "../../src/index.js";

export const cvQueries: CVQuery[] = [
  // General professional CV
  ...QueryBuilder.create("professional", ["en", "fr"])
    .summaryId("professional-general")
    .include("professional", "senior", "technical")
    .exclude("outdated", "junior")
    .buildMulti(),

  // Senior/Leadership focused CV
  QueryBuilder.create("senior-lead", "en")
    .summaryId("senior-leader")
    .include("senior", "leadership", "management")
    .exclude("junior", "entry-level")
    .build(),

  // Technical/Development focused CV
  QueryBuilder.create("tech-specialist", "en")
    .summaryId("tech-specialist")
    .include("programming", "technical", "web-development")
    .exclude("management", "business")
    .build(),

  // Custom CV with overrides for specific applications
  QueryBuilder.create("startup-application", "en")
    .summaryId("startup-innovator")
    .include("innovation", "technical", "senior")
    .override({
      phone: "+1-555-STARTUP",
    })
    .build(),
];

export default cvQueries;

