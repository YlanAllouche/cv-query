import { describe, it, expect } from 'vitest';
import { QueryBuilder } from '../../src/builders/query-builder.js';

describe('QueryBuilder', () => {
  describe('constructor', () => {
    it('should create query with default language', () => {
      const builder = new QueryBuilder('test-query');
      const query = builder.build();

      expect(query.name).toBe('test-query');
      expect(query.language).toBe('en');
      expect(query.tags).toEqual({});
    });

    it('should create query with specified language', () => {
      const builder = new QueryBuilder('test-query', 'fr');
      const query = builder.build();

      expect(query.name).toBe('test-query');
      expect(query.language).toBe('fr');
    });
  });

  describe('static create', () => {
    it('should create QueryBuilder instance', () => {
      const builder = QueryBuilder.create('test-query', 'en');
      expect(builder).toBeInstanceOf(QueryBuilder);

      const query = builder.build();
      expect(query.name).toBe('test-query');
      expect(query.language).toBe('en');
    });
  });

  describe('include', () => {
    it('should add include tags', () => {
      const query = QueryBuilder.create('test')
        .include('react', 'typescript')
        .build();

      expect(query.tags.include).toEqual(['react', 'typescript']);
    });

    it('should accumulate include tags', () => {
      const query = QueryBuilder.create('test')
        .include('react')
        .include('typescript', 'nodejs')
        .build();

      expect(query.tags.include).toEqual(['react', 'typescript', 'nodejs']);
    });

    it('should return QueryBuilder for chaining', () => {
      const result = QueryBuilder.create('test').include('react');
      expect(result).toBeInstanceOf(QueryBuilder);
    });
  });

  describe('exclude', () => {
    it('should add exclude tags', () => {
      const query = QueryBuilder.create('test')
        .exclude('junior', 'intern')
        .build();

      expect(query.tags.exclude).toEqual(['junior', 'intern']);
    });

    it('should accumulate exclude tags', () => {
      const query = QueryBuilder.create('test')
        .exclude('junior')
        .exclude('intern')
        .build();

      expect(query.tags.exclude).toEqual(['junior', 'intern']);
    });
  });

  describe('requireAll', () => {
    it('should set requireAll to true by default', () => {
      const query = QueryBuilder.create('test')
        .requireAll()
        .build();

      expect(query.tags.requireAll).toBe(true);
    });

    it('should set requireAll to specified value', () => {
      const query = QueryBuilder.create('test')
        .requireAll(false)
        .build();

      expect(query.tags.requireAll).toBe(false);
    });
  });

  describe('language', () => {
    it('should set language', () => {
      const query = QueryBuilder.create('test')
        .language('fr')
        .build();

      expect(query.language).toBe('fr');
    });
  });

  describe('theme', () => {
    it('should set theme', () => {
      const query = QueryBuilder.create('test')
        .theme('elegant')
        .build();

      expect(query.theme).toBe('elegant');
    });
  });

  describe('override', () => {
    it('should set overrides', () => {
      const overrides = {
        email: 'test@example.com',
        phone: '+1-555-TEST'
      };

      const query = QueryBuilder.create('test')
        .override(overrides)
        .build();

      expect(query.overrides).toEqual(overrides);
    });

    it('should merge overrides', () => {
      const query = QueryBuilder.create('test')
        .override({ email: 'test@example.com' })
        .override({ phone: '+1-555-TEST' })
        .build();

      expect(query.overrides).toEqual({
        email: 'test@example.com',
        phone: '+1-555-TEST'
      });
    });
  });

  describe('build', () => {
    it('should return a copy of the query', () => {
      const builder = QueryBuilder.create('test');
      const query1 = builder.build();
      const query2 = builder.build();

      expect(query1).not.toBe(query2); // Different objects
      expect(query1).toEqual(query2); // Same content
    });

    it('should not be affected by subsequent changes', () => {
      const builder = QueryBuilder.create('test');
      const query = builder.build();

      builder.include('react');

      expect(query.tags.include).toBeUndefined();
    });
  });

  describe('method chaining', () => {
    it('should support complex chaining', () => {
      const query = QueryBuilder.create('senior-developer', 'en')
        .include('senior', 'react', 'typescript')
        .exclude('junior', 'intern')
        .requireAll(true)
        .theme('elegant')
        .override({
          email: 'senior@example.com',
          summary: 'Senior developer with expertise in React and TypeScript'
        })
        .build();

      expect(query.name).toBe('senior-developer');
      expect(query.language).toBe('en');
      expect(query.tags.include).toEqual(['senior', 'react', 'typescript']);
      expect(query.tags.exclude).toEqual(['junior', 'intern']);
      expect(query.tags.requireAll).toBe(true);
      expect(query.theme).toBe('elegant');
      expect(query.overrides?.email).toBe('senior@example.com');
    });
  });

  describe('edge cases', () => {
    it('should handle empty tag arrays', () => {
      const query = QueryBuilder.create('test')
        .include()
        .exclude()
        .build();

      expect(query.tags.include).toEqual([]);
      expect(query.tags.exclude).toEqual([]);
    });

    it('should handle undefined overrides', () => {
      const query = QueryBuilder.create('test')
        .override(undefined as any)
        .build();

      expect(query.overrides).toBeUndefined();
    });
  });
});