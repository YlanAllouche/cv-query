# Leibniz Example

This example demonstrates the full capabilities of systematic-cv using the biographical data of Gottfried Wilhelm Leibniz, the 17th-century polymath.

## Features Demonstrated

- **Multiple CV variants** from the same data source
- **Tag-based filtering** to show different aspects of a career
- **Localization** (English and French)
- **Override functionality** for customizing specific queries
- **Facts section** with tagged interesting information
- **Dual JSON formats** (.resume.json and .matrix.json)

## CV Variants Generated

1. **leibniz-universal-en/fr** - Complete polymath showcase
2. **leibniz-mathematician-en** - Mathematics and innovation focus
3. **leibniz-philosopher-en** - Philosophy and metaphysics focus  
4. **leibniz-academic-en** - Early academic career
5. **leibniz-modern-relevance-en** - Modern computing relevance with overrides

## Data Structure

```
leibniz/
├── basics/personal.ts          # Contact info, summary, languages
├── work/                       # Professional positions
│   ├── house-of-hanover.ts     # Court mathematician role
│   └── freelance.ts            # University positions
├── skills/technical.ts         # Mathematics, Philosophy, Diplomacy
├── education/university.ts     # Leipzig and Altdorf education
├── projects/vitaematrix.ts     # Binary system project
├── facts/interesting-facts.ts  # Notable achievements and quirks
└── cv-definitions.ts          # Query configurations
```

## Running the Example

```bash
# From the root directory
npm run example:leibniz

# Or directly
cd examples/leibniz
tsx build.ts
```

## Example Output

To see what the generated output looks like, run:

```bash
# Generate example output (creates output/ folder)
npx systematic-cv build --output ./output --input ./ --queries ./cv-definitions.ts

# View the results
open output/index.html
```

This will create a structured output with:
- **Role-based PDF folders**: `output/pdf/leibniz-universal/`, `output/pdf/leibniz-mathematician/`, etc.
- **Proper naming**: `Gottfried Wilhelm Leibniz - Resume.pdf`
- **Awesomish theme**: Modern, professional styling for all PDFs
- **Index page**: Easy navigation to all generated variants
- **Multiple variants**: 6 different CV focuses from the same data source

## Key Learning Points

### Tag Strategy
- **Broad to specific**: `polymath` → `mathematics` → `calculus`
- **Experience level**: `academic`, `court-position`, `senior-role`
- **Domain tags**: `mathematics`, `philosophy`, `diplomacy`
- **Innovation tags**: `binary`, `innovation`, `genius`

### Query Patterns
```typescript
// Focused expertise query
createQuery("leibniz-mathematician-en", "en")
  .include("mathematics", "innovation", "calculus")
  .exclude("diplomacy", "politics")

// Modern relevance with overrides
createQuery("leibniz-modern-relevance-en", "en")
  .include("binary", "computers", "automation")
  .override({
    email: "g.leibniz@modernworld.com",
    summary: "17th-century polymath whose concepts laid foundation for modern computing..."
  })
```

### Localization Examples
```typescript
{
  content: {
    en: "Invented calculus independently from Newton but published first",
    fr: "A inventé le calcul infinitésimal indépendamment de Newton mais l'a publié en premier"
  },
  tags: ["mathematics", "innovation", "controversy"]
}
```

This example shows how systematic-cv can handle complex, multi-faceted careers with rich historical data, making it perfect for modern professionals with diverse skill sets and experiences.