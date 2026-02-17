/**
 * Comprehensive Six Sigma Chatbot
 * 
 * An all-knowing chatbot that can answer any Six Sigma-related question.
 * 
 * Technical Debt Fix - Issue 61: Added rate limiting to prevent spam
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import './ComprehensiveChatbot.css';
import { getLogger } from '../../utils/logger';
import { comprehensiveResponseGenerator } from './ComprehensiveResponseGenerator';

const logger = getLogger('ComprehensiveChatbot');

// Rate limiting configuration (Issue 61 fix)
const RATE_LIMIT = {
  MIN_QUERY_INTERVAL_MS: 1000, // Minimum 1 second between queries
  MAX_MESSAGES_PER_MINUTE: 20, // Max 20 messages per minute
  MAX_CONVERSATION_LENGTH: 100, // Max 100 messages in conversation
  COOLDOWN_AFTER_ERROR_MS: 3000, // 3 second cooldown after errors
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickQuestion {
  label: string;
  query: string;
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  { label: 'What is DMAIC?', query: 'Explain the DMAIC methodology and each phase' },
  { label: 'REACH', query: 'Explain EU REACH regulation and requirements' },
  { label: 'Calculate Cpk', query: 'How do I calculate Cpk for my process?' },
  { label: 'Prop 65', query: 'What are California Prop 65 requirements?' },
  { label: 'Control Charts', query: 'When should I use different types of control charts?' },
  { label: 'RoHS', query: 'What are RoHS restricted substances?' },
  { label: 'BPA', query: 'What are BPA restrictions globally?' },
  { label: 'Phthalates', query: 'What are phthalate restrictions by region?' }
];

export function ComprehensiveChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '**👋 Welcome to Your Six Sigma & Compliance Assistant!**\n\nI can help you with:\n• **Six Sigma DMAIC** methodology and all phases\n• **Statistical tools** and calculations (Cpk, control charts, sample size)\n• **Six Sigma certification** requirements (White to Black Belt)\n• **Global Compliance** - REACH, RoHS, Prop 65, TSCA, BPA, Phthalates\n• **Plastics regulations** - Food contact, heavy metals, additives\n• **Process improvement** techniques and Lean tools\n• **Formula help** with examples\n\nWhat would you like to learn about?',
      timestamp: new Date(),
      suggestions: ['What is DMAIC?', 'REACH compliance', 'How to calculate Cpk?', 'Prop 65 requirements', 'Control chart selection']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Rate limiting refs (Issue 61 fix)
  const lastQueryTimeRef = useRef<number>(0);
  const queryCountRef = useRef<{ timestamp: number }[]>([]);
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Cleanup cooldown timeout on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Check rate limiting rules (Issue 61 fix)
   * Returns null if allowed, or error message if rate limited
   */
  const checkRateLimit = useCallback((): string | null => {
    const now = Date.now();
    
    // Check minimum interval between queries
    const timeSinceLastQuery = now - lastQueryTimeRef.current;
    if (timeSinceLastQuery < RATE_LIMIT.MIN_QUERY_INTERVAL_MS) {
      const waitTime = Math.ceil((RATE_LIMIT.MIN_QUERY_INTERVAL_MS - timeSinceLastQuery) / 1000);
      return `Please wait ${waitTime} second${waitTime > 1 ? 's' : ''} before sending another message.`;
    }
    
    // Clean up old queries (older than 1 minute)
    queryCountRef.current = queryCountRef.current.filter(
      q => now - q.timestamp < 60000
    );
    
    // Check max messages per minute
    if (queryCountRef.current.length >= RATE_LIMIT.MAX_MESSAGES_PER_MINUTE) {
      return `You've reached the limit of ${RATE_LIMIT.MAX_MESSAGES_PER_MINUTE} messages per minute. Please wait a moment.`;
    }
    
    // Check conversation length
    if (messages.length >= RATE_LIMIT.MAX_CONVERSATION_LENGTH) {
      return `Conversation limit reached (${RATE_LIMIT.MAX_CONVERSATION_LENGTH} messages). Please start a new conversation.`;
    }
    
    return null;
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    const query = inputValue.trim();
    if (!query || isTyping) return;

    // Check rate limiting (Issue 61 fix)
    const rateLimitMessage = checkRateLimit();
    if (rateLimitMessage) {
      setRateLimitError(rateLimitMessage);
      // Clear error after 3 seconds
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
      cooldownTimeoutRef.current = setTimeout(() => {
        setRateLimitError(null);
      }, 3000);
      return;
    }

    // Record this query for rate limiting
    lastQueryTimeRef.current = Date.now();
    queryCountRef.current.push({ timestamp: Date.now() });
    setRateLimitError(null);

    logger.info('User query', { query });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await comprehensiveResponseGenerator(query);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      logger.error('Error generating response', { error, query });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try rephrasing your question.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      // Apply cooldown after error (Issue 61 fix)
      lastQueryTimeRef.current = Date.now() + RATE_LIMIT.COOLDOWN_AFTER_ERROR_MS;
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, logger, checkRateLimit]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: QuickQuestion) => {
    setInputValue(question.query);
    setTimeout(() => handleSend(), 100);
  };

  const formatMessageContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="comprehensive-chatbot">
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span>✕</span>
        ) : (
          <>
            <span className="chatbot-icon">💬</span>
            <span className="chatbot-label">Ask Me Anything</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label="Six Sigma Assistant">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <span className="chatbot-avatar">🎓</span>
              <div className="chatbot-title">
                <h3>Six Sigma Assistant</h3>
                <span className="chatbot-status">Online - Ask me anything!</span>
              </div>
            </div>
            <button 
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages" role="log" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'assistant' ? '🎓' : '👤'}
                </div>
                <div className="message-content">
                  <div 
                    className="message-text"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessageContent(message.content) 
                    }}
                  />
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="message-suggestions">
                      <span className="suggestions-label">Related:</span>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="suggestion-chip"
                          onClick={() => handleQuickQuestion({ label: suggestion, query: suggestion })}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant typing">
                <div className="message-avatar">🎓</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-questions">
            <span className="quick-label">Quick Questions:</span>
            <div className="quick-chips">
              {QUICK_QUESTIONS.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  className="quick-chip"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question.label}
                </button>
              ))}
            </div>
          </div>

          {rateLimitError && (
            <div className="chatbot-rate-limit-error" role="alert">
              <span className="rate-limit-icon">⏱️</span>
              <span className="rate-limit-text">{rateLimitError}</span>
            </div>
          )}

          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about DMAIC, statistics, certification..."
              className="chatbot-input"
              aria-label="Type your question"
              disabled={isTyping || !!rateLimitError}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || !!rateLimitError}
              className="chatbot-send"
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComprehensiveChatbot;
