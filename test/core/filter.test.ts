import { describe, it, expect } from 'vitest';
import { CVFilter } from '../../src/core/filter.js';
import { sampleCVData, sampleQuery } from '../fixtures/sample-data.js';

describe('CVFilter', () => {
  describe('filterData', () => {
    it('should filter work experiences by include tags', () => {
      const query = {
        ...sampleQuery,
        tags: { include: ['senior'], exclude: [] }
      };

      const result = CVFilter.filterData(sampleCVData, query);

      expect(result.work).toHaveLength(1);
      expect(result.work?.[0].name).toBe('Tech Innovations Inc.');
    });

    it('should filter work experiences by exclude tags', () => {
      const query = {
        ...sampleQuery,
        tags: { include: [], exclude: ['junior'] }
      };

      const result = CVFilter.filterData(sampleCVData, query);

      expect(result.work).toHaveLength(1);
      expect(result.work?.[0].name).toBe('Tech Innovations Inc.');
    });

    it('should handle multiple include tags with OR logic', () => {
      const query = {
        ...sampleQuery,
        tags: { include: ['react', 'python'], exclude: [] }
      };

      const result = CVFilter.filterData(sampleCVData, query);

      expect(result.work).toHaveLength(2); // Both jobs have relevant tags
    });

    it('should handle requireAll flag for AND logic', () => {
      const query = {
        ...sampleQuery,
        tags: { include: ['senior', 'leadership'], exclude: [], requireAll: true }
      };

      const result = CVFilter.filterData(sampleCVData, query);

      expect(result.work).toHaveLength(1);
      expect(result.work?.[0].tags).toContain('leadership');
    });

    it('should filter skills by tags', () => {
      const query = {
        ...sampleQuery,
        tags: { include: ['javascript'], exclude: [] }
      };

      const result = CVFilter.filterData(sampleCVData, query);

      expect(result.skills).toHaveLength(1);
      expect((result.skills?.[0].name as any).en).toBe('JavaScript/TypeScript');
    });

    it('should filter projects by tags', () => {
      const query = {
        ...sampleQuery,
        tags: { include: ['mongodb'], exclude: [] }
      };

      const result = CVFilter.filterData(sampleCVData, query);

      expect(result.projects).toHaveLength(1);
      expect((result.projects?.[0].name as any).en).toBe('E-Commerce Platform');
    });

    it('should preserve basics data', () => {
      const query = {
        ...sampleQuery,
        tags: { include: ['nonexistent'], exclude: [] }
      };

      const result = CVFilter.filterData(sampleCVData, query);

      expect(result.basics?.name).toBe('John Doe');
      expect(result.basics?.email).toBe('john.doe@example.com');
    });

    it('should handle empty arrays gracefully', () => {
      const emptyData = { ...sampleCVData, work: [] };
      const result = CVFilter.filterData(emptyData, sampleQuery);

      expect(result.work).toEqual([]);
    });

    it('should handle items without tags', () => {
      const dataWithoutTags = {
        ...sampleCVData,
        work: [{
          name: 'Test Company',
          position: 'Developer',
          startDate: '2020-01-01'
        }]
      };

      const query = {
        ...sampleQuery,
        tags: { include: ['senior'], exclude: [] }
      };

      const result = CVFilter.filterData(dataWithoutTags, query);

      expect(result.work).toHaveLength(0);
    });
  });

  describe('matchesTags', () => {
    it('should return true when item has required tag', () => {
      const result = CVFilter['matchesTags'](['react', 'senior'], { include: ['react'] });
      expect(result).toBe(true);
    });

    it('should return false when item lacks required tag', () => {
      const result = CVFilter['matchesTags'](['python'], { include: ['react'] });
      expect(result).toBe(false);
    });

    it('should return false when item has excluded tag', () => {
      const result = CVFilter['matchesTags'](['junior', 'react'], { exclude: ['junior'] });
      expect(result).toBe(false);
    });

    it('should return true when no include tags specified', () => {
      const result = CVFilter['matchesTags'](['react'], { include: [] });
      expect(result).toBe(true);
    });

    it('should handle requireAll flag correctly', () => {
      const result = CVFilter['matchesTags'](
        ['react', 'typescript'],
        { include: ['react', 'nodejs'], requireAll: true }
      );
      expect(result).toBe(false); // Missing nodejs

      const result2 = CVFilter['matchesTags'](
        ['react', 'typescript', 'nodejs'],
        { include: ['react', 'nodejs'], requireAll: true }
      );
      expect(result2).toBe(true); // Has both
    });

    it('should prioritize exclude over include', () => {
      const result = CVFilter['matchesTags'](
        ['react', 'junior'],
        { include: ['react'], exclude: ['junior'] }
      );
      expect(result).toBe(false);
    });
  });

  describe('filterHighlights', () => {
    it('should filter highlights by tags', () => {
      const dataWithHighlights = {
        ...sampleCVData,
        work: [{
          ...sampleCVData.work![0],
          highlights: [
            {
              content: 'Senior achievement',
              tags: ['senior']
            },
            {
              content: 'Junior achievement',
              tags: ['junior']
            }
          ]
        }]
      };

      const query = {
        ...sampleQuery,
        tags: { include: ['senior'], exclude: [] }
      };

      const result = CVFilter.filterData(dataWithHighlights, query);

      expect(result.work?.[0].highlights).toHaveLength(1);
      expect((result.work?.[0].highlights?.[0] as any).content).toBe('Senior achievement');
    });

    it('should handle highlights without tags', () => {
      const dataWithHighlights = {
        ...sampleCVData,
        work: [{
          ...sampleCVData.work![0],
          highlights: [
            {
              content: 'Untagged achievement'
            }
          ]
        }]
      };

      const result = CVFilter.filterData(dataWithHighlights, sampleQuery);

      expect(result.work?.[0].highlights).toHaveLength(1);
    });

    it('should filter cover letter paragraphs by tags', () => {
      // Use test data with letter content
      const testData = {
        ...sampleCVData,
        letter: {
          recipient: {
            company: {
              en: 'Tech Corp',
              fr: 'Tech Corp'
            },
            name: {
              en: 'Jane Smith',
              fr: 'Jane Smith'
            },
            title: {
              en: 'Hiring Manager',
              fr: 'Responsable du recrutement'
            }
          },
          subject: {
            en: 'Application for Senior Full-Stack Developer Position',
            fr: 'Candidature pour le poste de Développeur Full-Stack Senior'
          },
          content: {
            opening: {
              en: 'I am writing to express my interest in the Senior Full-Stack Developer position at Tech Corp.',
              fr: 'J\'écris pour exprimer mon intérêt pour le poste de Développeur Full-Stack Senior chez Tech Corp.'
            },
            body: [
              {
                content: {
                  en: 'With over 5 years of experience in full-stack development, I have successfully led multiple projects from conception to deployment.',
                  fr: 'Avec plus de 5 ans d\'expérience en développement full-stack, j\'ai dirigé avec succès plusieurs projets de la conception au déploiement.'
                },
                tags: ['senior', 'leadership', 'fullstack']
              },
              {
                content: {
                  en: 'I specialize in React and Node.js technologies, having built scalable applications serving thousands of users.',
                  fr: 'Je me spécialise dans les technologies React et Node.js, ayant construit des applications évolutives servant des milliers d\'utilisateurs.'
                },
                tags: ['react', 'nodejs', 'senior']
              },
              {
                content: {
                  en: 'During my tenure at Startup Corp, I gained valuable experience in fast-paced environments and agile methodologies.',
                  fr: 'Pendant mon mandat chez Startup Corp, j\'ai acquis une expérience précieuse dans les environnements rapides et les méthodologies agiles.'
                },
                tags: ['junior', 'agile']
              }
            ],
            closing: {
              en: 'I would welcome the opportunity to discuss how my skills and experience align with Tech Corp\'s needs.',
              fr: 'Je serais ravi de discuter de la façon dont mes compétences et mon expérience s\'alignent sur les besoins de Tech Corp.'
            }
          },
          sender: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-123-4567'
          },
          date: '2024-01-15',
          tags: ['senior', 'fullstack', 'leadership']
        }
      };

      const seniorQuery = {
        ...sampleQuery,
        tags: { include: ['senior'], exclude: [] }
      };

      const result = CVFilter.filterData(testData, seniorQuery);

      expect(result.letter).toBeDefined();
      expect(result.letter?.content?.body).toHaveLength(2); // Only senior-tagged paragraphs
      const firstParagraph = result.letter?.content?.body?.[0];
      const secondParagraph = result.letter?.content?.body?.[1];
      if (typeof firstParagraph === 'object' && 'content' in firstParagraph) {
        const content = firstParagraph.content;
        if (typeof content === 'string') {
          expect(content).toContain('5 years');
        } else {
          expect(content.en).toContain('5 years');
        }
      }
      if (typeof secondParagraph === 'object' && 'content' in secondParagraph) {
        const content = secondParagraph.content;
        if (typeof content === 'string') {
          expect(content).toContain('React and Node.js');
        } else {
          expect(content.en).toContain('React and Node.js');
        }
      }
    });

    it('should exclude cover letter paragraphs with excluded tags', () => {
      const testData = {
        ...sampleCVData,
        letter: {
          recipient: {
            company: {
              en: 'Tech Corp',
              fr: 'Tech Corp'
            },
            name: {
              en: 'Jane Smith',
              fr: 'Jane Smith'
            },
            title: {
              en: 'Hiring Manager',
              fr: 'Responsable du recrutement'
            }
          },
          subject: {
            en: 'Application for Senior Full-Stack Developer Position',
            fr: 'Candidature pour le poste de Développeur Full-Stack Senior'
          },
          content: {
            opening: {
              en: 'I am writing to express my interest in the Senior Full-Stack Developer position at Tech Corp.',
              fr: 'J\'écris pour exprimer mon intérêt pour le poste de Développeur Full-Stack Senior chez Tech Corp.'
            },
            body: [
              {
                content: {
                  en: 'With over 5 years of experience in full-stack development, I have successfully led multiple projects from conception to deployment.',
                  fr: 'Avec plus de 5 ans d\'expérience en développement full-stack, j\'ai dirigé avec succès plusieurs projets de la conception au déploiement.'
                },
                tags: ['senior', 'leadership', 'fullstack']
              },
              {
                content: {
                  en: 'I specialize in React and Node.js technologies, having built scalable applications serving thousands of users.',
                  fr: 'Je me spécialise dans les technologies React et Node.js, ayant construit des applications évolutives servant des milliers d\'utilisateurs.'
                },
                tags: ['react', 'nodejs', 'senior']
              },
              {
                content: {
                  en: 'During my tenure at Startup Corp, I gained valuable experience in fast-paced environments and agile methodologies.',
                  fr: 'Pendant mon mandat chez Startup Corp, j\'ai acquis une expérience précieuse dans les environnements rapides et les méthodologies agiles.'
                },
                tags: ['junior', 'agile']
              }
            ],
            closing: {
              en: 'I would welcome the opportunity to discuss how my skills and experience align with Tech Corp\'s needs.',
              fr: 'Je serais ravi de discuter de la façon dont mes compétences et mon expérience s\'alignent sur les besoins de Tech Corp.'
            }
          },
          sender: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-123-4567'
          },
          date: '2024-01-15',
          tags: ['senior', 'fullstack', 'leadership']
        }
      };

      const queryExcludingSenior = {
        ...sampleQuery,
        tags: { include: [], exclude: ['senior'] }
      };

      const result = CVFilter.filterData(testData, queryExcludingSenior);

      expect(result.letter).toBeDefined();
      expect(result.letter?.content?.body).toHaveLength(1); // Only non-senior paragraph
      const paragraph = result.letter?.content?.body?.[0];
      if (typeof paragraph === 'object' && 'content' in paragraph) {
        const content = paragraph.content;
        if (typeof content === 'string') {
          expect(content).toContain('Startup Corp');
        } else {
          expect(content.en).toContain('Startup Corp');
        }
      }
    });

    it('should handle cover letter paragraphs without tags', () => {
      const dataWithUntaggedLetter = {
        ...sampleCVData,
        letter: {
          recipient: {
            company: {
              en: 'Tech Corp',
              fr: 'Tech Corp'
            }
          },
          subject: {
            en: 'Application',
            fr: 'Candidature'
          },
          content: {
            opening: {
              en: 'Opening',
              fr: 'Ouverture'
            },
            body: [
              {
                content: {
                  en: 'Untagged paragraph',
                  fr: 'Paragraphe sans étiquette'
                }
                // No tags property
              }
            ],
            closing: {
              en: 'Closing',
              fr: 'Fermeture'
            }
          },
          sender: {
            name: 'John Doe'
          },
          tags: ['senior']
        }
      };

      const result = CVFilter.filterData(dataWithUntaggedLetter, sampleQuery);

      expect(result.letter?.content?.body).toHaveLength(1);
      const paragraph = result.letter?.content?.body?.[0];
      if (typeof paragraph === 'object' && 'content' in paragraph) {
        const content = paragraph.content;
        if (typeof content === 'string') {
          expect(content).toBe('Untagged paragraph');
        } else {
          expect(content.en).toBe('Untagged paragraph');
        }
      }
    });

    it('should preserve cover letter structure when filtering', () => {
      const testData = {
        ...sampleCVData,
        letter: {
          recipient: {
            company: {
              en: 'Tech Corp',
              fr: 'Tech Corp'
            },
            name: {
              en: 'Jane Smith',
              fr: 'Jane Smith'
            },
            title: {
              en: 'Hiring Manager',
              fr: 'Responsable du recrutement'
            }
          },
          subject: {
            en: 'Application for Senior Full-Stack Developer Position',
            fr: 'Candidature pour le poste de Développeur Full-Stack Senior'
          },
          content: {
            opening: {
              en: 'I am writing to express my interest in the Senior Full-Stack Developer position at Tech Corp.',
              fr: 'J\'écris pour exprimer mon intérêt pour le poste de Développeur Full-Stack Senior chez Tech Corp.'
            },
            body: [
              {
                content: {
                  en: 'With over 5 years of experience in full-stack development, I have successfully led multiple projects from conception to deployment.',
                  fr: 'Avec plus de 5 ans d\'expérience en développement full-stack, j\'ai dirigé avec succès plusieurs projets de la conception au déploiement.'
                },
                tags: ['senior', 'leadership', 'fullstack']
              },
              {
                content: {
                  en: 'I specialize in React and Node.js technologies, having built scalable applications serving thousands of users.',
                  fr: 'Je me spécialise dans les technologies React et Node.js, ayant construit des applications évolutives servant des milliers d\'utilisateurs.'
                },
                tags: ['react', 'nodejs', 'senior']
              },
              {
                content: {
                  en: 'During my tenure at Startup Corp, I gained valuable experience in fast-paced environments and agile methodologies.',
                  fr: 'Pendant mon mandat chez Startup Corp, j\'ai acquis une expérience précieuse dans les environnements rapides et les méthodologies agiles.'
                },
                tags: ['junior', 'agile']
              }
            ],
            closing: {
              en: 'I would welcome the opportunity to discuss how my skills and experience align with Tech Corp\'s needs.',
              fr: 'Je serais ravi de discuter de la façon dont mes compétences et mon expérience s\'alignent sur les besoins de Tech Corp.'
            }
          },
          sender: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-123-4567'
          },
          date: '2024-01-15',
          tags: ['senior', 'fullstack', 'leadership']
        }
      };

      const seniorQuery = {
        ...sampleQuery,
        tags: { include: ['senior'], exclude: [] }
      };

      const result = CVFilter.filterData(testData, seniorQuery);

      const company = result.letter?.recipient?.company;
      if (typeof company === 'string') {
        expect(company).toBe('Tech Corp');
      } else {
        expect(company?.en).toBe('Tech Corp');
      }

      const subject = result.letter?.subject;
      if (typeof subject === 'string') {
        expect(subject).toBe('Application for Senior Full-Stack Developer Position');
      } else {
        expect(subject?.en).toBe('Application for Senior Full-Stack Developer Position');
      }
      expect(result.letter?.content?.opening).toBeDefined();
      expect(result.letter?.content?.closing).toBeDefined();
      expect(result.letter?.sender?.name).toBe('John Doe');
    });

    it('should return empty letter content when no paragraphs match', () => {
      const testData = {
        ...sampleCVData,
        letter: {
          recipient: {
            company: {
              en: 'Tech Corp',
              fr: 'Tech Corp'
            }
          },
          subject: {
            en: 'Application',
            fr: 'Candidature'
          },
          content: {
            opening: {
              en: 'Opening',
              fr: 'Ouverture'
            },
            body: [
              {
                content: {
                  en: 'Some content',
                  fr: 'Du contenu'
                },
                tags: ['existing-tag']
              }
            ],
            closing: {
              en: 'Closing',
              fr: 'Fermeture'
            }
          },
          sender: {
            name: 'John Doe'
          },
          tags: ['senior']
        }
      };

      const queryWithNoMatches = {
        ...sampleQuery,
        tags: { include: ['nonexistent-tag'], exclude: [] }
      };

      const result = CVFilter.filterData(testData, queryWithNoMatches);

      expect(result.letter).toBeDefined();
      expect(result.letter?.content?.body).toEqual([]);
      // Other letter properties should still be preserved
      const company = result.letter?.recipient?.company;
      if (typeof company === 'string') {
        expect(company).toBe('Tech Corp');
      } else {
        expect(company?.en).toBe('Tech Corp');
      }
    });
  });
});