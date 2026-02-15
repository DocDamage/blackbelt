/**
 * Accessibility Testing Utilities
 * 
 * Helper functions for automated accessibility testing using jest-axe.
 */

import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Test a component for accessibility violations
 * @param component - React component to test
 * @returns Promise that resolves when test completes
 * 
 * @example
 * ```typescript
 * it('should have no accessibility violations', async () => {
 *   await testAccessibility(<MyComponent />);
 * });
 * ```
 */
export async function testAccessibility(component: ReactElement): Promise<void> {
    const { container } = render(component);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
}

/**
 * Test an already rendered container for accessibility
 * @param container - HTML container element
 * @returns Promise that resolves when test completes
 */
export async function testContainerAccessibility(container: HTMLElement): Promise<void> {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
}

/**
 * Test a component with specific axe options
 * @param component - React component to test
 * @param options - axe configuration options
 * @returns Promise that resolves when test completes
 */
export async function testAccessibilityWithOptions(
    component: ReactElement,
    options: Parameters<typeof axe>[1]
): Promise<void> {
    const { container } = render(component);
    const results = await axe(container, options);
    expect(results).toHaveNoViolations();
}

/**
 * Common accessibility test patterns
 */
export const accessibilityPatterns = {
    /**
     * Test that buttons have accessible names
     */
    buttonAccessibleName: 'button-has-visible-text',
    
    /**
     * Test that images have alt text
     */
    imageAltText: 'image-alt',
    
    /**
     * Test that form inputs have labels
     */
    formLabels: 'label',
    
    /**
     * Test color contrast
     */
    colorContrast: 'color-contrast',
    
    /**
     * Test that links have accessible names
     */
    linkAccessibleName: 'link-name',
    
    /**
     * Test heading hierarchy
     */
    headingOrder: 'heading-order',
};

/**
 * Run axe with specific rules disabled
 * @param component - React component to test
 * @param disabledRules - Array of rule IDs to disable
 * @returns Promise that resolves when test completes
 */
export async function testAccessibilityWithDisabledRules(
    component: ReactElement,
    disabledRules: string[]
): Promise<void> {
    const { container } = render(component);
    const results = await axe(container, {
        rules: disabledRules.reduce((acc, rule) => {
            acc[rule] = { enabled: false };
            return acc;
        }, {} as Record<string, { enabled: boolean }>),
    });
    expect(results).toHaveNoViolations();
}

// Re-export jest-axe types
declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveNoViolations(): R;
        }
    }
}
