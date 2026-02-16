/**
 * AI Mentor Component
 * 
 * Provides AI-powered guidance for Six Sigma projects
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    createConversation,
    getConversation,
    generateMentorResponse,
    getQuickGuidance,
    QuickGuidance,
    MentorMessage,
} from './aiMentor.db';
import './AIMentor.css';

const USER_ID = 'current-user';

const SUGGESTED_QUESTIONS = [
    'How do I write a good project charter?',
    'What measurement system should I use?',
    'How do I interpret Cpk values?',
    'Which hypothesis test is right for my data?',
    'How do I identify root causes?',
    'What should be in my control plan?',
];

export function AIMentor() {
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MentorMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [quickGuidance, setQuickGuidance] = useState<QuickGuidance[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load quick guidance on mount
    useEffect(() => {
        getQuickGuidance().then(setQuickGuidance);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startConversation = async () => {
        const id = await createConversation(USER_ID);
        setConversationId(id);
        const conversation = await getConversation(id);
        if (conversation) {
            setMessages(conversation.messages);
        }
    };

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || !conversationId) return;

        // Add user message to UI immediately
        const userMessage: MentorMessage = {
            id: `temp-${Date.now()}`,
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Get AI response
            await generateMentorResponse(conversationId, content.trim());
            
            // Reload messages from database to get proper ordering
            const conversation = await getConversation(conversationId);
            if (conversation) {
                setMessages(conversation.messages);
            }
        } catch (error) {
            console.error('Failed to get response:', error);
        } finally {
            setIsTyping(false);
        }
    }, [conversationId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const formatTime = (date: Date): string => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(date));
    };

    // Format message content with markdown-like styling
    const formatMessage = (content: string): string => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    };

    if (!conversationId) {
        return (
            <div className="mentor-container">
                <div className="mentor-welcome">
                    <div className="mentor-welcome-icon">🎓</div>
                    <h2>AI Six Sigma Mentor</h2>
                    <p>
                        Get expert guidance on your DMAIC projects. I can help with tool selection, 
                        data interpretation, methodology questions, and problem-solving approaches.
                    </p>
                    <button className="mentor-start-btn" onClick={startConversation}>
                        Start Conversation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mentor-container">
            <div className="mentor-header">
                <h1 className="mentor-title">🎓 AI Six Sigma Mentor</h1>
                <p className="mentor-subtitle">Ask questions about methodology, tools, or your specific project</p>
            </div>

            {/* Quick Guidance Chips */}
            <div className="mentor-quick-guidance">
                <div className="mentor-quick-title">Quick Guidance</div>
                <div className="mentor-quick-chips">
                    {quickGuidance.map(item => (
                        <button
                            key={item.id}
                            className="mentor-quick-chip"
                            onClick={() => sendMessage(item.question)}
                            title={item.answer.substring(0, 100) + '...'}
                        >
                            {item.category}: {item.question}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="mentor-chat">
                <div className="mentor-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`mentor-message ${message.role}`}
                        >
                            <div className={`mentor-avatar ${message.role}`}>
                                {message.role === 'assistant' ? '🤖' : '👤'}
                            </div>
                            <div>
                                <div
                                    className="mentor-bubble"
                                    dangerouslySetInnerHTML={{
                                        __html: formatMessage(message.content),
                                    }}
                                />
                                <div className="mentor-timestamp">
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="mentor-message assistant">
                            <div className="mentor-avatar assistant">🤖</div>
                            <div className="mentor-bubble">
                                <div className="mentor-typing">
                                    <div className="mentor-typing-dot"></div>
                                    <div className="mentor-typing-dot"></div>
                                    <div className="mentor-typing-dot"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length < 3 && (
                    <div className="mentor-suggestions">
                        <div className="mentor-suggestions-title">Try asking:</div>
                        <div className="mentor-suggestion-chips">
                            {SUGGESTED_QUESTIONS.map((question, index) => (
                                <button
                                    key={index}
                                    className="mentor-suggestion-chip"
                                    onClick={() => sendMessage(question)}
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="mentor-input-area">
                    <form className="mentor-input-form" onSubmit={handleSubmit}>
                        <textarea
                            className="mentor-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Ask about Six Sigma methodology, tools, or your project..."
                            rows={1}
                        />
                        <button
                            type="submit"
                            className="mentor-send-btn"
                            disabled={!input.trim() || isTyping}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AIMentor;
