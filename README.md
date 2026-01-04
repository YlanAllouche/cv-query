# Systematic CV

Type-safe CV generation system with tag-based filtering for creating multiple targeted resume variants from a single data source.

## Overview

Originally built as part of a larger internal ATS system for managing internal promotions and helping younger candidates create tailored CVs and cover letters for different internal roles. This extract focuses on the CV generation pipeline.

**Note:** Cover letter functionality is not fully implemented in this version.

For simpler, personal use cases, consider these alternatives:

- **[jsonresume-theme-awesomish](https://github.com/YlanAllouche/jsonresume-theme-awesomish)** - Personal JSON Resume theme that works standalone for both resumes and cover letters
- **[cv-builder](https://github.com/YlanAllouche/cv-builder)** - Saner and simpler approach relying on the awesomish theme for personal use

## Core Concept

Define your career data once in a structured format, then generate multiple CV variants using tag-based queries:

```typescript
const query = new QueryBuilder()
  .include('skills', ['typescript', 'react'])
  .exclude('projects', ['internal'])
  .locale('en')
  .build();

const cv = generator.generateCV(query);
```

## Installation

```bash
pnpm install @alloucheyl/systematic-cv
```

## Quick Start

See `/examples` for complete implementations:

- **leibniz**: Full-featured example with multiple CV variants
- **basic-template**: Minimal starter template
- **consumer-project**: Integration example

## CLI Usage

```bash
# Build all CV variants
systematic-cv build --input ./data --output ./dist --queries ./cv-definitions.ts

# Development mode with watch
systematic-cv dev --input ./data --output ./dist --queries ./cv-definitions.ts
```

## API

```typescript
import { SystematicCV, QueryBuilder } from '@ylan/systematic-cv';

const generator = new SystematicCV({
  inputDir: './data',
  outputDir: './dist'
});

await generator.build();
```


## Features

- Type-safe data structures and queries
- Tag-based filtering (include/exclude)
- Multi-locale support
- Matrix format for experience entries
- Multiple output formats (HTML, JSON, PDF)
- Watch mode for development
- Full TypeScript support

## License

MIT
