import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataLoader } from '../../src/core/data-loader.js';
import { readFile, readdir, stat } from 'fs/promises';
import { loadFile, isSupportedFile } from '../../src/utils/dynamic-loader.js';

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  readdir: vi.fn(),
  stat: vi.fn(),
  mkdir: vi.fn(),
  unlink: vi.fn(),
  writeFile: vi.fn()
}));

vi.mock('../../src/utils/dynamic-loader.js', () => ({
  loadFile: vi.fn(),
  isSupportedFile: vi.fn(),
  loadQueries: vi.fn(),
  getFileExtensions: vi.fn()
}));

describe('DataLoader', () => {
  let loader: DataLoader;

  beforeEach(() => {
    vi.clearAllMocks();
    loader = new DataLoader('./test-data');

    // Mock loadFile to return test data
    vi.mocked(loadFile).mockImplementation((filePath: string) => {
      if (filePath.includes('basics.ts')) {
        return Promise.resolve({
          basics: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1-555-123-4567',
            summary: { en: 'Test summary', fr: 'Résumé de test' },
            location: { city: 'Test City', countryCode: 'US', region: 'TC' },
            profiles: [],
            tags: ['test']
          }
        });
      }
      if (filePath.includes('work.ts')) {
        return Promise.resolve({
          work: [{
            name: 'Test Company',
            position: { en: 'Test Position', fr: 'Poste de Test' },
            startDate: '2020-01-01',
            endDate: '2024-01-01',
            summary: { en: 'Test work summary', fr: 'Résumé de travail de test' },
            highlights: [{
              content: { en: 'Test highlight', fr: 'Point fort de test' },
              tags: ['test']
            }],
            tags: ['test']
          }]
        });
      }
      throw new Error(`File not found: ${filePath}`);
    });

    // Mock isSupportedFile to return true for .ts files
    vi.mocked(isSupportedFile).mockImplementation((filename: string) => {
      return filename.endsWith('.ts') || filename.endsWith('.js') || filename.endsWith('.json');
    });
  });

  describe('constructor', () => {
    it('should create loader with default path', () => {
      const defaultLoader = new DataLoader();
      expect(defaultLoader).toBeInstanceOf(DataLoader);
    });

    it('should create loader with custom path', () => {
      expect(loader).toBeInstanceOf(DataLoader);
    });
  });

  describe('loadAllData', () => {
    it('should load and merge data fragments', async () => {
      const mockFragments = [
        { basics: { name: 'John' } },
        { work: [{ name: 'Company A' }] },
        { work: [{ name: 'Company B' }] }
      ];

      vi.mocked(readdir).mockResolvedValue(['basics.ts', 'work.ts'] as any);
      vi.mocked(stat).mockResolvedValue({
        isDirectory: () => false,
        isFile: () => true
      } as any);
      vi.mocked(readFile).mockResolvedValue('export default { basics: { name: "John" } };');

      const loadDataFragmentsSpy = vi.spyOn(loader as any, 'loadDataFragments');
      loadDataFragmentsSpy.mockResolvedValue(mockFragments);

      const result = await loader.loadAllData();

      expect(result.basics?.name).toBe('John');
      expect(result.work).toHaveLength(2);
    });

    it('should inherit global tags', async () => {
      const mockFragments = [
        { basics: { name: 'John' }, tags: ['global'] },
        { work: [{ name: 'Company', tags: ['work'] }] }
      ];

      const loadDataFragmentsSpy = vi.spyOn(loader as any, 'loadDataFragments');
      loadDataFragmentsSpy.mockResolvedValue(mockFragments);

      const result = await loader.loadAllData();

      expect(result.work?.[0].tags).toContain('global');
      expect(result.work?.[0].tags).toContain('work');
    });
  });

  describe('mergeFragments', () => {
    it('should merge basics from multiple fragments', () => {
      const fragments = [
        { basics: { name: 'John', email: 'john@example.com' } },
        { basics: { phone: '+1-555-1234' } }
      ];

      const result = (loader as any).mergeFragments(fragments);

      expect(result.basics?.name).toBe('John');
      expect(result.basics?.email).toBe('john@example.com');
      expect(result.basics?.phone).toBe('+1-555-1234');
    });

    it('should merge work arrays from multiple fragments', () => {
      const fragments = [
        { work: [{ name: 'Company A' }] },
        { work: [{ name: 'Company B' }] }
      ];

      const result = (loader as any).mergeFragments(fragments);

      expect(result.work).toHaveLength(2);
      expect(result.work?.[0].name).toBe('Company A');
      expect(result.work?.[1].name).toBe('Company B');
    });

    it('should handle empty fragments', () => {
      const fragments = [{}, { basics: { name: 'John' } }];

      const result = (loader as any).mergeFragments(fragments);

      expect(result.basics?.name).toBe('John');
    });

    it('should initialize empty arrays for missing sections', () => {
      const fragments = [{ basics: { name: 'John' } }];

      const result = (loader as any).mergeFragments(fragments);

      expect(result.work).toEqual([]);
      expect(result.skills).toEqual([]);
      expect(result.projects).toEqual([]);
      expect(result.education).toEqual([]);
      expect(result.languages).toEqual([]);
    });

    it('should merge all section types', () => {
      const fragments = [
        {
          basics: { name: 'John' },
          work: [{ name: 'Company' }],
          skills: [{ name: 'JavaScript' }],
          projects: [{ name: 'Project' }],
          education: [{ institution: 'University' }],
          languages: [{ language: 'English' }]
        }
      ];

      const result = (loader as any).mergeFragments(fragments);

      expect(result.basics?.name).toBe('John');
      expect(result.work).toHaveLength(1);
      expect(result.skills).toHaveLength(1);
      expect(result.projects).toHaveLength(1);
      expect(result.education).toHaveLength(1);
      expect(result.languages).toHaveLength(1);
    });

    it('should merge cover letter data', () => {
      const fragments = [
        {
          letter: {
            recipient: { company: 'Tech Corp' },
            subject: 'Job Application',
            content: {
              opening: 'Dear Hiring Manager',
              body: [{ content: 'I am interested in the position' }],
              closing: 'Best regards'
            },
            sender: { name: 'John Doe' },
            tags: ['application']
          }
        }
      ];

      const result = (loader as any).mergeFragments(fragments);

      expect(result.letter?.recipient?.company).toBe('Tech Corp');
      expect(result.letter?.subject).toBe('Job Application');
      expect(result.letter?.content?.body).toHaveLength(1);
      expect(result.letter?.sender?.name).toBe('John Doe');
    });

    it('should inherit tags to cover letter', () => {
      const data = {
        tags: ['global', 'professional'],
        letter: {
          recipient: { company: 'Tech Corp' },
          subject: 'Job Application',
          content: {
            opening: 'Dear Hiring Manager',
            body: [{ content: 'I am interested in the position', tags: ['application'] }],
            closing: 'Best regards'
          },
          sender: { name: 'John Doe' },
          tags: ['cover-letter']
        }
      };

      const result = (loader as any).inheritTags(data);

      expect(result.letter?.tags).toContain('global');
      expect(result.letter?.tags).toContain('professional');
      expect(result.letter?.tags).toContain('cover-letter');
      expect(result.letter?.content?.body?.[0].tags).toContain('global');
      expect(result.letter?.content?.body?.[0].tags).toContain('application');
    });
  });

  describe('mergeBasics', () => {
    it('should merge basics objects', () => {
      const existing = { name: 'John', email: 'john@example.com' };
      const newBasics = { phone: '+1-555-1234', location: { city: 'NYC' } };

      const result = (loader as any).mergeBasics(existing, newBasics);

      expect(result.name).toBe('John');
      expect(result.email).toBe('john@example.com');
      expect(result.phone).toBe('+1-555-1234');
      expect(result.location.city).toBe('NYC');
    });

    it('should handle null existing basics', () => {
      const newBasics = { name: 'John' };

      const result = (loader as any).mergeBasics(null, newBasics);

      expect(result.name).toBe('John');
    });

    it('should merge profiles arrays', () => {
      const existing = {
        name: 'John',
        profiles: [{ network: 'LinkedIn', username: 'john' }]
      };
      const newBasics = {
        profiles: [{ network: 'GitHub', username: 'johndoe' }]
      };

      const result = (loader as any).mergeBasics(existing, newBasics);

      expect(result.profiles).toHaveLength(2);
      expect(result.profiles?.[0].network).toBe('LinkedIn');
      expect(result.profiles?.[1].network).toBe('GitHub');
    });
  });

  describe('inheritTags', () => {
    it('should add global tags to work items', () => {
      const data = {
        tags: ['global', 'company'],
        work: [
          { name: 'Company A', tags: ['tech'] },
          { name: 'Company B', tags: ['finance'] }
        ]
      };

      const result = (loader as any).inheritTags(data);

      expect(result.work?.[0].tags).toContain('global');
      expect(result.work?.[0].tags).toContain('company');
      expect(result.work?.[0].tags).toContain('tech');
      expect(result.work?.[1].tags).toContain('global');
      expect(result.work?.[1].tags).toContain('finance');
    });

    it('should handle items without existing tags', () => {
      const data = {
        tags: ['global'],
        work: [{ name: 'Company A' }]
      };

      const result = (loader as any).inheritTags(data);

      expect(result.work?.[0].tags).toEqual(['global']);
    });

    it('should apply to all section types', () => {
      const data = {
        tags: ['global'],
        work: [{ name: 'Work', tags: [] }],
        skills: [{ name: 'Skill', tags: [] }],
        projects: [{ name: 'Project', tags: [] }],
        education: [{ institution: 'University', tags: [] }],
        languages: [{ language: 'English', tags: [] }]
      };

      const result = (loader as any).inheritTags(data);

      expect(result.work?.[0].tags).toContain('global');
      expect(result.skills?.[0].tags).toContain('global');
      expect(result.projects?.[0].tags).toContain('global');
      expect(result.education?.[0].tags).toContain('global');
      expect(result.languages?.[0].tags).toContain('global');
    });
  });

  describe('loadDataFragments', () => {
    it('should load files from directory', async () => {
      vi.mocked(readdir).mockResolvedValue(['basics.ts', 'work.ts'] as any);
      vi.mocked(stat).mockResolvedValue({
        isDirectory: () => false,
        isFile: () => true
      } as any);

      await (loader as any).loadDataFragments('./test-data');

      expect(readdir).toHaveBeenCalledWith('./test-data');
    });

    it('should recursively load subdirectories', async () => {
      (vi.mocked(readdir) as any).mockResolvedValue(['basics', 'work.ts']);
      vi.mocked(stat)
        .mockResolvedValueOnce({
          isDirectory: () => true,
          isFile: () => false
        } as any)
        .mockResolvedValueOnce({
          isDirectory: () => false,
          isFile: () => true
        } as any);

      const fragments = await (loader as any).loadDataFragments('./test-data');

      expect(readdir).toHaveBeenCalledTimes(2);
    });

    it('should skip non-data files', async () => {
      (vi.mocked(readdir) as any).mockResolvedValue(['basics.ts', 'README.md', 'package.json']);
      vi.mocked(stat).mockResolvedValue({
        isDirectory: () => false,
        isFile: () => true
      } as any);

      const loadDataFileSpy = vi.spyOn(loader as any, 'loadDataFile');
      loadDataFileSpy.mockResolvedValueOnce({ basics: { name: 'Test' } });
      loadDataFileSpy.mockResolvedValueOnce(null);
      loadDataFileSpy.mockResolvedValueOnce(null);

      const fragments = await (loader as any).loadDataFragments('./test-data');

      expect(fragments).toHaveLength(1);
      expect(loadDataFileSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle file loading errors gracefully', async () => {
      (vi.mocked(readdir) as any).mockResolvedValue(['basics.ts']);
      vi.mocked(stat).mockResolvedValue({
        isDirectory: () => false,
        isFile: () => true
      } as any);

      const loadDataFileSpy = vi.spyOn(loader as any, 'loadDataFile');
      loadDataFileSpy.mockRejectedValue(new Error('File not found'));

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const fragments = await (loader as any).loadDataFragments('./test-data');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(fragments).toHaveLength(0);
    });
  });

  describe('isDataFile', () => {
    it('should identify data files', () => {
      expect((loader as any).isDataFile('basics.ts')).toBe(true);
      expect((loader as any).isDataFile('work.js')).toBe(true);
      expect((loader as any).isDataFile('skills.json')).toBe(true);
    });

    it('should reject non-data files', () => {
      expect((loader as any).isDataFile('README.md')).toBe(false);
      expect((loader as any).isDataFile('package.json')).toBe(false);
      expect((loader as any).isDataFile('image.png')).toBe(false);
    });
  });
});