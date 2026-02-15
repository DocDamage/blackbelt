# Contributing to Six Sigma Training Academy

Thank you for your interest in contributing to the Six Sigma Training Platform! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## Code of Conduct

Be respectful, inclusive, and constructive. We welcome contributions from everyone.

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- Python 3.10+ (for analysis API)
- npm or pnpm

### Getting Started

1. Fork and clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Install Python dependencies:
   ```bash
   cd analysis_api
   pip install -r requirements.txt
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Start the API server (in another terminal):
   ```bash
   cd analysis_api
   python main.py
   ```

## Project Structure

```
blackbelt/
├── src/
│   ├── components/       # React components
│   │   ├── common/       # Shared components (ErrorBoundary, etc.)
│   │   ├── features/     # Feature-specific components
│   │   └── layout/       # Layout components (Navbar, Sidebar)
│   ├── content/          # Belt level content modules
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── test/             # Test setup and utilities
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── analysis_api/         # Python FastAPI backend
├── public/               # Static assets
└── .github/workflows/    # CI/CD configuration
```

## Coding Standards

### TypeScript/React

- Use TypeScript for all new files
- Follow existing naming conventions:
  - PascalCase for components and classes
  - camelCase for functions and variables
  - UPPER_SNAKE_CASE for constants
- Use functional components with hooks
- Add proper TypeScript types (avoid `any`)
- Extract magic numbers to src/utils/constants.ts

### CSS

- Use CSS variables from src/styles/variables.css
- Follow BEM naming convention for CSS classes
- Keep component styles in adjacent .css files

### Python

- Follow PEP 8 style guidelines
- Use type hints for function parameters
- Add docstrings for public functions

## Commit Guidelines

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

Example: `feat: add capability analysis export to PDF`

## Pull Request Process

1. Create a feature branch from main
2. Make your changes following coding standards
3. Add/update tests as needed
4. Run the test suite: `npm run test`
5. Run linting: `npm run lint`
6. Update documentation if needed
7. Submit PR with a clear description

### PR Checklist

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Linting passes
- [ ] New code has test coverage
- [ ] Documentation updated if needed

## Testing

### Frontend Tests

We use **Vitest** with **React Testing Library** and **jsdom**:

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --run src/components/Button.test.tsx
```

### Current Test Coverage

- **Test Files**: 42
- **Total Tests**: 820+
- **Framework**: Vitest 4.x
- **Test Utilities**: @testing-library/react, @testing-library/jest-dom

### Test File Naming & Location

- Unit tests: `*.test.ts` or `*.test.tsx`
- Place tests **adjacent** to the file being tested
- Example: `Button.tsx` → `Button.test.tsx`

### Test Categories

| Category | Examples |
|----------|----------|
| **Components** | Button, VideoPlayer, QuizEngine, Chatbot |
| **Hooks** | useAsync, useEchaData |
| **Services** | analysisApi, echaApi, webhookService, scormApi |
| **Utils** | db, constants, logger, sentry |
| **Contexts** | ThemeContext, UserContext |

### Writing Tests - Best Practices

1. **Test behavior, not implementation**
   ```typescript
   // Good: Tests what user sees
   expect(screen.getByText('Submit')).toBeInTheDocument();
   
   // Bad: Tests implementation details
   expect(component.state.isOpen).toBe(true);
   ```

2. **Use descriptive test names**
   ```typescript
   it('disables submit button when form is invalid', () => {...});
   it('shows error message when API request fails', () => {...});
   ```

3. **Follow AAA pattern: Arrange, Act, Assert**
   ```typescript
   it('calculates Cpk correctly', () => {
     // Arrange
     const usl = 10, lsl = 2, mean = 6, stddev = 1;
     
     // Act
     const result = calculateCpk(usl, lsl, mean, stddev);
     
     // Assert
     expect(result.cpk).toBeCloseTo(1.333, 2);
   });
   ```

4. **Mock external dependencies**
   ```typescript
   vi.mock('./utils/db', () => ({
     getUserProfile: vi.fn().mockResolvedValue({ name: 'Test' }),
   }));
   ```

5. **Use `act()` and `waitFor()` for async operations**
   ```typescript
   await act(async () => {
     fireEvent.click(button);
   });
   
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

### Test Setup

Test configuration is in:
- `vitest.config.ts` - Main Vitest config
- `src/test/setup.ts` - Test environment setup, mocks (IndexedDB, matchMedia, etc.)

### Mocking Common Dependencies

The test setup automatically mocks:
- `indexedDB` - Database operations
- `matchMedia` - Media queries
- `ResizeObserver` - Layout observations
- `IntersectionObserver` - Scroll observations
- `scrollIntoView` - Scroll behavior

### Running Tests in CI

Tests run automatically on PRs via GitHub Actions. All tests must pass before merging.

## Questions?

Open an issue for bugs, feature requests, or questions.

Thank you for contributing!
