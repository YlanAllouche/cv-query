import { CVQuery, QueryBuilder } from "../../src/index.js";

export const cvQueries: CVQuery[] = [
  // Universal polymath CV showcasing all aspects
  QueryBuilder.create("leibniz-universal", ["en", "fr"])
    .summaryId("polymath-universal")
    .include("polymath", "mathematics", "philosophy", "diplomacy")
    .buildMulti(),

  // Mathematics-focused CV
  QueryBuilder.create("leibniz-mathematician", ["en", "fr"])
    .summaryId("mathematician-focused")
    .include("mathematics", "innovation", "calculus", "binary", "logic")
    .exclude("diplomacy", "politics")
    .buildMulti(),

  // Philosophy-focused CV
  QueryBuilder.create("leibniz-philosopher", ["en", "fr"])
    .summaryId("philosopher-focused")
    .include("philosophy", "metaphysics", "theodicy", "logic", "possible-worlds")
    .exclude("applied-science", "mining")
    .buildMulti(),

  // Early academic career focused CV
  QueryBuilder.create("leibniz-academic", ["en", "fr"])
    .include("academic", "education", "law", "young-achievement", "intellectual-development")
    .buildMulti(),

  // Modern CV showing relevance to computer science
  QueryBuilder.create("leibniz-modern-relevance", "en")
    .summaryId("modern-relevance")
    .include("binary", "computers", "innovation", "modern-relevance", "automation")
    .override({
      email: "g.leibniz@modernworld.com",
      phone: "+1-555-BINARY"
    })
    .build()
].flat();

export default cvQueries;
