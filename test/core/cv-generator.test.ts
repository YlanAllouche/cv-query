import { describe, it, expect } from 'vitest';
import { CVGenerator } from '../../src/core/cv-generator.js';
import { sampleCVData, sampleQuery } from '../fixtures/sample-data.js';
import { QueryBuilder } from '../../src/builders/query-builder.js';

describe('CVGenerator', () => {
  const generator = new CVGenerator();

  describe('generate', () => {
    it('should convert CVData to JsonResume format', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result).toHaveProperty('$schema');
      expect(result).toHaveProperty('meta');
      expect(result.meta?.language).toBe('en');
      expect(result.basics?.name).toBe('John Doe');
      expect(result.basics?.email).toBe('john.doe@example.com');
    });

    it('should handle work experience conversion', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result.work).toBeDefined();
      expect(result.work).toHaveLength(1); // Only senior work, junior is excluded
      expect(result.work?.[0].name).toBe('Tech Innovations Inc.');
      expect(result.work?.[0].position).toBe('Senior Full-Stack Developer');
    });

    it('should handle skills conversion', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result.skills).toBeUndefined(); // No skills match the filter
    });

    it('should handle projects conversion', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result.projects).toBeDefined();
      expect(result.projects).toHaveLength(1);
      expect(result.projects?.[0].name).toBe('E-Commerce Platform');
    });

    it('should handle education conversion', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result.education).toBeUndefined(); // Education doesn't match filter
    });

    it('should handle languages conversion', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result.languages).toBeUndefined(); // Languages don't match filter
    });

    it('should handle localization correctly', () => {
      const frenchQuery = QueryBuilder.create('test', 'fr').build();
      const result = generator.generate(sampleCVData, frenchQuery);

      expect(result.meta?.language).toBe('fr');
      // Check that French localization is attempted (may fall back to English if French not available)
      expect(result.basics?.summary).toBeDefined();
    });

    it('should handle highlights conversion', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result.work?.[0].highlights).toBeDefined();
      expect(result.work?.[0].highlights).toHaveLength(2);
      expect(result.work?.[0].highlights?.[0]).toBe('Architected and implemented microservices serving 100k+ users');
    });

    it('should handle profiles conversion', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result.basics?.profiles).toBeDefined();
      expect(result.basics?.profiles).toHaveLength(1);
      expect(result.basics?.profiles?.[0].network).toBe('LinkedIn');
    });

    it('should handle location conversion', () => {
      const result = generator.generate(sampleCVData, sampleQuery);

      expect(result.basics?.location).toBeDefined();
      expect(result.basics?.location?.city).toBe('San Francisco');
      expect(result.basics?.location?.countryCode).toBe('US');
    });
  });

  describe('generateFacts', () => {
    it('should generate array of localized fact strings', () => {
      const dataWithFacts = {
        ...sampleCVData,
        facts: [
          { content: { en: 'Fact 1', fr: 'Fait 1' }, tags: ['senior'] },
          { content: { en: 'Fact 2', fr: 'Fait 2' }, tags: ['senior'] }
        ]
      };
      const result = generator.generateFacts(dataWithFacts, sampleQuery);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('string');
      expect(result[0]).toBe('Fact 1');
    });

    it('should filter facts based on query tags', () => {
      const dataWithFacts = {
        ...sampleCVData,
        facts: [
          { content: { en: 'Senior fact', fr: 'Fait senior' }, tags: ['senior'] },
          { content: { en: 'Junior fact', fr: 'Fait junior' }, tags: ['junior'] }
        ]
      };
      const result = generator.generateFacts(dataWithFacts, sampleQuery);

      // Should only include facts matching the senior tag
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBe('Senior fact');
    });

    it('should localize facts to requested language', () => {
      const frenchQuery = QueryBuilder.create('test', 'fr').build();
      const result = generator.generateFacts(sampleCVData, frenchQuery);

      // Should return array of strings, language-specific if available
      expect(Array.isArray(result)).toBe(true);
      expect(result.every(fact => typeof fact === 'string')).toBe(true);
    });

    it('should strip tags and metadata from facts', () => {
      const result = generator.generateFacts(sampleCVData, sampleQuery);

      // Result should be plain strings with no tag information
      result.forEach(fact => {
        expect(typeof fact).toBe('string');
        expect(fact).not.toHaveProperty('tags');
        expect(fact).not.toHaveProperty('content');
      });
    });

    it('should handle empty facts gracefully', () => {
      const dataWithoutFacts = {
        ...sampleCVData,
        facts: []
      };

      const result = generator.generateFacts(dataWithoutFacts, sampleQuery);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('applyOverrides', () => {
    it('should apply query overrides to basics', () => {
      const queryWithOverrides = QueryBuilder.create('test')
        .override({
          email: 'override@example.com',
          phone: '+1-555-OVERRIDE'
        })
        .build();

      const result = generator.generate(sampleCVData, queryWithOverrides);

      expect(result.basics?.email).toBe('override@example.com');
      expect(result.basics?.phone).toBe('+1-555-OVERRIDE');
    });

    it('should merge location overrides', () => {
      const queryWithOverrides = QueryBuilder.create('test')
        .override({
          location: {
            city: 'Override City'
          }
        })
        .build();

      const result = generator.generate(sampleCVData, queryWithOverrides);

      expect(result.basics?.location?.city).toBe('Override City');
      expect(result.basics?.location?.countryCode).toBe('US'); // Preserved original
    });

    it('should handle overrides when no basics exist', () => {
      const dataWithoutBasics = { ...sampleCVData };
      delete dataWithoutBasics.basics;

      const queryWithOverrides = QueryBuilder.create('test')
        .override({
          email: 'new@example.com',
          phone: '+1-555-NEW'
        })
        .build();

      const result = generator.generate(dataWithoutBasics, queryWithOverrides);

      expect(result.basics?.email).toBe('new@example.com');
      expect(result.basics?.phone).toBe('+1-555-NEW');
    });
  });

  describe('localization', () => {
    it('should default to English when language not found', () => {
      const dataWithLimitedLocalization = {
        ...sampleCVData,
        basics: {
          ...sampleCVData.basics,
          summary: {
            en: 'English summary',
            // No French version
          }
        }
      };

      const frenchQuery = QueryBuilder.create('test', 'fr').build();
      const result = generator.generate(dataWithLimitedLocalization, frenchQuery);

      // Should fall back to English when French is not available
      expect(result.basics?.summary).toBe('English summary');
    });

    it('should handle string values in localized fields', () => {
      const dataWithStringValues = {
        ...sampleCVData,
        basics: {
          ...sampleCVData.basics,
          summary: 'Simple string summary' // Not localized object
        }
      };

      const result = generator.generate(dataWithStringValues, sampleQuery);

      expect(result.basics?.summary).toBe('Simple string summary');
    });
  });

  describe('edge cases', () => {
    it('should handle empty data gracefully', () => {
      const emptyData = {
        ...sampleCVData,
        work: [],
        skills: [],
        projects: [],
        education: [],
        languages: []
      };

      const result = generator.generate(emptyData, sampleQuery);

      expect(result.work).toBeUndefined(); // Empty arrays become undefined
      expect(result.skills).toBeUndefined();
      expect(result.projects).toBeUndefined();
      expect(result.education).toBeUndefined();
      expect(result.languages).toBeUndefined();
    });

    it('should handle missing optional fields', () => {
      const minimalData = {
        basics: { name: 'Test User' }
      };

      const result = generator.generate(minimalData, sampleQuery);

      expect(result.basics?.name).toBe('Test User');
      expect(result.work).toBeUndefined();
    });
  });
});