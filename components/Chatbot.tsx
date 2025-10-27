import React, { useState, useEffect, useRef } from 'react';
import { getChatSession } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';

export const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatSession = useRef(getChatSession());

    // Auto-scroll to the latest message.
    // This effect triggers whenever the number of messages changes or the
    // content of the last message is updated (during streaming).
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, messages[messages.length - 1]?.text]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chatSession.current.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            
            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* FIX: Updated model name in UI to match service. */}
            <h3 className="text-lg font-semibold text-brand-blue mb-4">Chat Assistant (gemini-flash-lite-latest)</h3>
            <div className="h-80 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4 border">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-brand-lightblue text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length-1]?.role === 'user' && (
                     <div className="flex justify-start">
                        <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                           <LoadingSpinner className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-brand-lightblue focus:border-brand-lightblue"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2 bg-brand-lightblue text-white rounded-r-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue disabled:bg-gray-400"
                >
                    {isLoading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );
};
