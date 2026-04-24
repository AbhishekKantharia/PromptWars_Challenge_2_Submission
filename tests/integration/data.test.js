import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Integration Tests', () => {
  describe('Election Data Integration', () => {
    let electionData;

    beforeAll(() => {
      const dataPath = path.join(__dirname, '..', 'src', 'data', 'election-data.json');
      const data = fs.readFileSync(dataPath, 'utf-8');
      electionData = JSON.parse(data);
    });

    test('should have valid timeline data', () => {
      expect(electionData).toHaveProperty('timeline');
      expect(electionData.timeline).toHaveProperty('general');
      expect(Array.isArray(electionData.timeline.general)).toBe(true);
      expect(electionData.timeline.general.length).toBeGreaterThan(0);
    });

    test('should have valid quiz questions', () => {
      expect(electionData).toHaveProperty('quiz');
      expect(electionData.quiz).toHaveProperty('questions');
      expect(Array.isArray(electionData.quiz.questions)).toBe(true);
      expect(electionData.quiz.questions.length).toBeGreaterThan(10);
    });

    test('should have valid glossary terms', () => {
      expect(electionData).toHaveProperty('glossary');
      expect(electionData.glossary).toHaveProperty('terms');
      expect(Array.isArray(electionData.glossary.terms)).toBe(true);
    });

    test('should have valid checklist items', () => {
      expect(electionData).toHaveProperty('checklist');
      expect(electionData.checklist).toHaveProperty('items');
      expect(Array.isArray(electionData.checklist.items)).toBe(true);
    });
  });

  describe('Component Integration', () => {
    test('should have all required source files', () => {
      const requiredFiles = [
        'src/js/app.js',
        'src/js/auth.js',
        'src/js/firestore.js',
        'src/js/gemini.js',
        'src/js/timeline.js',
        'src/js/quiz.js',
        'src/js/glossary.js',
        'src/js/checklist.js',
        'src/js/chatbot.js',
        'src/js/security.js',
        'src/js/accessibility.js',
        'src/js/analytics.js',
        'src/js/router.js'
      ];

      requiredFiles.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    test('should have all required CSS files', () => {
      const cssFiles = [
        'src/css/index.css',
        'src/css/components.css',
        'src/css/chatbot.css',
        'src/css/animations.css'
      ];

      cssFiles.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });
  });

  describe('Build Integration', () => {
    test('should have valid package.json', () => {
      const pkgPath = path.join(__dirname, '..', 'package.json');
      const pkgData = fs.readFileSync(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgData);

      expect(pkg.name).toBe('election-education-assistant');
      expect(pkg.scripts).toHaveProperty('build');
      expect(pkg.scripts).toHaveProperty('dev');
    });

    test('should have valid vite.config.js', () => {
      const configPath = path.join(__dirname, '..', 'vite.config.js');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('should have firebase configuration', () => {
      const configPath = path.join(__dirname, '..', 'firebase.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(config).toHaveProperty('hosting');
      expect(config).toHaveProperty('firestore');
    });
  });
});