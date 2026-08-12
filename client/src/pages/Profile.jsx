// client/src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import AppLayout from '../components/layout/AppLayout';
import { User, Phone, MapPin, Briefcase, Code, GraduationCap, Award, Globe, Link2, Save, Plus, X, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    careerObjective: '',
    github: '',
    linkedin: '',
    skills: [],
    education: [],
    projects: [],
    certifications: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', year: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        if (data) {
          setFormData({
            phone: data.phone || '',
            location: data.location || '',
            careerObjective: data.careerObjective || '',
            github: data.github || '',
            linkedin: data.linkedin || '',
            skills: data.skills || [],
            education: data.education || [],
            projects: data.projects || [],
            certifications: data.certifications || [],
          });
        }
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddEdu = (e) => {
    e.preventDefault();
    if (newEdu.degree && newEdu.institution) {
      setFormData({ ...formData, education: [...formData.education, newEdu] });
      setNewEdu({ degree: '', institution: '', year: '' });
    }
  };

  const handleRemoveEdu = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (newCert.name && newCert.issuer) {
      setFormData({ ...formData, certifications: [...formData.certifications, newCert] });
      setNewCert({ name: '', issuer: '', year: '' });
    }
  };

  const handleRemoveCert = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await profileService.updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (loadUser) loadUser();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <User className="w-8 h-8 text-primary-400" />
              Career Profile
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage your details, skills, and background to boost your job match score.</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {message.text}
          </div>
        )}

        {/* Basic Information */}
        <section className="glass rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <User className="w-5 h-5 text-indigo-400" /> Basic Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full bg-dark-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full bg-dark-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Career Objective</label>
            <textarea
              name="careerObjective"
              rows="3"
              value={formData.careerObjective}
              onChange={handleChange}
              placeholder="Passionate Full Stack Developer aiming to build scalable web applications..."
              className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none"
            ></textarea>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Code className="w-5 h-5 text-indigo-400" /> Skills & Technical Stack
          </h2>
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Java, React, Node.js, MongoDB)"
              className="flex-1 bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-300"
              >
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {formData.skills.length === 0 && <p className="text-slate-500 text-sm italic">No skills added yet.</p>}
          </div>
        </section>

        {/* Certifications */}
        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="w-5 h-5 text-indigo-400" /> Certifications
          </h2>
          <form onSubmit={handleAddCert} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Certification Title"
              value={newCert.name}
              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
              className="bg-dark-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Issuing Organization"
              value={newCert.issuer}
              onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
              className="bg-dark-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Year"
                value={newCert.year}
                onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none"
              />
              <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm font-medium">Add</button>
            </div>
          </form>

          <div className="space-y-2 pt-2">
            {formData.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-dark-900/40 border border-white/5 rounded-xl text-sm">
                <div>
                  <p className="font-semibold text-white">{cert.name}</p>
                  <p className="text-slate-400 text-xs">{cert.issuer} {cert.year && `(${cert.year})`}</p>
                </div>
                <button type="button" onClick={() => handleRemoveCert(idx)} className="text-slate-500 hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Social Links */}
        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Social & Portfolio Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">GitHub Profile</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">LinkedIn Profile</label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <GraduationCap className="w-5 h-5 text-indigo-400" /> Education
          </h2>
          <form onSubmit={handleAddEdu} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Degree / Qualification"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              className="bg-dark-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Institution / University"
              value={newEdu.institution}
              onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
              className="bg-dark-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Year (e.g. 2026)"
                value={newEdu.year}
                onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none"
              />
              <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm font-medium">Add</button>
            </div>
          </form>

          <div className="space-y-2 pt-2">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-dark-900/40 border border-white/5 rounded-xl text-sm">
                <div>
                  <p className="font-semibold text-white">{edu.degree}</p>
                  <p className="text-slate-400 text-xs">{edu.institution} {edu.year && `(${edu.year})`}</p>
                </div>
                <button type="button" onClick={() => handleRemoveEdu(idx)} className="text-slate-500 hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
};

export default Profile;
