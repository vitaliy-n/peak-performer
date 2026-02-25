import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export const AICoach: React.FC = () => {
  const { user, aiCoach, addChatMessage, setAITyping } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiCoach.messages, aiCoach.isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Add user message
    addChatMessage({
      role: 'user',
      content: userMessage,
      type: 'text',
    });

    // Simulate AI thinking
    setAITyping(true);

    // Simulate AI response (mock for now)
    setTimeout(() => {
      setAITyping(false);
      
      let response = '';
      if (userMessage.toLowerCase().includes('привіт')) {
        response = `Привіт, ${user?.name}! Готовий працювати над твоїми цілями?`;
      } else if (userMessage.toLowerCase().includes('ціль') || userMessage.toLowerCase().includes('мета')) {
        response = 'Чудово, що ти фокусуєшся на цілях. Давай розіб’ємо твою мету на менші кроки за методикою SMART.';
      } else if (userMessage.toLowerCase().includes('звичк')) {
        response = 'Звички - фундамент успіху. Пам’ятай про правило 2 хвилин: нова звичка має займати менше 2 хвилин на старті.';
      } else {
        response = 'Я зрозумів. Це цікава думка. Як це співвідноситься з твоїм головним пріоритетом на цей тиждень?';
      }

      addChatMessage({
        role: 'assistant',
        content: response,
        type: 'text',
      });
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100">AI Coach</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Твій персональний ментор</p>
          </div>
        </div>
        <div className="flex gap-2">
           {/* Future actions: Clear chat, Settings */}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex justify-center my-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Coach використовує методики Peak Performer</span>
          </div>
        </div>

        {aiCoach.messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-indigo-500 text-white'
              }`}>
                {message.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`p-4 rounded-2xl shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                <div className={`text-[10px] mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {aiCoach.isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[80%] gap-3 flex-row">
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2">
           {/* Quick Actions / Suggestions could go here */}
        </div>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Запитай про свої цілі, звички або попроси поради..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-[52px] max-h-32 min-h-[52px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || aiCoach.isTyping}
            className="absolute right-2 top-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {aiCoach.isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          AI може робити помилки. Перевіряйте важливу інформацію.
        </p>
      </div>
    </div>
  );
};
