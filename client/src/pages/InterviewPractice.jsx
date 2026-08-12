// client/src/pages/InterviewPractice.jsx
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import { Brain, Play, CheckCircle2, Award, Loader2, Sparkles, Mic, MicOff, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewPractice = () => {
  const [interviews, setInterviews] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [role, setRole] = useState('Full Stack Developer');
  const [topic, setTopic] = useState('React & Node.js');
  const [difficulty, setDifficulty] = useState('Medium');

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState(null);

  // Timer & Voice Recognition state
  const [timeLeft, setTimeLeft] = useState(90);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/interviews');
      setInterviews(data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Question timer effect
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'in_progress' || currentFeedback) return;

    setTimeLeft(90);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Time expired for this question!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQIndex, activeSession, currentFeedback]);

  // Voice Recognition setup
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      toast('Voice recording stopped');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (err) => {
      console.error(err);
      setIsListening(false);
      toast.error('Voice recognition error.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    toast.success('Listening... Speak your answer now!');
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    setStarting(true);
    setCurrentFeedback(null);
    try {
      const { data } = await api.post('/interviews', { role, topic, difficulty });
      setActiveSession(data.data);
      setCurrentQIndex(0);
      setUserAnswer('');
      toast.success('AI Mock Interview session started!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview session');
    } finally {
      setStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please enter or speak an answer first!');
      return;
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setSubmitting(true);
    try {
      const { data } = await api.post(`/interviews/${activeSession._id}/answer`, {
        questionIndex: currentQIndex,
        answer: userAnswer,
      });

      setActiveSession(data.data);
      setCurrentFeedback(data.currentQuestionFeedback);
      toast.success(`Question scored: ${data.currentQuestionFeedback?.score}/10`);

      if (currentQIndex < activeSession.questions.length - 1) {
        setTimeout(() => {
          setCurrentQIndex((prev) => prev + 1);
          setUserAnswer('');
          setCurrentFeedback(null);
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary-400" />
            AI Interview Simulator
          </h1>
          <p className="text-slate-400 text-sm mt-1">Practice role-specific technical interviews with question timers and speech-to-text voice answers.</p>
        </div>

        {/* Start Session Setup Card */}
        {!activeSession && (
          <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Configure Mock Interview
            </h2>

            <form onSubmit={handleStartSession} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Target Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Technical Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Java, Data Structures, MERN"
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="md:col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={starting}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                >
                  {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                  {starting ? 'Generating AI Questions...' : 'Start AI Interview'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Interview Room */}
        {activeSession && activeSession.status === 'in_progress' && (
          <div className="glass rounded-2xl p-6 md:p-8 space-y-6 border border-primary-500/30">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">
                  Question {currentQIndex + 1} of {activeSession.questions.length}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeSession.role} • {activeSession.topic} ({activeSession.difficulty})
                </h3>
              </div>

              <div className="flex items-center gap-4">
                {/* Timer Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold border ${timeLeft <= 20 ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {timeLeft}s
                </div>

                <button
                  onClick={() => setActiveSession(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Exit Session
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-dark-900/60 p-5 rounded-2xl border border-white/10">
              <p className="text-lg font-semibold text-white">
                {activeSession.questions[currentQIndex]?.question}
              </p>
            </div>

            {/* Answer Controls & Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-400 uppercase">Your Answer</label>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-dark-900 border border-white/10 text-slate-300 hover:text-white'}`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-primary-400" />}
                  {isListening ? 'Stop Mic' : '🎤 Speak Answer'}
                </button>
              </div>

              <textarea
                rows="5"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or click 'Speak Answer' to dictate your detailed answer..."
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl p-4 text-white focus:border-primary-500 outline-none text-sm"
              ></textarea>
            </div>

            {/* Live Feedback Toast */}
            {currentFeedback && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-1 animate-fade-in">
                <div className="flex items-center justify-between font-bold">
                  <span>Question Score: {currentFeedback.score}/10</span>
                </div>
                <p className="text-sm text-slate-300">{currentFeedback.feedback}</p>
                <p className="text-xs text-indigo-400 pt-1">Moving to next question in 3 seconds...</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={submitting || !userAnswer.trim()}
                className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {submitting ? 'Evaluating...' : 'Submit & Score Answer'}
              </button>
            </div>
          </div>
        )}

        {/* Completed Session Overview */}
        {activeSession && activeSession.status === 'completed' && (
          <div className="glass rounded-2xl p-6 md:p-8 space-y-6 border border-emerald-500/30 animate-fade-in">
            <div className="text-center space-y-2">
              <Award className="w-16 h-16 text-emerald-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Interview Practice Completed!</h2>
              <p className="text-slate-400 text-sm">Role: {activeSession.role} ({activeSession.topic})</p>
            </div>

            {/* Score Ring */}
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-full bg-dark-900 border-4 border-emerald-500 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-3xl font-extrabold text-white">{activeSession.overallScore || 80}%</span>
                <span className="text-[10px] text-slate-400">Overall Score</span>
              </div>
            </div>

            {/* Summary Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-dark-900/60 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-white text-sm mb-2 text-emerald-400">Key Strengths</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  {activeSession.strengths?.map((s, i) => (
                    <li key={i}>✓ {s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-dark-900/60 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-white text-sm mb-2 text-amber-400">Areas to Improve</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  {activeSession.improvements?.map((imp, i) => (
                    <li key={i}>• {imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setActiveSession(null);
                  fetchHistory();
                }}
                className="bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl"
              >
                Back to Simulator
              </button>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default InterviewPractice;
