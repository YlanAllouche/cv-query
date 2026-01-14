# Consumer Project Example

This example shows how to use `systematic-cv` as a library in your own project. It demonstrates a typical real-world usage pattern for creating multiple CV variants.

## What This Shows

- **Package Usage**: Using systematic-cv as a dependency
- **Simple Build Script**: Custom build logic using systematic-cv APIs
- **Multiple Variants**: Professional, tech lead, and custom startup application CVs
- **Override Functionality**: Customizing contact info for specific applications
- **Dual Formats**: Both .resume.json and .matrix.json outputs

## Project Structure

```
consumer-project/
├── data/
│   ├── basics/personal.ts      # Alice's basic info
│   └── work/current-company.ts # Current job experience
├── cv-definitions.ts           # CV query definitions
├── build.ts                    # Custom build script
├── package.json                # Project dependencies
└── README.md                   # This file
```

## The Character: Alice Johnson

Alice is a senior full-stack developer with:
- 8+ years experience in web development
- Leadership experience (team of 6)
- Strong technical background in architecture and performance
- Bilingual (English/French)

## CV Variants Generated

1. **alice-professional-en** - Standard professional CV
2. **alice-tech-lead-en** - Leadership and architecture focused
3. **alice-startup-application-en** - Startup-focused with custom overrides
4. **alice-professional-fr** - French version

## Running This Example

```bash
# Install dependencies (if this were a real project)
npm install

# Build all CV variants
npm run build

# Check the results
open dist/index.html
```

## Key Learnings

### 1. Library Usage Pattern
```typescript
import { DataLoader, CVGenerator } from 'systematic-cv';

const loader = new DataLoader('./data');  
const generator = new CVGenerator();
const data = await loader.loadAllData();

for (const query of cvQueries) {
  const resume = generator.generate(data, query);
  // Process resume...
}
```

### 2. Override Functionality
```typescript
createQuery("alice-startup-application-en", "en")
  .override({
    summary: "Custom summary for startup applications...",
    email: "alice.startup@gmail.com",
    phone: "+1-555-STARTUP"
  })
```

### 3. Tag Strategy
- **Experience**: `senior`, `professional`, `leadership`
- **Technical**: `fullstack`, `architecture`, `performance`
- **Process**: `agile`, `team-management`, `ci-cd`
- **Quality**: `testing`, `automation`, `quality`

## Comparison with Leibniz Example

| Aspect | Leibniz Example | Alice Example |
|--------|----------------|---------------|
| Complexity | Complex historical polymath | Modern professional |
| Use Case | Academic/demonstration | Real-world application |
| Data Volume | Rich biographical data | Focused professional data |
| Variants | 6 historical perspectives | 4 targeted applications |
| Overrides | Modern relevance demo | Practical customization |

This example bridges the gap between the comprehensive Leibniz demonstration and practical real-world usage.
