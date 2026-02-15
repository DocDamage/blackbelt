# Accessibility Testing Guide

This guide covers automated accessibility testing using `jest-axe` to ensure WCAG compliance across the application.

## Overview

We use [jest-axe](https://github.com/NickColley/jest-axe) for automated accessibility testing, which runs accessibility checks using [axe-core](https://github.com/dequelabs/axe-core) - the same engine used in browser dev tools.

## Running Accessibility Tests

Accessibility tests are integrated with the regular test suite:

```bash
# Run all tests (including accessibility tests)
npm test

# Run only accessibility tests
npm test -- --run "**/*.a11y.test.tsx"

# Run accessibility tests for specific component
npm test -- --run src/components/common/Loading/Loading.a11y.test.tsx
```

## Writing Accessibility Tests

### Basic Pattern

Create a `.a11y.test.tsx` file next to your component:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MyComponent } from './MyComponent';

expect.extend(toHaveNoViolations);

describe('MyComponent Accessibility', () => {
    it('should have no accessibility violations', async () => {
        const { container } = render(<MyComponent />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
```

### Using Utility Functions

We provide helper utilities in `src/test/accessibility-utils.tsx`:

```typescript
import { testAccessibility } from '../../../test/accessibility-utils';
import { MyComponent } from './MyComponent';

describe('MyComponent Accessibility', () => {
    it('should have no accessibility violations', async () => {
        await testAccessibility(<MyComponent />);
    });
});
```

### Testing Multiple Variants

Always test different states and configurations:

```typescript
describe('MyComponent Accessibility', () => {
    it('should have no violations in default state', async () => {
        await testAccessibility(<MyComponent />);
    });

    it('should have no violations when disabled', async () => {
        await testAccessibility(<MyComponent disabled />);
    });

    it('should have no violations with all features enabled', async () => {
        await testAccessibility(
            <MyComponent 
                feature1 
                feature2 
                variant="large"
            />
        );
    });
});
```

### Testing Accessibility Attributes

Beyond automated checks, verify specific accessibility attributes:

```typescript
it('should have appropriate ARIA attributes', () => {
    const { container } = render(<MyComponent />);
    
    // Check for landmarks
    const main = container.querySelector('main');
    expect(main).toHaveAttribute('role', 'main');
    
    // Check for labels
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Close dialog');
    
    // Check for live regions
    const status = container.querySelector('[role="status"]');
    expect(status).toHaveAttribute('aria-live', 'polite');
});
```

## What Gets Tested

jest-axe automatically checks for:

- **Color contrast** - Text has sufficient contrast ratio
- **Alt text** - Images have alternative text
- **Form labels** - Inputs have associated labels
- **Button labels** - Buttons have accessible names
- **Link purpose** - Links have discernible text
- **Heading order** - Headings follow hierarchical structure
- **ARIA usage** - Valid ARIA roles, states, and properties
- **Keyboard access** - Interactive elements are focusable

## Common Issues and Solutions

### Color Contrast

```css
/* Bad - insufficient contrast */
color: #999;

/* Good - meets WCAG AA (4.5:1 for normal text) */
color: #666;
```

### Missing Labels

```tsx
<!-- Bad - no accessible name -->
<button onClick={handleClick}>✕</button>

<!-- Good -->
<button onClick={handleClick} aria-label="Close">✕</button>
```

### Form Inputs

```tsx
<!-- Bad -->
<input type="text" placeholder="Name" />

<!-- Good -->
<label htmlFor="name">Name</label>
<input type="text" id="name" />

<!-- Also good -->
<input type="text" aria-label="Name" />
```

### Images

```tsx
<!-- Bad -->
<img src="photo.jpg" />

<!-- Good -->
<img src="photo.jpg" alt="Team meeting in conference room" />

<!-- Decorative images -->
<img src="decoration.jpg" alt="" role="presentation" />
```

## Suppressing False Positives

If you need to disable specific rules (use sparingly):

```typescript
import { testAccessibilityWithDisabledRules } from '../../../test/accessibility-utils';

it('should have no violations except color-contrast', async () => {
    await testAccessibilityWithDisabledRules(
        <MyComponent />,
        ['color-contrast'] // Disable specific rule
    );
});
```

## Accessibility Test File Naming

- Component: `Button.tsx`
- Component tests: `Button.test.tsx`
- **Accessibility tests: `Button.a11y.test.tsx`**

## Integration with CI

Accessibility tests run automatically in CI as part of the test suite. PRs with accessibility violations will fail.

## Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [jest-axe Documentation](https://github.com/NickColley/jest-axe)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/4.4)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

## Maintenance

- Add accessibility tests for all new components
- Update tests when component props/states change
- Fix violations immediately - don't accumulate debt

---

*Part of the automated accessibility testing initiative (Issue 53)*
