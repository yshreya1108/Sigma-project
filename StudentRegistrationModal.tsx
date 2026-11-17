import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVATAR_EMOJI_OPTIONS, UserAvatar } from './UserAvatar';
import {
  X,
  UserPlus,
  Mail,
  Lock,
  Upload,
  CheckCircle2,
  FileText,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

interface StudentRegistrationModalProps {
  onClose: () => void;
  onRegisteredSuccess: () => void;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  onClose,
  onRegisteredSuccess,
}) => {
  const { registerStudent } = useApp();

  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👨‍💻');
  const [studentIdNum, setStudentIdNum] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year (B.Tech)');
  const [skillsInput, setSkillsInput] = useState('C++, Data Structures, Algorithms, JavaScript');
  const [interestsInput, setInterestsInput] = useState('Distributed Systems, Competitive Programming');
  const [availability, setAvailability] = useState('15 hrs/week (Evenings)');
  const [bio, setBio] = useState('Passionate software engineering student eager to build high performance projects.');
  const [githubUrl, setGithubUrl] = useState('https://github.com/my-profile');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/my-profile');
  const [resumeFileName, setResumeFileName] = useState('Official_Resume.pdf');
  const [coverLetterText, setCoverLetterText] = useState('I am eager to contribute my algorithmic and programming expertise to the project team.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const interests = interestsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    registerStudent({
      name: name.trim(),
      studentIdNum: studentIdNum.trim() || `2510${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: email.trim(),
      department,
      year,
      avatar: selectedAvatar,
      bio: bio.trim(),
      skills,
      interests,
      availability,
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      resumeFileName: resumeFileName.trim(),
      coverLetterFileName: 'Cover_Letter.pdf',
      coverLetterText: coverLetterText.trim(),
      password,
    });

    onRegisteredSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-indigo-300">
                  <GraduationCap className="w-3.5 h-3.5 inline mr-1" /> Graphic Era University
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Student Registration & Profile Setup</h2>
              <p className="text-xs text-slate-300">
                Register credentials to manage PDF documents, attempt C/C++ skill assessments, and match with 100+ teams.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Emoji / Avatar Picker */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <UserAvatar name={name || 'New Student'} avatar={selectedAvatar} size="lg" />
              <div>
                <div className="font-bold text-slate-800">Choose Profile Emoji / Avatar</div>
                <div className="text-[11px] text-slate-500">
                  Select an expressive emoji avatar for your student profile.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_EMOJI_OPTIONS.map((opt) => (
                <button
                  key={opt.emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(opt.emoji)}
                  title={opt.label}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all border ${
                    selectedAvatar === opt.emoji
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20 scale-105'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shishir Dwivedi"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">University Student ID</label>
              <input
                type="text"
                value={studentIdNum}
                onChange={(e) => setStudentIdNum(e.target.value)}
                placeholder="e.g. 25101210684"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">University Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.2510@gehu.ac.in"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                <option value="Cybersecurity & Digital Forensics">Cybersecurity & Digital Forensics</option>
                <option value="Data Science & Big Data">Data Science & Big Data</option>
                <option value="Robotics, IoT & Embedded Systems">Robotics, IoT & Embedded Systems</option>
                <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                <option value="Web3 & Blockchain Engineering">Web3 & Blockchain Engineering</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Year / Cohort</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 3rd Year (B.Tech DSCPP-III)"
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Skills and Availability */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Technical Skills (Comma-separated for C++ matching engine):
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="C++, C, Data Structures, Python, React, Tailwind CSS"
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interests / Focus</label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="Algorithms, Systems, Web Development"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Availability</label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. 15 hrs/week (Evenings)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Documents & Links */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resume Document (PDF Format)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={resumeFileName}
                  onChange={(e) => setResumeFileName(e.target.value)}
                  placeholder="My_Resume.pdf"
                  className="flex-1 p-2.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
                <span className="px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5" /> PDF Attached
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cover Letter Statement</label>
              <textarea
                rows={2}
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                placeholder="Brief intro for team leaders..."
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-[11px] text-slate-500">
              Instant login after submission with automatic team suggestions.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-colors"
              >
                Register & Find Teams
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
