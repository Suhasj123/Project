import React, { useState } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Code2,
  Database,
  FileText,
  User
} from 'lucide-react';

export const AIMentor = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'mentor',
      text: "Hello! I am your 24/7 AI Placement Mentor. Ask me any doubt on OOPs, DBMS, SQL queries, DSA, or interview tips!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const quickPrompts = [
    'Explain OOPs Concepts',
    'What is DBMS & ACID Properties?',
    'Difference between Stack and Queue',
    'Top 5 SQL Queries for Placements',
    'Resume Formatting Tips'
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await API.post('/mentor/chat', { query });
      setMessages([...newMsgs, { sender: 'mentor', text: res.data.reply }]);
    } catch (err) {
      addToast('Error fetching mentor response.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Placement Mentor</h1>
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online 24/7 Support
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-400 font-medium hidden sm:block">
          AI Placement Assistance Mode
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/80 dark:bg-dark-card/80 border border-gray-200 dark:border-dark-border hover:border-brand-purple text-gray-700 dark:text-gray-300 transition shadow-sm"
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="glass-card p-6 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
              msg.sender === 'user' ? 'bg-brand-blue text-white' : 'bg-brand-purple text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-brand-blue text-white rounded-tr-none font-medium'
                : 'bg-gray-100 dark:bg-dark-border text-gray-900 dark:text-white rounded-tl-none space-y-2'
            }`}>
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center animate-spin">
              <Bot className="w-3.5 h-3.5 text-brand-purple" />
            </div>
            <span>Mentor is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Controls */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="flex items-center gap-3 glass-card p-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask any question (e.g. Explain OOPs, What is DBMS, How to write SQL JOIN)..."
          className="flex-1 p-3 rounded-xl bg-transparent text-xs text-gray-900 dark:text-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-gradient p-3 rounded-xl text-white font-bold disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
