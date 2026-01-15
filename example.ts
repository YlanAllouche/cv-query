const data = {
  skills: [
    {
      name: "Frontend Development",
      keywords: [
        { content: "React", tags: ["dev-role", "qa-role"] }, // Appears in dev + qa
        { content: "Svelte", tags: ["dev-role"] }, // Only appears in dev
        { content: "Vue", tags: ["dev-role", "data-role"] }, // Appears in dev + data
      ],
      tags: [],
    },
  ],
};
export default data;
