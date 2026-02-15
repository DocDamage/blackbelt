/**
 * Chatbot Message Component
 * Safely renders markdown content using react-markdown
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatbotMessage.css';

interface ChatbotMessageProps {
    content: string;
    role: 'user' | 'assistant';
}

/**
 * Safely renders chatbot messages with markdown support
 * Replaces dangerouslySetInnerHTML with react-markdown for XSS protection
 */
export function ChatbotMessage({ content, role }: ChatbotMessageProps) {
    return (
        <div className={`chatbot-message ${role}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom styling for code blocks
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        if (isInline) {
                            return <code className="inline-code" {...props}>{children}</code>;
                        }
                        return (
                            <code className={`code-block ${className || ''}`} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Custom styling for tables
                    table({ children }) {
                        return <div className="table-wrapper"><table>{children}</table></div>;
                    },
                    // Custom styling for links (security: open in new tab)
                    a({ href, children }) {
                        return (
                            <a href={href} target="_blank" rel="noopener noreferrer">
                                {children}
                            </a>
                        );
                    },
                    // Styling for lists
                    ul({ children }) {
                        return <ul className="message-list">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="message-list ordered">{children}</ol>;
                    },
                    // Strong and emphasis
                    strong({ children }) {
                        return <strong className="message-strong">{children}</strong>;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

export default ChatbotMessage;