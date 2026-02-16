# Agent Guide: Six Sigma Training Platform

This guide provides essential information for AI agents working on the Six Sigma Training Platform codebase.

## Quick Reference

| Item | Value |
|------|-------|
| **Test Framework** | Vitest 4.x |
| **Test Count** | 1073 tests across 55 files |
| **Test Command** | `npm test` |
| **Lint Command** | `npm run lint` |
| **Build Command** | `npm run build` |
| **Node Version** | 20.x+ |
| **Features** | 15 new features in `src/features/` |

## Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run specific file
npm test -- --run src/components/Button.test.tsx

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Writing New Tests

1. **File naming**: Place test adjacent to source file:
   - `Component.tsx` → `Component.test.tsx`
   - `utils.ts` → `utils.test.ts`

2. **Test structure**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

describe('ComponentName', () => {
  it('describes the behavior being tested', () => {
    // Arrange
    const props = { ... };
    
    // Act
    render(<Component {...props} />);
    
    // Assert
    expect(screen.getByText('expected')).toBeInTheDocument();
  });
});
```

3. **Mocking dependencies**:
```typescript
vi.mock('./utils/db', () => ({
  getUserProfile: vi.fn().mockResolvedValue({ name: 'Test' }),
}));
```

4. **Async operations**:
```typescript
await act(async () => {
  fireEvent.click(button);
});

await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### Pre-configured Mocks (src/test/setup.ts)

The following are automatically mocked:
- `indexedDB` - Database operations
- `matchMedia` - CSS media queries
- `ResizeObserver` - Element resize detection
- `IntersectionObserver` - Scroll-based lazy loading
- `scrollIntoView` - Scroll behavior

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (ErrorBoundary, Loading, etc.)
│   ├── features/        # Feature components (Chatbot, QuizEngine, VideoPlayer)
│   └── layout/          # Layout components (Navbar, Sidebar)
├── content/             # Belt training content
│   ├── whiteBelt/
│   ├── yellowBelt/
│   ├── greenBelt/
│   ├── blackBelt/
│   └── masterBlackBelt/
├── features/            # New feature modules (see below)
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API clients (analysisApi, echaApi, etc.)
├── contexts/            # React contexts (ThemeContext, UserContext)
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (db, constants, logger, sentry)
└── test/                # Test setup and configuration
```

## Key Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript 5.x |
| Styling | CSS with CSS Variables |
| Routing | React Router v6 |
| State | React Context + hooks |
| Build Tool | Vite 5.x |
| Testing | Vitest + React Testing Library |
| Backend | Python FastAPI |

## Environment Variables

Frontend (`.env`):
```
VITE_API_URL=http://localhost:8001
VITE_SENTRY_DSN=...
VITE_SENTRY_ENABLED=true
```

Backend (`analysis_api/.env`):
```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
PRODUCTION_URL=https://your-domain.com
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=3600
```

## Common Tasks

### Adding a New Component

1. Create component file: `src/components/features/MyComponent/MyComponent.tsx`
2. Create styles: `src/components/features/MyComponent/MyComponent.css`
3. Create tests: `src/components/features/MyComponent/MyComponent.test.tsx`
4. Export from index: `src/components/features/index.ts`

### Adding a New API Service

1. Create service: `src/services/myService.ts`
2. Create tests: `src/services/myService.test.ts`
3. Mock fetch for tests
4. Export from `src/services/index.ts`

### Adding a New Test File

1. Create adjacent to source: `Component.test.tsx`
2. Follow AAA pattern (Arrange, Act, Assert)
3. Mock external dependencies
4. Test behavior, not implementation
5. Run tests to verify: `npm test -- --run path/to/test.tsx`

## CI/CD Pipeline

GitHub Actions runs on PRs:
1. **Test Stage** - Runs all Vitest tests
2. **Lint Stage** - ESLint checks
3. **Build Stage** - TypeScript compilation and Vite build

All checks must pass before merging.

## Lint-staged Configuration

Pre-commit hooks run:
- ESLint fix on staged files
- Related tests for changed files

## Documentation Files

- `CONTRIBUTING.md` - Contribution guidelines
- `TECHNICAL_DEBT_AUDIT.md` - Technical debt tracking
- `docs/DESIGN_SYSTEM.md` - Design system documentation
- `analysis_api/README.md` - Backend API documentation

## Known Patterns

### Belt Content Structure
Each belt has:
- `modules.ts` - Module and lesson definitions
- `getXLessonCount()` - Helper function
- `getXTotalMinutes()` - Helper function

### Database Operations
All IndexedDB operations go through `src/utils/db.ts`:
- `getUserProfile()` / `saveUserProfile()`
- `getLessonProgress()` / `markLessonComplete()`
- `saveQuizAttempt()` / `getQuizAttempts()`
- `saveCertificate()` / `getCertificate()`

### API Client Pattern
```typescript
class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async fetchData(endpoint: string): Promise<Data> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_URL);
```

## Feature Inventory (Phases 1-4 Complete)

### Phase 1: Learning Enhancement
| Feature | Location | Description |
|---------|----------|-------------|
| **Spaced Repetition** | `src/features/spaced-repetition/` | SM-2 algorithm for optimal retention |
| **Community Notes** | `src/features/community-notes/` | Peer-generated study annotations |
| **Skills Gap Analysis** | `src/features/skills-gap/` | Personalized knowledge assessment |

### Phase 2: Assessment & Planning
| Feature | Location | Description |
|---------|----------|-------------|
| **Mock Certification Exams** | `src/features/mock-exams/` | ASQ CSSBB format with 50+ questions |
| **Project Portfolio** | `src/features/project-portfolio/` | DMAIC project tracking & showcase |
| **Smart Study Scheduler** | `src/features/smart-scheduler/` | 11 topics, 60-min session optimizer |

### Phase 3: AI-Powered Learning
| Feature | Location | Description |
|---------|----------|-------------|
| **AI Learning Path** | `src/features/ai-learning-path/` | Adaptive recommendations engine |
| **AI Mentor** | `src/features/ai-mentor/` | Chat-based guidance with knowledge base |

### Phase 4: Collaboration & Offline
| Feature | Location | Description |
|---------|----------|-------------|
| **Study Groups** | `src/features/study-groups/` | Collaborative learning platform |
| **Mentorship Matching** | `src/features/mentorship/` | Smart algorithm with 4 mock mentors |
| **Offline PWA** | `src/features/offline-pwa/` | Download manager & offline sync |

### Feature Technical Standards
- **State Management**: React Context + hooks
- **Persistence**: IndexedDB via `src/utils/db.ts`
- **Styling**: CSS Modules (per-feature `.module.css`)
- **Testing**: Vitest with React Testing Library
- **Exports**: Centralized via `src/features/index.ts`

## Troubleshooting

### Tests failing with "window is not defined"
Make sure test file uses proper jsdom environment (configured globally in vitest.config.ts).

### IndexedDB errors in tests
The IndexedDB is mocked in `src/test/setup.ts`. Ensure mock is not being overwritten.

### Import errors in tests
Check that module path aliases are correctly resolved in `vitest.config.ts`.

### React act() warnings
Wrap state-updating operations in `act()` or use `waitFor()` for async assertions.

## Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Vite Docs](https://vitejs.dev/)
