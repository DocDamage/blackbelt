/**
 * Comprehensive Six Sigma Chatbot
 * 
 * An all-knowing chatbot that can answer any Six Sigma-related question.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import './ComprehensiveChatbot.css';
import { getLogger } from '../../utils/logger';
import { comprehensiveResponseGenerator } from './ComprehensiveResponseGenerator';

const logger = getLogger('ComprehensiveChatbot');

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
  { label: 'Calculate Cpk', query: 'How do I calculate Cpk for my process?' },
  { label: 'Control Charts', query: 'When should I use different types of control charts?' },
  { label: 'Sample Size', query: 'How do I calculate the required sample size?' },
  { label: '5 Whys', query: 'How do I perform a 5 Whys analysis?' },
  { label: 'Gage R&R', query: 'How do I conduct a Gage R&R study?' },
  { label: 'Hypothesis Test', query: 'Which hypothesis test should I use?' },
  { label: 'Certification', query: 'What are the requirements for Six Sigma certification?' }
];

export function ComprehensiveChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '**👋 Welcome to Your Six Sigma Assistant!**\n\nI can help you with:\n• **DMAIC methodology** and all phases\n• **Statistical tools** and calculations\n• **Six Sigma certification** requirements\n• **Process improvement** techniques\n• **Study guidance** for your belt level\n• **Formula help** and examples\n\nWhat would you like to learn about?',
      timestamp: new Date(),
      suggestions: ['What is DMAIC?', 'How to calculate Cpk?', 'Control chart selection']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = useCallback(async () => {
    const query = inputValue.trim();
    if (!query || isTyping) return;

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
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, logger]);

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
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
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
