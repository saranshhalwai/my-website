"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, sendMessage } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),
    });

    // Check if the AI is currently generating a response
    const isLoading = messages.length > 0 && messages[messages.length - 1].role === "user";

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-full max-w-[350px] sm:max-w-[400px] z-[100] overflow-hidden flex flex-col bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl h-[500px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-white/10 bg-indigo-50/50 dark:bg-indigo-900/20">
                            <div className="flex items-center gap-2">
                                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-full text-indigo-600 dark:text-indigo-400">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                                        Ask My AI <Sparkles size={14} className="text-indigo-500" />
                                    </h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Powered by Groq & GitHub
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                                aria-label="Close chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-10">
                                    <span className="block text-2xl mb-2">👋</span>
                                    Hi! I&apos;m Saransh&apos;s AI clone. Ask me about his projects, skills, or experience!
                                </div>
                            )}
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === "user"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/5"
                                            }`}
                                    >
                                        {m.parts.map((part, index) => {
                                            if (part.type === "text") {
                                                return <span key={`${m.id}-text-${index}`}>{part.text}</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-2 border border-zinc-200 dark:border-white/5 flex gap-1 items-center h-9">
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!input.trim()) return;
                                    sendMessage({
                                        role: "user",
                                        parts: [{ type: "text", text: input }],
                                    });
                                    setInput("");
                                }}
                                className="flex items-center gap-2 relative"
                            >
                                <input
                                    name="chat-input"
                                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-zinc-100 dark:placeholder-zinc-500 transition-shadow"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    autoComplete="off"
                                    maxLength={300}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-1 top-1 bottom-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition-colors flex items-center justify-center"
                                >
                                    <Send size={14} className="ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center z-[100]"
                aria-label="Toggle chat"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </>
    );
}
