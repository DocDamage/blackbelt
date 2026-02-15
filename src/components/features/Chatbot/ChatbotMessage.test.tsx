/**
 * Tests for Chatbot Message Component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatbotMessage } from './ChatbotMessage';

describe('ChatbotMessage', () => {
    it('renders user message with correct role class', () => {
        render(<ChatbotMessage content="Hello" role="user" />);
        const message = document.querySelector('.chatbot-message.user');
        expect(message).toBeInTheDocument();
    });

    it('renders assistant message with correct role class', () => {
        render(<ChatbotMessage content="Hi there!" role="assistant" />);
        const message = document.querySelector('.chatbot-message.assistant');
        expect(message).toBeInTheDocument();
    });

    it('renders plain text content', () => {
        render(<ChatbotMessage content="Simple text message" role="assistant" />);
        expect(screen.getByText('Simple text message')).toBeInTheDocument();
    });

    it('renders markdown bold text', () => {
        render(<ChatbotMessage content="**Bold text**" role="assistant" />);
        const strong = document.querySelector('.message-strong');
        expect(strong).toBeInTheDocument();
        expect(strong?.textContent).toBe('Bold text');
    });

    it('renders inline code', () => {
        render(<ChatbotMessage content="Use `console.log()` for debugging" role="assistant" />);
        const code = document.querySelector('.inline-code');
        expect(code).toBeInTheDocument();
        expect(code?.textContent).toBe('console.log()');
    });

    it('renders code blocks', () => {
        const content = '```javascript\nconst x = 1;\n```';
        render(<ChatbotMessage content={content} role="assistant" />);
        const codeBlock = document.querySelector('.code-block');
        expect(codeBlock).toBeInTheDocument();
    });

    it('renders unordered lists', () => {
        const content = '- Item 1\n- Item 2\n- Item 3';
        render(<ChatbotMessage content={content} role="assistant" />);
        const list = document.querySelector('.message-list');
        expect(list).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders ordered lists', () => {
        const content = '1. First\n2. Second\n3. Third';
        render(<ChatbotMessage content={content} role="assistant" />);
        const list = document.querySelector('.message-list.ordered');
        expect(list).toBeInTheDocument();
    });

    it('renders links with security attributes', () => {
        render(<ChatbotMessage content="[Click here](https://example.com)" role="assistant" />);
        const link = screen.getByText('Click here');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders tables with wrapper', () => {
        const content = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
        render(<ChatbotMessage content={content} role="assistant" />);
        const tableWrapper = document.querySelector('.table-wrapper');
        expect(tableWrapper).toBeInTheDocument();
        expect(tableWrapper?.querySelector('table')).toBeInTheDocument();
    });

    it('renders complex markdown content', () => {
        const content = `
# Heading

This is a **bold** statement with some *emphasis*.

- Point 1
- Point 2

\`\`\`python
print("Hello")
\`\`\`

[Learn more](https://example.com)
        `.trim();

        render(<ChatbotMessage content={content} role="assistant" />);
        
        // Check for rendered elements
        expect(screen.getByText('Heading')).toBeInTheDocument();
        expect(document.querySelector('.message-strong')).toBeInTheDocument();
        expect(document.querySelector('.code-block')).toBeInTheDocument();
    });

    it('sanitizes malicious content', () => {
        const maliciousContent = '<script>alert("xss")</script>Hello';
        const { container } = render(<ChatbotMessage content={maliciousContent} role="assistant" />);
        
        // Script tags should not be in the output
        expect(container.querySelector('script')).not.toBeInTheDocument();
        
        // Content should be rendered (react-markdown escapes HTML)
        expect(container.textContent).toContain('Hello');
    });

    it('renders emoji correctly', () => {
        render(<ChatbotMessage content="Hello 👋 World 🌍" role="assistant" />);
        expect(screen.getByText('Hello 👋 World 🌍')).toBeInTheDocument();
    });

    it('renders multi-line content', () => {
        const content = 'Line 1\n\nLine 2\n\nLine 3';
        render(<ChatbotMessage content={content} role="assistant" />);
        expect(screen.getByText('Line 1')).toBeInTheDocument();
        expect(screen.getByText('Line 2')).toBeInTheDocument();
        expect(screen.getByText('Line 3')).toBeInTheDocument();
    });

    it('handles empty content gracefully', () => {
        render(<ChatbotMessage content="" role="assistant" />);
        const message = document.querySelector('.chatbot-message');
        expect(message).toBeInTheDocument();
    });

    it('renders blockquotes', () => {
        const content = '> This is a quote\n> Multi-line quote';
        render(<ChatbotMessage content={content} role="assistant" />);
        const blockquote = document.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
    });

    it('renders horizontal rules', () => {
        const content = 'Above\n\n---\n\nBelow';
        render(<ChatbotMessage content={content} role="assistant" />);
        const hr = document.querySelector('hr');
        expect(hr).toBeInTheDocument();
    });
});
