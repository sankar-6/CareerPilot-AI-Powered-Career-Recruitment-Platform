// client/src/pages/ResumeBuilder.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import { Upload, FileText, Sparkles, CheckCircle2, AlertTriangle, Trash2, Loader2, ArrowRight } from 'lucide-react';

const ResumeBuilder = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchResume = async () => {
    try {
      const { data } = await api.get('/resumes/me');
      setResume(data?.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage({ type: '', text: '' });
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const { data } = await api.post('/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(data.data);
      setSelectedFile(null);
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload resume' });
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await api.post('/resumes/analyze');
      setResume((prev) => ({ ...prev, analysis: data.data }));
      setMessage({ type: 'success', text: 'AI Resume Analysis completed!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to analyze resume' });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;
    try {
      await api.delete('/resumes/me');
      setResume(null);
      setMessage({ type: 'success', text: 'Resume deleted.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete resume' });
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

  const analysis = resume?.analysis;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary-400" />
            AI Resume Analyzer
          </h1>
          <p className="text-slate-400 text-sm mt-1">Upload your resume to get instant AI scoring, detected skills, and feedback.</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {message.text}
          </div>
        )}

        {/* Resume Upload Card */}
        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Upload PDF Resume
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-white/10 hover:border-primary-500/50 rounded-2xl p-8 text-center bg-dark-900/40 transition">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Drag & drop your PDF resume here, or browse</p>
              <p className="text-slate-500 text-xs mt-1">Supports PDF, DOC, DOCX up to 5MB</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-4 block mx-auto text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-500"
              />
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between bg-dark-900/60 p-3 rounded-xl">
                <span className="text-sm text-slate-300 font-medium">{selectedFile.name}</span>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium px-5 py-2 rounded-xl flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            )}
          </form>

          {/* Current Resume Info */}
          {resume && (
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  {resume.fileName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploaded on {new Date(resume.updatedAt).toLocaleDateString()} • {(resume.fileSize / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {analyzing ? 'Analyzing...' : 'Analyze Resume'}
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis Display */}
        {analysis && (
          <div className="space-y-6 animate-fade-in">
            {/* Score Banner */}
            <div className="glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-primary-950/40 via-dark-900 to-accent-950/40 border border-primary-500/30">
              <div>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">AI Assessment</span>
                <h3 className="text-2xl font-bold text-white mt-1">Resume Score & Performance</h3>
                <p className="text-slate-400 text-sm mt-1">Based on keyword optimization, structure, and skill relevance.</p>
              </div>
              <div className="relative w-24 h-24 rounded-full bg-dark-900 border-4 border-primary-500 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                <span className="text-3xl font-extrabold text-white">{analysis.score || 80}</span>
                <span className="text-[10px] text-slate-400">out of 100</span>
              </div>
            </div>

            {/* Strengths & Improvements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="glass rounded-2xl p-6 space-y-4 border-l-4 border-emerald-500">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key Strengths
                </h4>
                <ul className="space-y-2.5">
                  {analysis.strengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="glass rounded-2xl p-6 space-y-4 border-l-4 border-amber-500">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> Areas to Improve
                </h4>
                <ul className="space-y-2.5">
                  {analysis.improvements?.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-amber-400 mt-1">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="glass rounded-2xl p-6 space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-3">Detected Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.detectedSkills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">Recommended / Missing Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default ResumeBuilder;
