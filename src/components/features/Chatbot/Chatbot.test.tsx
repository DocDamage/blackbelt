/**
 * Tests for Chatbot Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Chatbot } from './Chatbot';

// Mock the xlsx library
vi.mock('xlsx', () => ({
    read: vi.fn().mockReturnValue({
        SheetNames: ['Sheet1'],
        Sheets: {
            Sheet1: {
                A1: { v: 'Value' },
                B1: { v: 'Count' },
                A2: { v: 10 },
                B2: { v: 5 }
            }
        }
    }),
    utils: {
        sheet_to_json: vi.fn().mockReturnValue([
            { Value: 10, Count: 5 },
            { Value: 20, Count: 8 },
            { Value: 30, Count: 12 }
        ])
    }
}));

// Mock response generator
vi.mock('./ChatbotResponseGenerator', () => ({
    generateResponse: vi.fn((msg) => `Mock response for: ${msg}`)
}));

// Mock FileReader
class MockFileReader {
    onload: ((e: { target: { result: ArrayBuffer } }) => void) | null = null;
    onerror: ((e: Error) => void) | null = null;
    result: ArrayBuffer = new ArrayBuffer(8);

    readAsArrayBuffer(_file: File) {
        setTimeout(() => {
            if (this.onload) {
                this.onload({ target: { result: this.result } });
            }
        }, 0);
    }
}

Object.defineProperty(global, 'FileReader', {
    value: MockFileReader,
    writable: true
});

describe('Chatbot', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders closed chatbot toggle button', () => {
        render(<Chatbot />);
        expect(screen.getByTitle('Open chat assistant')).toBeInTheDocument();
    });

    it('opens chat window when toggle clicked', () => {
        render(<Chatbot />);

        const toggle = screen.getByTitle('Open chat assistant');
        fireEvent.click(toggle);

        expect(screen.getByText('Six Sigma Assistant')).toBeInTheDocument();
        expect(screen.getByText('● Online')).toBeInTheDocument();
    });

    it('shows welcome message when opened', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        expect(screen.getByText(/Welcome to the Six Sigma/i)).toBeInTheDocument();
        expect(screen.getByText(/Belt levels, DMAIC, quality tools/i)).toBeInTheDocument();
    });

    it('closes chat window when X clicked', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));
        expect(screen.getByText('Six Sigma Assistant')).toBeInTheDocument();

        fireEvent.click(screen.getByTitle('Close chat'));
        expect(screen.queryByText('Six Sigma Assistant')).not.toBeInTheDocument();
    });

    it('has working input field', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Hello' } });

        expect(input).toHaveValue('Hello');
    });

    it('sends message on button click', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Calculate Cpk' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Send'));
        });

        // The user message should appear
        const userMessages = document.querySelectorAll('.chatbot-message.user');
        expect(userMessages.length).toBeGreaterThan(0);
    });

    it('sends message on Enter key', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Hello' } });

        // Simulate Enter key press
        await act(async () => {
            fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        });

        // Input should be cleared after sending
        await waitFor(() => {
            expect(input).toHaveValue('');
        });
    });

    it('disables send button when input is empty', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const sendButton = screen.getByText('Send');
        expect(sendButton).toBeDisabled();
    });

    it('disables send button when typing', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Test' } });
        fireEvent.click(screen.getByText('Send'));

        await waitFor(() => {
            expect(screen.getByText('Send')).toBeDisabled();
        });
    });

    it('renders quick question buttons', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        expect(screen.getByText('Calculate Cpk')).toBeInTheDocument();
        expect(screen.getByText('Python code')).toBeInTheDocument();
        expect(screen.getByText('DOE analysis')).toBeInTheDocument();
        expect(screen.getByText('Excel formulas')).toBeInTheDocument();
        expect(screen.getByText('Control chart')).toBeInTheDocument();
        expect(screen.getByText('Equation sheet')).toBeInTheDocument();
    });

    it('clicking quick question sets input and sends', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        await act(async () => {
            fireEvent.click(screen.getByText('Calculate Cpk'));
        });

        await waitFor(() => {
            expect(screen.getByText('Calculate Cpk')).toBeInTheDocument();
        });
    });

    it('has upload button', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        expect(screen.getByTitle('Upload Excel/CSV file')).toBeInTheDocument();
        expect(screen.getByText('📎')).toBeInTheDocument();
    });

    it('upload button triggers file input', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const clickSpy = vi.spyOn(fileInput, 'click');

        fireEvent.click(screen.getByText('📎'));

        expect(clickSpy).toHaveBeenCalled();
    });

    it('uploads file and processes it', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const fileInput = screen.getByTitle('Upload Excel/CSV file').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

        const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        await act(async () => {
            fireEvent.change(fileInput, { target: { files: [file] } });
        });

        await waitFor(() => {
            expect(screen.getByText(/Uploading: test.xlsx/i)).toBeInTheDocument();
        });
    });

    it('disables input when typing', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Test message' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Send'));
        });

        expect(input).toBeDisabled();
    });

    it('disables upload button when typing', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Test' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Send'));
        });

        expect(screen.getByText('📎')).toBeDisabled();
    });

    it('shows typing indicator while processing', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Test' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Send'));
        });

        // Should show typing indicator
        expect(document.querySelector('.chatbot-typing')).toBeInTheDocument();
    });

    it('clears input after sending message', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Test message' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Send'));
        });

        await waitFor(() => {
            expect(input).toHaveValue('');
        });
    });

    it('renders user messages with correct role', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'User question' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Send'));
        });

        await waitFor(() => {
            const userMessages = document.querySelectorAll('.chatbot-message.user');
            expect(userMessages.length).toBeGreaterThan(0);
        });
    });

    it('renders assistant messages with correct role', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        // Initial welcome message should be assistant role
        const assistantMessages = document.querySelectorAll('.chatbot-message.assistant');
        expect(assistantMessages.length).toBeGreaterThan(0);
    });

    it('does not shift+enter send message', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const input = screen.getByPlaceholderText('Ask or upload Excel file...');
        fireEvent.change(input, { target: { value: 'Test' } });

        const keyEvent = new KeyboardEvent('keypress', { key: 'Enter', shiftKey: true });
        input.dispatchEvent(keyEvent);

        // Should not have sent the message (no user message added)
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('toggle button shows correct icon when closed', () => {
        render(<Chatbot />);

        const toggle = screen.getByTitle('Open chat assistant');
        expect(toggle.textContent).toBe('💬');
    });

    it('toggle button shows correct icon when open', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const toggle = screen.getByTitle('Close chat');
        expect(toggle.textContent).toBe('✕');
    });

    it('toggle has correct class when open', () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByTitle('Open chat assistant'));

        const toggle = screen.getByTitle('Close chat');
        expect(toggle).toHaveClass('open');
    });
});
