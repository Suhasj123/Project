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
  AlertTriangle,
  RefreshCw,
  Sliders,
  MessageSquare,
  Activity,
  Radio,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp
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
  const [interimText, setInterimText] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  // Speech Recognition & Speech Synthesis State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [autoListenAfterAI, setAutoListenAfterAI] = useState(false);
  const [micPermissionStatus, setMicPermissionStatus] = useState('unknown'); // 'unknown', 'granted', 'denied', 'unsupported'

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, interimText]);

  // Request explicit microphone access via getUserMedia
  const requestMicPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicPermissionStatus('unsupported');
      addToast('Your browser does not support microphone capture.', 'warning');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop stream tracks immediately so the microphone isn't locked open
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionStatus('granted');
      return true;
    } catch (err) {
      console.warn('[Microphone Permission Error]', err);
      setMicPermissionStatus('denied');
      addToast('Microphone access was denied. Please allow microphone permissions in your browser address bar.', 'error');
      return false;
    }
  };

  // Web Speech API Initialization
  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicPermissionStatus('unsupported');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalSpeech = '';
      let interimSpeech = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          finalSpeech += item[0].transcript;
        } else {
          interimSpeech += item[0].transcript;
        }
      }

      if (finalSpeech) {
        setInputText(prev => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${finalSpeech.trim()}` : finalSpeech.trim();
        });
      }
      setInterimText(interimSpeech);
    };

    recognition.onerror = (e) => {
      console.warn('[Speech Recognition Warning]', e.error);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        isListeningRef.current = false;
        setIsListening(false);
        setMicPermissionStatus('denied');
        addToast('Microphone permission blocked. Please enable it in browser settings.', 'error');
      } else if (e.error === 'network') {
        addToast('Speech recognition network glitch. Check your internet connection.', 'warning');
      }
    };

    recognition.onend = () => {
      // Auto-restart if user still wants to listen and did not explicitly stop
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (err) {
          isListeningRef.current = false;
          setIsListening(false);
        }
      } else {
        setIsListening(false);
        setInterimText('');
      }
    };

    return recognition;
  };

  // Start Voice Listening
  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast('Speech recognition is not supported in this browser. Please use Chrome or Edge.', 'warning');
      setMicPermissionStatus('unsupported');
      return;
    }

    const granted = await requestMicPermission();
    if (!granted) return;

    // Stop TTS if speaking so mic doesn't capture bot output
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      if (!recognitionRef.current) {
        recognitionRef.current = setupSpeechRecognition();
      }

      isListeningRef.current = true;
      setIsListening(true);
      recognitionRef.current.start();
      addToast('Microphone active! Listening to your answer...', 'info');
    } catch (err) {
      if (err.name !== 'InvalidStateError') {
        console.warn('[Speech Start Error]', err);
        setIsListening(false);
        isListeningRef.current = false;
      }
    }
  };

  // Stop Voice Listening
  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setInterimText('');
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      addToast('Microphone paused.', 'info');
    } else {
      startListening();
    }
  };

  // Speak AI Text using SpeechSynthesis
  const speakText = (text) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')));
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // If candidate enabled hands-free conversation, auto start listening
        if (autoListenAfterAI && !interviewEnded) {
          setTimeout(() => {
            startListening();
          }, 300);
        }
      };
      utterance.onerror = () => setIsSpeaking(false);

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[TTS Error]', e);
      setIsSpeaking(false);
    }
  };

  // Start Session
  const handleStartInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/ai/mock-interview/start', setupConfig);
      setSessionId(res.data.sessionId);
      const firstQ = {
        sender: 'ai',
        text: res.data.question,
        category: res.data.category || 'Core Concepts',
        timestamp: new Date()
      };
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

  // Submit Spoken or Typed Answer & Trigger Knowledge Gauging
  const submitCandidateAnswer = async (answerText) => {
    const textToSubmit = (answerText || '').trim();
    if (!textToSubmit || loading) return;

    // Stop microphone if currently listening
    stopListening();

    const userMsg = { sender: 'candidate', text: textToSubmit, timestamp: new Date() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setInterimText('');
    setLoading(true);

    try {
      const res = await API.post('/ai/mock-interview/respond', {
        sessionId,
        role: setupConfig.role,
        type: setupConfig.type,
        conversationHistory: newHistory,
        latestAnswer: userMsg.text
      });

      const knowledgeEval = res.data.knowledgeEvaluation;

      if (res.data.interview_complete) {
        addToast('All interview rounds completed! Compiling session evaluation report...', 'info');
        handleEndInterview(newHistory);
      } else if (res.data.question) {
        const aiMsg = {
          sender: 'ai',
          text: res.data.question,
          category: res.data.category || 'Follow-up',
          knowledgeEvaluation: knowledgeEval,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
        speakText(res.data.question);
      }
    } catch (err) {
      addToast('Error evaluating answer and fetching follow-up question.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const combined = (inputText + (interimText ? ' ' + interimText : '')).trim();
    submitCandidateAnswer(combined);
  };

  const handleFinishSpokenAnswer = () => {
    const combined = (inputText + (interimText ? ' ' + interimText : '')).trim();
    if (!combined) {
      addToast('No answer detected yet. Speak your answer or type it in the text box.', 'warning');
      return;
    }
    submitCandidateAnswer(combined);
  };

  // End Interview & Trigger Full Comprehensive Evaluation
  const handleEndInterview = async (historyToEvaluate = messages) => {
    stopListening();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
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
              Simulate live 1-on-1 interviews with dynamic speech recognition, instant knowledge gauging, adaptive follow-up questions, and STAR readiness feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
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

            <button
              onClick={() => setAutoListenAfterAI(!autoListenAfterAI)}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                autoListenAfterAI ? 'bg-purple-500 text-white shadow' : 'bg-white/20 text-white'
              }`}
              title="Automatically listen after AI finishes speaking"
            >
              <Radio className="w-4 h-4" />
              <span>{autoListenAfterAI ? 'Hands-Free ON' : 'Manual Mic'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mic Permission Warning Banner (if denied) */}
      {micPermissionStatus === 'denied' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Microphone access is currently blocked.</span>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                Click the lock or site settings icon in your browser address bar, set Microphone to "Allow", and retry.
              </p>
            </div>
          </div>
          <button
            onClick={startListening}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition shrink-0"
          >
            Retry Mic Access
          </button>
        </div>
      )}

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
              <div key={idx} className="space-y-3">
                
                {/* Real-time Candidate Knowledge Appraisal Card */}
                {msg.sender === 'ai' && msg.knowledgeEvaluation && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-brand-blue/10 border border-indigo-200 dark:border-indigo-800/60 shadow-md space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/40 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-purple" />
                        <span className="text-xs font-black tracking-wide uppercase text-indigo-900 dark:text-indigo-200">
                          AI Knowledge Appraisal
                        </span>
                      </div>
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                        msg.knowledgeEvaluation.score >= 85
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : msg.knowledgeEvaluation.score >= 70
                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}>
                        Knowledge Score: {msg.knowledgeEvaluation.score}% • {msg.knowledgeEvaluation.level}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      <span className="font-bold text-brand-purple">Verdict: </span>
                      {msg.knowledgeEvaluation.verdict}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2.5 text-[11px]">
                      {msg.knowledgeEvaluation.strengths?.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Strengths Identified:
                          </span>
                          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5">
                            {msg.knowledgeEvaluation.strengths.map((str, sIdx) => (
                              <li key={sIdx}>{str}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.knowledgeEvaluation.missingPoints?.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                          <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Concepts to Deepen:
                          </span>
                          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5">
                            {msg.knowledgeEvaluation.missingPoints.map((gap, gIdx) => (
                              <li key={gIdx}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {msg.knowledgeEvaluation.briefFeedback && (
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 italic">
                        💡 {msg.knowledgeEvaluation.briefFeedback}
                      </p>
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex gap-3 text-xs ${msg.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}>
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
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Embedded System Design Whiteboard Canvas */}
          {setupConfig.type === 'System Design' && (
            <WhiteboardCanvas scheduleId="mock_system_design" sessionId={sessionId} />
          )}

          {/* Audio Waveform Visualizer */}
          {!interviewEnded && (
            <AudioWaveformVisualizer
              isActive={isListening || isSpeaking}
              mode={isListening ? 'listening' : 'speaking'}
            />
          )}

          {/* Live Voice Recording Status Card (when candidate is speaking) */}
          {isListening && !interviewEnded && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-500/30 shadow-lg space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-500 font-extrabold text-xs">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  <span>LISTENING TO YOUR SPOKEN ANSWER...</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Speak naturally into your mic</span>
              </div>

              {/* Real-time Spoken Transcript Box */}
              <div className="p-3 rounded-xl bg-white dark:bg-dark-bg border border-purple-200 dark:border-purple-900/50 min-h-[50px] text-xs">
                {inputText || interimText ? (
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {inputText}{' '}
                    <span className="text-brand-purple font-semibold italic">{interimText}</span>
                  </p>
                ) : (
                  <p className="text-gray-400 italic">Listening for speech... (Start speaking now)</p>
                )}
              </div>

              {/* Action Buttons: Finish Spoken Answer & Submit */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-dark-border text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-300 transition"
                >
                  Pause Mic
                </button>
                <button
                  type="button"
                  onClick={handleFinishSpokenAnswer}
                  disabled={loading || (!inputText.trim() && !interimText.trim())}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Done Speaking — Gauge Knowledge 🚀</span>
                </button>
              </div>
            </div>
          )}

          {/* Input & Voice Controls (when active) */}
          {!interviewEnded && (
            <form onSubmit={handleFormSubmit} className="glass-card p-3 flex items-center gap-3">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-xl transition flex items-center gap-1.5 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md'
                    : 'bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white'
                }`}
                title="Toggle Voice Input (Speech-to-Text)"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="text-xs font-bold hidden sm:inline">
                  {isListening ? 'Stop' : 'Speak Answer'}
                </span>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Listening to your voice... Speak your answer now" : "Type your answer or click 'Speak Answer' to talk..."}
                className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs focus:ring-2 focus:ring-brand-purple focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading || (!inputText.trim() && !interimText.trim())}
                className="btn-gradient p-3 rounded-xl shadow-md disabled:opacity-50"
                title="Submit Answer"
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
