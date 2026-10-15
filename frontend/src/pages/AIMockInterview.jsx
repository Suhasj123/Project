import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { FeedbackCard } from '../components/FeedbackCard';
import { WhiteboardCanvas } from '../components/WhiteboardCanvas';
import { AudioWaveformVisualizer } from '../components/AudioWaveformVisualizer';
import { LottieAnimationPlayer } from '../components/LottieAnimationPlayer';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Award,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Sliders,
  MessageSquare,
  Activity
} from 'lucide-react';

export const AIMockInterview = () => {
  const { addToast } = useToast();

  // Setup State
  const [setupConfig, setSetupConfig] = useState({
    role: 'Full Stack Engineer',
    type: 'Technical',
    difficulty: 'Medium'
  });

  const [sessionId, setSessionId] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Chat stream
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  // Speech Recognition & Speech Synthesis State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Web Speech API: Initialize SpeechRecognition if available
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setInputText(finalTranscript);
      };

      recognitionRef.current.onerror = (e) => {
        console.warn('[Speech Recognition Error]', e);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      addToast('Web Speech API is not supported in this browser.', 'warning');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      addToast('Voice input stopped.', 'info');
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      addToast('Listening... Speak your answer now.', 'info');
    }
  };

  const speakText = (text) => {
    if (ttsEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Session
  const handleStartInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/ai/mock-interview/start', setupConfig);
      setSessionId(res.data.sessionId);
      const firstQ = { sender: 'ai', text: res.data.question, category: res.data.category, timestamp: new Date() };
      setMessages([firstQ]);
      setInterviewStarted(true);
      setInterviewEnded(false);
      setEvaluation(null);
      addToast(`Mock Interview Started (${setupConfig.type} - ${setupConfig.difficulty})`, 'success');
      speakText(res.data.question);
    } catch (err) {
      addToast('Failed to start AI Mock Interview.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer & Fetch Dynamic Follow-up
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg = { sender: 'candidate', text: inputText.trim(), timestamp: new Date() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setLoading(true);

    try {
      const res = await API.post('/ai/mock-interview/respond', {
        sessionId,
        role: setupConfig.role,
        type: setupConfig.type,
        conversationHistory: newHistory,
        latestAnswer: userMsg.text
      });

      if (res.data.interview_complete) {
        addToast('All interview rounds completed! Generating session evaluation report...', 'info');
        handleEndInterview(newHistory);
      } else if (res.data.question) {
        const aiMsg = { sender: 'ai', text: res.data.question, category: res.data.category || 'Follow-up', timestamp: new Date() };
        setMessages(prev => [...prev, aiMsg]);
        speakText(res.data.question);
      }
    } catch (err) {
      addToast('Error fetching follow-up question.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // End Interview & Trigger Evaluation
  const handleEndInterview = async (historyToEvaluate = messages) => {
    setLoading(true);
    try {
      const res = await API.post('/ai/evaluate-answer', {
        role: setupConfig.role,
        type: setupConfig.type,
        transcript: historyToEvaluate
      });
      setEvaluation(res.data);
      setInterviewEnded(true);
      addToast('Mock Interview Evaluation Completed!', 'success');
    } catch (err) {
      addToast('Failed to generate final evaluation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-brand-purple via-indigo-700 to-brand-blue text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
              <Bot className="w-3.5 h-3.5" />
              <span>AI MOCK INTERVIEW BOT</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Adaptive AI Mock Interviewer
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl">
              Simulate live 1-on-1 interviews with dynamic Claude AI follow-up questions, speech-to-text voice input, and STAR feedback cards.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                ttsEnabled ? 'bg-emerald-500 text-white shadow' : 'bg-white/20 text-white'
              }`}
              title="Toggle AI Text-to-Speech"
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{ttsEnabled ? 'Voice Reader ON' : 'Voice Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Setup Form Card */}
      {!interviewStarted && (
        <div className="glass-card max-w-2xl mx-auto p-8 space-y-6">
          
          <div className="text-center space-y-3">
            <div className="mx-auto w-24 h-24 flex items-center justify-center">
              <LottieAnimationPlayer animationType="aiBrain" className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Configure Your AI Mock Interview Round
            </h2>
            <p className="text-xs text-gray-500">
              Select your targeted job role, interview category, and difficulty level.
            </p>
          </div>

          <form onSubmit={handleStartInterview} className="space-y-5 text-xs">
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-200 block mb-1.5">Target Job Role:</label>
              <select
                value={setupConfig.role}
                onChange={(e) => setSetupConfig(prev => ({ ...prev, role: e.target.value }))}
                className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-purple"
              >
                <option value="Software Engineer">Software Engineer (General SDE)</option>
                <option value="Full Stack Engineer">Full Stack Engineer (React + Node)</option>
                <option value="Backend Developer">Backend Developer (Python / Java / Microservices)</option>
                <option value="Frontend Developer">Frontend Developer (React / Web Performance)</option>
                <option value="AI/ML Engineer">AI/ML Engineer (LLMs / PyTorch / Computer Vision)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-200 block mb-1.5">Interview Round Type:</label>
                <select
                  value={setupConfig.type}
                  onChange={(e) => setSetupConfig(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg font-semibold focus:outline-none"
                >
                  <option value="Technical">Technical Concepts & Data Structures</option>
                  <option value="Behavioral">Behavioral & STAR Leadership Stories</option>
                  <option value="System Design">System Architecture & Scalability</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-200 block mb-1.5">Difficulty Level:</label>
                <select
                  value={setupConfig.difficulty}
                  onChange={(e) => setSetupConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg font-semibold focus:outline-none"
                >
                  <option value="Easy">Easy (Entry Level / Intern)</option>
                  <option value="Medium">Medium (Mid Level SDE)</option>
                  <option value="Hard">Hard (Senior SDE / Tech Lead)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-4 rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Initializing Claude AI Session...' : 'Start AI Mock Interview 🚀'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Active Mock Interview Chat Stream */}
      {interviewStarted && (
        <div className="space-y-6">
          
          {/* Active Session Info Bar */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded">
                  {setupConfig.type} • {setupConfig.difficulty}
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white ml-2">
                  Role: {setupConfig.role}
                </span>
              </div>
            </div>

            {!interviewEnded && (
              <button
                onClick={() => handleEndInterview(messages)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-extrabold text-xs transition"
              >
                End Interview & Evaluate 🏁
              </button>
            )}
          </div>

          {/* Chat Stream Window */}
          <div className="glass-card p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${msg.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl p-4 rounded-2xl space-y-1 ${
                  msg.sender === 'candidate'
                    ? 'bg-brand-purple text-white rounded-br-none shadow-md'
                    : 'bg-gray-100 dark:bg-dark-border/60 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-dark-border'
                }`}>
                  {msg.category && msg.sender === 'ai' && (
                    <span className="text-[10px] font-extrabold uppercase text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded inline-block mb-1">
                      {msg.category}
                    </span>
                  )}
                  <p className="leading-relaxed font-sans text-xs">{msg.text}</p>
                </div>

                {msg.sender === 'candidate' && (
                  <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center shrink-0 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Embedded System Design Whiteboard Canvas */}
          {setupConfig.type === 'System Design' && (
            <WhiteboardCanvas scheduleId="mock_system_design" sessionId={activeSessionId} />
          )}

          {/* Audio Waveform Visualizer */}
          {!interviewEnded && (
            <AudioWaveformVisualizer
              isActive={isListening || isSpeaking}
              mode={isListening ? 'listening' : 'speaking'}
            />
          )}

          {/* Input & Voice Controls (when active) */}
          {!interviewEnded && (
            <form onSubmit={handleSendMessage} className="glass-card p-3 flex items-center gap-3">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-xl transition ${
                  isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300'
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Listening... Speak your answer now" : "Type your answer or use voice input..."}
                className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-brand-purple focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="btn-gradient p-3 rounded-xl shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Render FeedbackCard when session is evaluated */}
          {evaluation && <FeedbackCard evaluation={evaluation} />}
        </div>
      )}
    </div>
  );
};
