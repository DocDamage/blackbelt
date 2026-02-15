/**
 * Six Sigma Chatbot Component
 * Main UI component that uses extracted modules for logic
 */

import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { ChatbotMessage } from './ChatbotMessage';
import { generateResponse } from './ChatbotResponseGenerator';
import { MIN_TYPING_DELAY, MAX_TYPING_DELAY } from '../../../utils/constants';

// Excel file processing
import * as XLSX from 'xlsx';

interface UploadedData {
    filename: string;
    sheets: {
        name: string;
        data: Record<string, unknown>[];
        columns: string[];
        stats?: Record<string, { mean: number; stddev: number; min: number; max: number; count: number }>;
    }[];
}

function processExcelFile(file: File): Promise<UploadedData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheets = workbook.SheetNames.map(name => {
                    const sheet = workbook.Sheets[name];
                    if (!sheet) return { name, data: [], columns: [], stats: {} };
                    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
                    const columns = jsonData.length > 0 ? Object.keys(jsonData[0] || {}) : [];

                    // Calculate basic stats for numeric columns
                    const stats: Record<string, { mean: number; stddev: number; min: number; max: number; count: number }> = {};
                    columns.forEach(col => {
                        const values = jsonData
                            .map(row => row[col])
                            .filter(v => typeof v === 'number') as number[];

                        if (values.length > 0) {
                            const count = values.length;
                            const mean = values.reduce((a, b) => a + b, 0) / count;
                            const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (count - 1);
                            const stddev = Math.sqrt(variance);
                            const min = Math.min(...values);
                            const max = Math.max(...values);
                            stats[col] = {
                                mean: Math.round(mean * 1000) / 1000,
                                stddev: Math.round(stddev * 1000) / 1000,
                                min,
                                max,
                                count
                            };
                        }
                    });

                    return { name, data: jsonData, columns, stats };
                });

                resolve({ filename: file.name, sheets });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function formatUploadedDataSummary(data: UploadedData): string {
    let summary = `**📁 Uploaded: ${data.filename}**\n\n`;

    data.sheets.forEach(sheet => {
        summary += `### Sheet: ${sheet.name}\n`;
        summary += `- **Rows:** ${sheet.data.length}\n`;
        summary += `- **Columns:** ${sheet.columns.join(', ')}\n\n`;

        if (sheet.stats && Object.keys(sheet.stats).length > 0) {
            summary += `**Numeric Column Statistics:**\n`;
            summary += `| Column | Count | Mean | Std Dev | Min | Max |\n`;
            summary += `|--------|-------|------|---------|-----|-----|\n`;

            Object.entries(sheet.stats).forEach(([col, s]) => {
                summary += `| ${col} | ${s.count} | ${s.mean} | ${s.stddev} | ${s.min} | ${s.max} |\n`;
            });
            summary += '\n';
        }
    });

    summary += `\n**You can now ask:**\n`;
    summary += `- "Calculate Cpk for [column name]"\n`;
    summary += `- "What's the mean of [column name]"\n`;
    summary += `- "Analyze [column name]"\n`;

    return summary;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Welcome to the Six Sigma & Compliance Assistant! 🎯

I can help you with:

• **Six Sigma** - Belt levels, DMAIC, quality tools
• **Compliance** - REACH, SVHC, CLP/GHS
• **Plastics** - Industry-specific regulations

How can I help you today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setMessages(prev => [...prev, { role: 'user', content: `📎 Uploading: ${file.name}` }]);
        setIsTyping(true);

        try {
            const data = await processExcelFile(file);
            setUploadedData(data);
            const summary = formatUploadedDataSummary(data);
            setMessages(prev => [...prev, { role: 'assistant', content: summary }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure it's a valid Excel file (.xlsx, .xls).`
            }]);
        }

        setIsTyping(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, MIN_TYPING_DELAY + Math.random() * (MAX_TYPING_DELAY - MIN_TYPING_DELAY)));

        // Check if query is about uploaded data
        let response: string;
        if (uploadedData && userMessage.toLowerCase().includes('analyze')) {
            // Find column mentioned in query
            const allColumns = uploadedData.sheets.flatMap(s => s.columns);
            const mentionedCol = allColumns.find(col =>
                userMessage.toLowerCase().includes(col.toLowerCase())
            );

            if (mentionedCol) {
                const sheet = uploadedData.sheets.find(s => s.stats && s.stats[mentionedCol]);
                if (sheet && sheet.stats && sheet.stats[mentionedCol]) {
                    const s = sheet.stats[mentionedCol];
                    response = `**📊 Analysis of "${mentionedCol}"**

| Statistic | Value |
|-----------|-------|
| Count | ${s.count} |
| Mean | ${s.mean} |
| Std Dev | ${s.stddev} |
| Min | ${s.min} |
| Max | ${s.max} |
| Range | ${s.max - s.min} |

**To calculate Cpk, provide spec limits:**
\`cpk usl=[upper] lsl=[lower] mean=${s.mean} stddev=${s.stddev}\``;
                } else {
                    response = `Column "${mentionedCol}" found but no numeric data available for analysis.`;
                }
            } else {
                response = `I have data from "${uploadedData.filename}" with columns: ${allColumns.join(', ')}. Which column would you like to analyze?`;
            }
        } else {
            response = generateResponse(userMessage);
        }

        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        'Calculate Cpk',
        'Python code',
        'DOE analysis',
        'Excel formulas',
        'Control chart',
        'Equation sheet'
    ];

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span className="chatbot-header-icon">🤖</span>
                        <div className="chatbot-header-info">
                            <div className="chatbot-header-title">Six Sigma Assistant</div>
                            <div className="chatbot-header-status">● Online</div>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <ChatbotMessage key={index} content={msg.content} role={msg.role} />
                        ))}
                        {isTyping && (
                            <div className="chatbot-message assistant">
                                <div className="chatbot-typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="quick-questions">
                        {quickQuestions.map(q => (
                            <button
                                key={q}
                                className="quick-question"
                                onClick={() => {
                                    setInput(q);
                                    setTimeout(() => handleSend(), 100);
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    <div className="chatbot-input-container">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        <button
                            className="chatbot-upload"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isTyping}
                            title="Upload Excel/CSV file"
                        >
                            📎
                        </button>
                        <input
                            type="text"
                            className="chatbot-input"
                            placeholder="Ask or upload Excel file..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping}
                        />
                        <button
                            className="chatbot-send"
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? 'Close chat' : 'Open chat assistant'}
            >
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    );
}