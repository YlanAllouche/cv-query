# Basic Template

A minimal template to get started with systematic-cv. This template provides the essential structure and examples for building your own CV data.

## Getting Started

1. **Copy this template** to your own project
2. **Fill in your data** in the `data/` directory  
3. **Customize queries** in `cv-definitions.ts`
4. **Run the build** to generate your CVs

## Directory Structure

```
basic-template/
├── data/
│   ├── basics/personal.ts      # Your contact info and summary
│   ├── work/current-job.ts     # Work experiences
│   └── skills/technical.ts     # Your skills and expertise
├── cv-definitions.ts           # Define your CV variants
└── README.md                   # This file
```

## Customizing Your Data

### 1. Personal Information (`data/basics/personal.ts`)
- Update name, email, phone, location
- Write compelling summary for both languages
- Add your social/professional profiles

### 2. Work Experience (`data/work/`)
- Create one file per job/company
- Use measurable achievements in highlights
- Tag content appropriately for filtering

### 3. Skills (`data/skills/`)
- Group related skills together
- Include proficiency levels
- Tag by domain (technical, management, etc.)

## Tag Strategy

Tags are the key to systematic-cv's power. Use them strategically:

### Experience Level Tags
- `junior`, `intermediate`, `senior`, `lead`
- `entry-level`, `mid-level`, `management`

### Domain Tags  
- `technical`, `programming`, `web-development`
- `leadership`, `management`, `business`
- `frontend`, `backend`, `fullstack`, `devops`

### Content Type Tags
- `achievement`, `leadership`, `innovation`
- `teamwork`, `process-improvement`, `technical`

## Query Examples

```typescript
// Focus on technical skills
createQuery("developer-en", "en")
  .include("programming", "technical", "web-development")
  .exclude("management", "business")

// Focus on leadership
createQuery("team-lead-en", "en") 
  .include("leadership", "management", "senior")
  .exclude("junior", "entry-level")

// Custom application with overrides
createQuery("google-application-en", "en")
  .include("innovation", "technical", "scale")
  .override({
    summary: "Passionate about building products at massive scale...",
    email: "yourname.jobs@gmail.com"
  })
```

## Building Your CVs

```bash
# Install dependencies
npm install systematic-cv

# Build your CVs
tsx build-script.ts
```

## Example Output

To see what the generated output looks like, run:

```bash
# Generate example output (creates output/ folder)
npx systematic-cv build --output ./output --input ./data --queries ./cv-definitions.ts

# View the results
open output/index.html
```

This will create a structured output with:
- **Role-based PDF folders**: `output/pdf/professional/`, `output/pdf/senior-lead/`, etc.
- **Proper naming**: `Your Name - Resume.pdf`, `Your Name - Cover Letter.pdf`
- **Awesomish theme**: Modern, professional styling for all PDFs
- **Index page**: Easy navigation to all generated variants

## Next Steps

1. **Add more sections**: education, projects, certifications
2. **Create more work entries**: Add all your relevant experience
3. **Refine your tags**: Experiment with different tag combinations
4. **Test queries**: Generate different variants and compare results
5. **Add facts section**: Interesting achievements or notable points

See the `leibniz` example for a comprehensive demonstration of all features.