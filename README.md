# Election Process Education Assistant

An interactive, responsive, and accessible single-page application (SPA) designed to educate users about the democratic election process in India.

## Problem Statement Alignment
This project directly addresses **Challenge 2 - Election Process Education**. 
It creates an "assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way" by offering:
1. **Interactive Timeline:** Step-by-step breakdown of General, State, and Local elections with expandable details and duration markers.
2. **AI Chatbot Assistant:** Powered by Google Gemini AI, this assistant can answer user queries in real-time, functioning as a personalized election tutor.
3. **Knowledge Quiz:** A gamified testing module with categorized and difficulty-adjusted questions to reinforce learning.
4. **Voter Readiness Checklist:** A personalized action plan with an age eligibility calculator to guide new voters from registration to polling day.
5. **Searchable Glossary:** An interactive dictionary to demystify complex electoral terminology.

## Core Features & Google Services Integration
- **Google Gemini AI:** Generative AI assistant providing real-time, system-prompted election guidance.
- **Firebase Authentication:** Seamless Google Sign-In and anonymous authentication for personalized tracking.
- **Cloud Firestore:** Real-time database for storing quiz scores, leaderboard rankings, chat history, and checklist state.
- **Firebase Analytics:** Event tracking to monitor user engagement across the timeline, quiz, and chatbot.
- **Firebase Hosting:** Fast, secure CDN deployment with robust Content Security Policy (CSP).

## PWA Features
- **Offline Support:** Works offline with cached content via Service Worker.
- **Installable:** Installable as a standalone app on mobile and desktop.
- **Manifest:** Web App Manifest for installability.

## Accessibility (WCAG 2.1 AA)
The application is built completely inclusive:
- Semantic HTML tags and comprehensive ARIA labeling.
- `accessibility.js` manages focus trapping for modals (chatbot) and dynamic ARIA live region announcements for screen readers.
- Respects `prefers-reduced-motion` system settings by suppressing particles and disabling smooth animations.
- Minimum 4.5:1 contrast ratio across the tailored dark mode theme.

## Architecture
- **Vanilla JavaScript (ES Modules):** No heavy frameworks. Highly performant DOM manipulation.
- **Vite:** Next-generation frontend tooling for optimized, minimal bundle sizes (< 10 MB repository).
- **Security First:** Strict CSP, rate limiting on AI APIs, and `DOMPurify` HTML sanitization to prevent XSS.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based off `.env.example` and add your Firebase and Gemini API keys.

3. Start development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Repository Constraints
- The physical size of this repository is significantly below the 10 MB strict limit due to minimal asset usage and lack of large frameworks.
