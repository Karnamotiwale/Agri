// ============================================
// CHAT WIDGET — Global Floating FAB
// Real endpoint: POST /api/v1/chat
// ============================================
import React, { useState, useRef, useEffect } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
}

// Mock response — replace with: POST /api/v1/chat { message }
async function mockChatResponse(userMessage: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    const lower = userMessage.toLowerCase();
    if (lower.includes('irrig')) return '💧 Based on current soil moisture (38%) and the weather forecast, I recommend irrigating for 25 minutes in Zone A. No irrigation needed in Zone B.';
    if (lower.includes('disease') || lower.includes('pest')) return '🔬 No active disease alerts detected. Leaf blight risk is LOW this week. Continue preventive spraying schedule.';
    if (lower.includes('weather')) return '🌤️ Forecast: Sunny with 28°C high. No rain expected for 5 days. Increase irrigation slightly to compensate.';
    if (lower.includes('yield') || lower.includes('harvest')) return '🌾 Predicted yield for this season: 4.2 tonnes/ha — 8% above average. Harvest window opens in ~3 weeks.';
    if (lower.includes('fertiliz')) return '🌱 Nitrogen application recommended: 50 kg/ha via broadcasting. Best applied early morning or evening.';
    return '🤖 I\'m your KisaanSaathi AI assistant. Ask me about irrigation, crop health, weather, yield predictions, or fertilizer recommendations!';
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            text: '🌾 Namaste! I\'m KisaanSaathi, your AI farming assistant. How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            inputRef.current?.focus();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        const text = inputValue.trim();
        if (!text || isLoading) return;

        const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text, timestamp: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const reply = await mockChatResponse(text);
            const botMsg: Message = { id: `b-${Date.now()}`, role: 'assistant', text: reply, timestamp: new Date() };
            setMessages((prev) => [...prev, botMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { id: `err-${Date.now()}`, role: 'assistant', text: '⚠️ Unable to reach the AI. Please try again.', timestamp: new Date() },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                id="chat-widget-fab"
                onClick={() => setIsOpen((v) => !v)}
                aria-label="Open AI Chat"
                style={{
                    position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
                    width: '58px', height: '58px', borderRadius: '50%', border: 'none',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    boxShadow: '0 4px 24px rgba(34,197,94,0.45)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '26px', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
                {isOpen ? '✕' : '🌾'}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div
                    id="chat-widget-panel"
                    style={{
                        position: 'fixed', bottom: '100px', right: '28px', zIndex: 9998,
                        width: '360px', maxHeight: '520px',
                        display: 'flex', flexDirection: 'column',
                        borderRadius: '18px', overflow: 'hidden',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.28)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                        animation: 'chatSlideUp 0.25s ease-out',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                        }}>🌾</div>
                        <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px', lineHeight: 1.2 }}>KisaanSaathi AI</div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                {isLoading ? 'Thinking…' : '🟢 Online'}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '16px 14px',
                        background: '#0f1a14', display: 'flex', flexDirection: 'column', gap: '12px',
                    }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '82%', padding: '10px 14px', borderRadius: '14px',
                                        fontSize: '13.5px', lineHeight: '1.5',
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                            : 'rgba(255,255,255,0.07)',
                                        color: msg.role === 'user' ? '#fff' : '#d1fae5',
                                        borderBottomRightRadius: msg.role === 'user' ? '4px' : '14px',
                                        borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '14px',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', gap: '5px', padding: '6px 14px' }}>
                                {[0, 1, 2].map((i) => (
                                    <div key={i} style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: '#22c55e', opacity: 0.7,
                                        animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                                    }} />
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        background: '#0f1a14', borderTop: '1px solid rgba(255,255,255,0.08)',
                        padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'center',
                    }}>
                        <input
                            ref={inputRef}
                            id="chat-widget-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about irrigation, crops, weather…"
                            disabled={isLoading}
                            style={{
                                flex: 1, padding: '10px 14px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.15)',
                                background: 'rgba(255,255,255,0.06)', color: '#f0fdf4',
                                fontSize: '13.5px', outline: 'none', fontFamily: 'inherit',
                            }}
                        />
                        <button
                            id="chat-widget-send"
                            onClick={handleSend}
                            disabled={isLoading || !inputValue.trim()}
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                                background: inputValue.trim() ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.1)',
                                color: '#fff', cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                                fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s', flexShrink: 0,
                            }}
                        >➤</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1); }
                }
                @keyframes chatDot {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                    40%           { transform: scale(1);   opacity: 1; }
                }
            `}</style>
        </>
    );
}
