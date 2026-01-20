import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Globe } from 'lucide-react';

const AIChat = ({ isDarkMode, translations: t }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "bot",
            content: "Chào bạn! Tôi là trợ lý AI của AutoPrestige.\nTôi có thể tra cứu giá xe thực tế trên Internet và giải đáp mọi thắc mắc về định giá.\n\n*Ví dụ: 'Giá xe Mercedes C200 2020 trên thị trường là bao nhiêu?'*"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Auto scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput(""); // Clear input
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsTyping(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: "bot", content: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: "bot", content: "⚠️ Mất kết nối với máy chủ AI." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-4xl mx-auto h-[75vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-900/80 border-white/10 backdrop-blur-xl' : 'bg-white/90 border-white/60 shadow-indigo-500/20'
                }`}
        >
            {/* Header */}
            <div className={`p-4 border-b flex items-center gap-3 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-indigo-50/50 border-indigo-100'
                }`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Sparkles size={20} className="text-white" />
                </div>
                <div>
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.chatTitle}</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs text-gray-500 font-medium">Gemini Pro • Internet Access</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'bot'
                                ? 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white'
                                : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-200 text-slate-600')
                            }`}>
                            {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : (isDarkMode ? 'bg-gray-800 text-gray-200 rounded-tl-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none')
                            }`}>
                            {msg.content.split('\n').map((line, i) => (
                                <p key={i} className={`mb-1 ${line.startsWith('-') ? 'ml-4' : ''}`}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className={`px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-white/10 bg-gray-900/50' : 'border-slate-100 bg-white/50'}`}>
                <div className="relative flex items-center">
                    <div className="absolute left-4 text-gray-400">
                        <Globe size={20} />
                    </div>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t.chatPlaceholder}
                        className={`w-full py-4 pl-12 pr-14 rounded-xl outline-none transition-all ${isDarkMode
                                ? 'bg-gray-800 text-white placeholder-gray-500 focus:bg-gray-700'
                                : 'bg-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                            }`}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className={`absolute right-2 p-2 rounded-lg transition-all ${input.trim()
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                                : 'bg-transparent text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AIChat;