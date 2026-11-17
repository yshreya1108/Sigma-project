import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Team } from '../lib/types';
import { UserAvatar, AVATAR_EMOJI_OPTIONS } from './UserAvatar';
import {
  Sparkles,
  Users,
  ShieldAlert,
  UserPlus,
  Rocket,
  Lock,
  CheckCircle2,
  ArrowRight,
  Layers,
  GraduationCap,
  KeyRound,
  Plus,
  X,
  FolderGit2,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Globe,
} from 'lucide-react';

interface HomePageProps {
  onSelectApplyTeam?: (team: Team) => void;
  onOpenApplyModal?: (team: Team) => void;
  onInspectStudent?: (studentId: string) => void;
  onNavigate?: (tab: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenRegister?: () => void;
  onOpenTeamPage?: (team: Team) => void;
}

const COMMON_SKILLS = [
  'C++',
  'C',
  'Data Structures',
  'Algorithms',
  'STL',
  'Multithreading',
  'Python',
  'React',
  'TypeScript',
  'Node.js',
  'Machine Learning',
  'Embedded Systems',
  'SQL',
  'Cybersecurity',
  'Linux',
  'Docker',
];

const COMMON_INTERESTS = [
  'Systems & C++ Engineering',
  'AI & Machine Learning',
  'Robotics & Embedded IoT',
  'Full-Stack Web & Cloud',
  'Cybersecurity & Cryptography',
  'Data Science & Analytics',
  'Competitive Programming',
  'Autonomous Vehicles',
];

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical & Robotics Engineering',
  'Cybersecurity & Forensics',
  'Biotechnology & Bioinformatics',
];

const PROJECT_CATEGORIES = [
  'Systems & C++ Engineering',
  'AI & Machine Learning',
  'Robotics & Embedded IoT',
  'Full-Stack Web & Cloud',
  'Cybersecurity & Networks',
  'Data Science & Analytics',
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onNavigateTab,
  onOpenTeamPage,
}) => {
  const navigateToTab = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    else if (onNavigateTab) onNavigateTab(tab);
  };
  const [homeTeamSearch, setHomeTeamSearch] = useState('');
  const [showAllHomeTeams, setShowAllHomeTeams] = useState(false);
  const {
    teams,
    students,
    registerStudent,
    createLeaderAndProject,
    loginUserAccount,
    loginAdmin,
    currentUserProfile,
    role,
    isAdminAuthenticated,
  } = useApp();

  // Active portal modal: null | 'MEMBER' | 'LEADER' | 'ADMIN'
  const [activePortalModal, setActivePortalModal] = useState<'MEMBER' | 'LEADER' | 'ADMIN' | null>(
    null
  );

  // Member Portal state ('REGISTER' | 'LOGIN')
  const [memberMode, setMemberMode] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberIdNum, setMemberIdNum] = useState('');
  const [memberDept, setMemberDept] = useState(DEPARTMENTS[0]);
  const [memberYear, setMemberYear] = useState('3rd Year (B.Tech)');
  const [memberAvatar, setMemberAvatar] = useState('👨‍💻');
  const [memberSkills, setMemberSkills] = useState<string[]>(['C++', 'Data Structures']);
  const [customMemberSkill, setCustomMemberSkill] = useState('');
  const [memberInterests, setMemberInterests] = useState<string[]>([
    'Systems & C++ Engineering',
    'AI & Machine Learning',
  ]);
  const [customMemberInterest, setCustomMemberInterest] = useState('');
  const [memberAvailability, setMemberAvailability] = useState('15 hrs/week (Evenings & Weekends)');
  const [memberBio, setMemberBio] = useState('');
  const [memberGithub, setMemberGithub] = useState('');
  const [memberLoginInput, setMemberLoginInput] = useState('');
  const [memberLoginPass, setMemberLoginPass] = useState('');
  const [memberError, setMemberError] = useState('');

  // Team Leader Portal state ('CREATE_PROJECT' | 'LOGIN')
  const [leaderMode, setLeaderMode] = useState<'CREATE_PROJECT' | 'LOGIN'>('CREATE_PROJECT');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPassword, setLeaderPassword] = useState('');
  const [leaderIdNum, setLeaderIdNum] = useState('');
  const [leaderDept, setLeaderDept] = useState(DEPARTMENTS[0]);
  const [leaderYear, setLeaderYear] = useState('3rd Year (B.Tech)');
  const [leaderAvatar, setLeaderAvatar] = useState('🚀');
  const [leaderOwnSkills, setLeaderOwnSkills] = useState<string[]>(['C++', 'System Architecture']);

  // Project & Team Details for Leader
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState(PROJECT_CATEGORIES[0]);
  const [projDept, setProjDept] = useState(DEPARTMENTS[0]);
  const [projDesc, setProjDesc] = useState('');
  const [projRequiredSkills, setProjRequiredSkills] = useState<string[]>([
    'C++',
    'Algorithms',
    'STL',
  ]);
  const [customProjSkill, setCustomProjSkill] = useState('');
  const [projTeamSize, setProjTeamSize] = useState(4);
  const [projTagsInput, setProjTagsInput] = useState('C++20, Graph Engine, High-Performance');
  const [projDeadline, setProjDeadline] = useState('2026-12-31');
  const [leaderLoginInput, setLeaderLoginInput] = useState('');
  const [leaderLoginPass, setLeaderLoginPass] = useState('');
  const [leaderError, setLeaderError] = useState('');

  // Admin Portal state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Calculate active members and teams made on this site
  const totalTeamsMade = teams.length;
  const totalRosterMembers = teams.reduce((acc, t) => acc + t.members.length, 0);
  const totalRegisteredAccounts = students.length;
  const openTeamsCount = teams.filter((t) => t.vacancyOpen && t.members.length < t.teamSize).length;

  const toggleItemInList = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    if (list.includes(item)) {
      if (list.length > 1) setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Handle Team Member Registration
  const handleMemberRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');
    if (!memberName.trim() || !memberEmail.trim() || !memberPassword.trim()) {
      setMemberError('Please provide your full name, email address, and password.');
      return;
    }

    registerStudent({
      name: memberName.trim(),
      email: memberEmail.trim(),
      password: memberPassword.trim(),
      studentIdNum: memberIdNum.trim() || `GEU-${Math.floor(100000 + Math.random() * 900000)}`,
      department: memberDept,
      year: memberYear,
      avatar: memberAvatar,
      bio:
        memberBio.trim() ||
        `${memberYear} student in ${memberDept} interested in ${memberInterests.join(', ')}.`,
      skills: memberSkills.length > 0 ? memberSkills : ['C++'],
      interests: memberInterests.length > 0 ? memberInterests : ['Systems & C++ Engineering'],
      availability: memberAvailability,
      githubUrl: memberGithub.trim() || undefined,
      accountType: 'TEAM_MEMBER',
    });

    setActivePortalModal(null);
    navigateToTab('candidate-dashboard');
  };

  // Handle Existing Member Login
  const handleMemberLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');
    const found = loginUserAccount(memberLoginInput, memberLoginPass, 'STUDENT');
    if (!found) {
      setMemberError(
        'No matching student account found or password incorrect. Try registering a new account or check your email/ID.'
      );
      return;
    }
    setActivePortalModal(null);
    navigateToTab('candidate-dashboard');
  };

  // Handle Team Leader Account + New Project Creation
  const handleLeaderCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaderError('');
    if (!leaderName.trim() || !leaderEmail.trim() || !leaderPassword.trim()) {
      setLeaderError('Please fill in your Team Leader name, email, and password.');
      return;
    }
    if (!projTitle.trim() || !projDesc.trim()) {
      setLeaderError('Please provide the Project Title and Detailed Project Description.');
      return;
    }

    const parsedTags = projTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createLeaderAndProject(
      {
        name: leaderName.trim(),
        email: leaderEmail.trim(),
        password: leaderPassword.trim(),
        studentIdNum: leaderIdNum.trim() || `LEAD-${Math.floor(100000 + Math.random() * 900000)}`,
        department: leaderDept,
        year: leaderYear,
        avatar: leaderAvatar,
        bio: `Team Leader of "${projTitle.trim()}" (${projCategory}).`,
        skills: leaderOwnSkills.length > 0 ? leaderOwnSkills : projRequiredSkills,
        interests: [projCategory],
        availability: '20 hrs/week (Project Lead)',
        accountType: 'TEAM_LEADER',
      },
      {
        title: projTitle.trim(),
        department: projDept,
        category: projCategory,
        description: projDesc.trim(),
        requiredSkills: projRequiredSkills,
        teamSize: projTeamSize,
        deadline: projDeadline,
        tags: parsedTags.length > 0 ? parsedTags : [projCategory, 'C++'],
      }
    );

    setActivePortalModal(null);
    navigateToTab('leader-dashboard');
  };

  // Handle Existing Team Leader Login
  const handleLeaderLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaderError('');
    const found = loginUserAccount(leaderLoginInput, leaderLoginPass, 'TEAM_LEADER');
    if (!found) {
      setLeaderError(
        'No matching Team Leader account found. Create a new project & leader account or check your email.'
      );
      return;
    }
    setActivePortalModal(null);
    navigateToTab('leader-dashboard');
  };

  // Handle Supreme Admin Login
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const ok = loginAdmin(adminUsername, adminPassword);
    if (!ok) {
      setAdminError('Invalid Admin username or password. Access denied.');
      return;
    }
    setActivePortalModal(null);
    navigateToTab('admin');
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 1. OPENING WEBSITE PAGE HERO + THE 3 ROLE OPTIONS RIGHT ON TOP */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-indigo-300" />
            <span>Official Opening Website Page • Graphic Era Deemed to be University</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            SkillMatch:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-200 to-emerald-300">
              Student Skill Exchange & Project Team Platform
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto">
            <strong>About the Work:</strong> SkillMatch connects university students and project
            leaders into high-performing engineering and research teams using{' '}
            <strong>C++ Graph Traversal</strong>, <strong>Priority Queue Matchmaking</strong>, and{' '}
            <strong>Proctored C/C++ Skill Assessments</strong>. Every account created and every
            activity performed on this website is stored privately and visible{' '}
            <span className="text-emerald-300 font-semibold underline decoration-emerald-400/50">
              only to the person who created the account and the Website Admin
            </span>
            .
          </p>
        </div>

        {/* THE 3 MAIN OPTIONS DIRECTLY ON THE OPENING WEBSITE PAGE (ABOVE THE FOLD) */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/90">
          <div className="text-center mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">
              Click Any Option Below to Continue
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* OPTION 1: BE A TEAM MEMBER */}
            <div
              onClick={() => {
                setMemberMode('REGISTER');
                setMemberError('');
                setActivePortalModal('MEMBER');
              }}
              className="bg-white text-slate-900 rounded-2xl border-2 border-indigo-200 hover:border-indigo-500 transition-all p-5 shadow-lg flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Option 1 • New Student
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">Be a Team Member</h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Register as a new student on the site with your skills and interests. Get{' '}
                    <strong>all teams matched as per your skills and interests</strong> in your dashboard.
                  </p>
                </div>

                <ul className="space-y-1 text-[11px] text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>New student registration & member login</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Instant skill & interest team matching</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Private activity visible only to you & Admin</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMemberMode('REGISTER');
                    setMemberError('');
                    setActivePortalModal('MEMBER');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Be a Team Member</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OPTION 2: BE A TEAM LEADER */}
            <div
              onClick={() => {
                setLeaderMode('CREATE_PROJECT');
                setLeaderError('');
                setActivePortalModal('LEADER');
              }}
              className="bg-white text-slate-900 rounded-2xl border-2 border-violet-200 hover:border-violet-500 transition-all p-5 shadow-lg flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    Option 2 • Create Project
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">Be a Team Leader</h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Create a new project on the site and provide all details needed in the team and
                    project (title, description, required skills, slots).
                  </p>
                </div>

                <ul className="space-y-1 text-[11px] text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Create a new project & define team requirements</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Manage applicants, vacancies & team chat</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span>Private project & activity visible only to you & Admin</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLeaderMode('CREATE_PROJECT');
                    setLeaderError('');
                    setActivePortalModal('LEADER');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span>Be a Team Leader</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OPTION 3: ADMIN */}
            <div
              onClick={() => {
                setAdminError('');
                setActivePortalModal('ADMIN');
              }}
              className="bg-white text-slate-900 rounded-2xl border-2 border-amber-200 hover:border-amber-500 transition-all p-5 shadow-lg flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Option 3 • Website Control
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">Admin</h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sign in with Admin Username and Password to control the entire website and view
                    all created accounts & private activities.
                  </p>
                </div>

                <ul className="space-y-1 text-[11px] text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Full website control & global activity audit</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>View every user account & private activity vault</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Protected by Admin Login ID & Password</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAdminError('');
                    setActivePortalModal('ADMIN');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE WORK & ACTIVE MEMBERS AND TEAMS MADE ON THIS SITE */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              About the Work • Active Members & Teams Made on This Site
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of our academic project matchmaking work, active members, and project teams formed on SkillMatch.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Platform Overview
          </span>
        </div>

        {/* Numerical Metric Cards: Active Members & Teams Made */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Active Registered Members
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalRegisteredAccounts}</div>
            <div className="text-[11px] text-slate-600 mt-1">
              Students & leaders registered on this site
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-violet-50/60 border border-violet-100">
            <div className="text-xs font-bold text-violet-700 uppercase tracking-wider">
              Active Members in Teams
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalRosterMembers}</div>
            <div className="text-[11px] text-slate-600 mt-1">
              Members actively collaborating in project teams
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Teams Made on This Site
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalTeamsMade}</div>
            <div className="text-[11px] text-slate-600 mt-1">
              Multi-disciplinary university project teams formed
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Teams with Open Vacancies
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{openTeamsCount}</div>
            <div className="text-[11px] text-slate-600 mt-1">
              Open teams ready for new Team Members
            </div>
          </div>
        </div>

        {/* 3 Pillars of the Work */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 1. Skill & Interest Graph Matching
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a new student registers under <strong>Be a Team Member</strong>, our C++ Graph
              and Priority Queue engine matches them with all project teams aligned with their
              technical skills and interests.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-1 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" /> 2. Project & Team Creation
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under <strong>Be a Team Leader</strong>, project creators specify all team and project
              details—required skills, project deliverables, department, and slots—and review
              verified C/C++ applicants.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> 3. Private Data & Admin Control
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every newly created account and every activity is stored persistently and remains
              strictly private—visible only to the person who created the account and the{' '}
              <strong>Admin</strong>.
            </p>
          </div>
        </div>

        {/* Clickable Directory of Teams Made on This Site */}
        <div className="pt-5 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Teams Made on This Site ({teams.length} Project Teams) — Click Any Team for Full Project Details
              </h3>
              <p className="text-xs text-slate-500">
                Click on any project team below to open its dedicated page with full project details, deep technical description, architecture, and roster.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={homeTeamSearch}
                onChange={(e) => setHomeTeamSearch(e.target.value)}
                placeholder="Search teams by title, leader, or skill..."
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowAllHomeTeams(!showAllHomeTeams)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer"
              >
                {showAllHomeTeams ? 'Show Featured 6 Teams' : `View All ${teams.length} Teams`}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams
              .filter((t) => {
                if (!homeTeamSearch.trim()) return true;
                const q = homeTeamSearch.toLowerCase();
                return (
                  t.title.toLowerCase().includes(q) ||
                  t.leaderName.toLowerCase().includes(q) ||
                  t.department.toLowerCase().includes(q) ||
                  t.category.toLowerCase().includes(q) ||
                  t.requiredSkills.some((s) => s.toLowerCase().includes(q))
                );
              })
              .slice(0, showAllHomeTeams || homeTeamSearch.trim() ? teams.length : 6)
              .map((team) => {
                const spotsLeft = Math.max(0, team.teamSize - team.members.length);
                return (
                  <div
                    key={team.id}
                    onClick={() => {
                      if (onOpenTeamPage) onOpenTeamPage(team);
                      else navigateToTab('teams');
                    }}
                    className="group p-4 rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-indigo-500 transition-all shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {team.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            team.vacancyOpen && spotsLeft > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {team.vacancyOpen && spotsLeft > 0
                            ? `${spotsLeft} Spot${spotsLeft > 1 ? 's' : ''} Open`
                            : 'Roster Full'}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {team.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {team.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {team.requiredSkills.slice(0, 4).map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-600 truncate">
                        Lead: <strong className="text-slate-900">{team.leaderName.replace(' (Team Lead)', '')}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-bold shrink-0 group-hover:translate-x-0.5 transition-transform">
                        <span>Open Project Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          MODAL 1: BE A TEAM MEMBER (NEW STUDENT REGISTRATION / LOGIN)
         ===================================================================== */}
      {activePortalModal === 'MEMBER' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black">Be a Team Member Portal</h3>
                  <p className="text-xs text-indigo-200">
                    Register your student account to get all teams matched by your skills & interests
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePortalModal(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMemberMode('REGISTER');
                  setMemberError('');
                }}
                className={`pb-3 border-b-2 transition-colors ${
                  memberMode === 'REGISTER'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                New Student Registration
              </button>
              <button
                type="button"
                onClick={() => {
                  setMemberMode('LOGIN');
                  setMemberError('');
                }}
                className={`pb-3 border-b-2 transition-colors ${
                  memberMode === 'LOGIN'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Existing Member Sign In
              </button>
            </div>

            <div className="p-6 max-h-[78vh] overflow-y-auto">
              {memberError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {memberError}
                </div>
              )}

              {memberMode === 'REGISTER' ? (
                <form onSubmit={handleMemberRegisterSubmit} className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      <strong>Privacy Guarantee:</strong> Your account data and every activity you
                      perform are stored privately and visible <strong>only to you and the Admin</strong>.
                    </span>
                  </div>

                  {/* Emoji Avatar Picker */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Choose Your Profile Emoji Avatar
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVATAR_EMOJI_OPTIONS.map((opt) => (
                        <button
                          key={opt.emoji}
                          type="button"
                          onClick={() => setMemberAvatar(opt.emoji)}
                          className={`w-9 h-9 rounded-xl text-base flex items-center justify-center border transition-all ${
                            memberAvatar === opt.emoji
                              ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20 scale-105'
                              : 'bg-slate-50 border-slate-200 hover:bg-white'
                          }`}
                          title={opt.label}
                        >
                          {opt.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Aarav Sharma"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        University Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g., aarav.cs@geu.ac.in"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="Create password"
                        value={memberPassword}
                        onChange={(e) => setMemberPassword(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Student Roll / ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 25101210991"
                        value={memberIdNum}
                        onChange={(e) => setMemberIdNum(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                      <select
                        value={memberYear}
                        onChange={(e) => setMemberYear(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                      >
                        <option>1st Year (B.Tech)</option>
                        <option>2nd Year (B.Tech)</option>
                        <option>3rd Year (B.Tech)</option>
                        <option>4th Year (B.Tech)</option>
                        <option>M.Tech / Ph.D. Researcher</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Department *</label>
                      <select
                        value={memberDept}
                        onChange={(e) => setMemberDept(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Weekly Availability
                      </label>
                      <input
                        type="text"
                        value={memberAvailability}
                        onChange={(e) => setMemberAvailability(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Technical Skills Selection */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <label className="block font-bold text-slate-800">
                      Your Technical Skills (Used to Match Teams) *
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_SKILLS.map((sk) => {
                        const active = memberSkills.includes(sk);
                        return (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => toggleItemInList(memberSkills, setMemberSkills, sk)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                              active
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            {sk}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add custom skill (e.g., OpenCV, Rust)..."
                        value={customMemberSkill}
                        onChange={(e) => setCustomMemberSkill(e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            customMemberSkill.trim() &&
                            !memberSkills.includes(customMemberSkill.trim())
                          ) {
                            setMemberSkills([...memberSkills, customMemberSkill.trim()]);
                            setCustomMemberSkill('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-semibold"
                      >
                        + Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Project Interests Selection */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <label className="block font-bold text-slate-800">
                      Your Project Interests & Domains (Used to Match Teams) *
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_INTERESTS.map((interest) => {
                        const active = memberInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() =>
                              toggleItemInList(memberInterests, setMemberInterests, interest)
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                              active
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add custom interest (e.g., Quantum Computing, Game Dev)..."
                        value={customMemberInterest}
                        onChange={(e) => setCustomMemberInterest(e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            customMemberInterest.trim() &&
                            !memberInterests.includes(customMemberInterest.trim())
                          ) {
                            setMemberInterests([...memberInterests, customMemberInterest.trim()]);
                            setCustomMemberInterest('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-semibold"
                      >
                        + Add Interest
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        GitHub Profile URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={memberGithub}
                        onChange={(e) => setMemberGithub(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Short Bio / Objective
                      </label>
                      <input
                        type="text"
                        placeholder="Passionate about building low-latency systems..."
                        value={memberBio}
                        onChange={(e) => setMemberBio(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActivePortalModal(null)}
                      className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm flex items-center gap-2"
                    >
                      <span>Create Member Account & View Matched Teams</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleMemberLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Registered University Email or Student ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., shishir.dwivedi.cs@geu.ac.in or 25101210684"
                      value={memberLoginInput}
                      onChange={(e) => setMemberLoginInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Enter your account password"
                      value={memberLoginPass}
                      onChange={(e) => setMemberLoginPass(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActivePortalModal(null)}
                      className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Member Dashboard</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: BE A TEAM LEADER (CREATE NEW PROJECT & TEAM / LEADER LOGIN)
         ===================================================================== */}
      {activePortalModal === 'LEADER' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-violet-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black">Be a Team Leader — Create New Project & Team</h3>
                  <p className="text-xs text-violet-200">
                    Define all project details, required team skills, and open slots to recruit members
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePortalModal(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLeaderMode('CREATE_PROJECT');
                  setLeaderError('');
                }}
                className={`pb-3 border-b-2 transition-colors ${
                  leaderMode === 'CREATE_PROJECT'
                    ? 'border-violet-600 text-violet-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Create New Project & Team Leader Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaderMode('LOGIN');
                  setLeaderError('');
                }}
                className={`pb-3 border-b-2 transition-colors ${
                  leaderMode === 'LOGIN'
                    ? 'border-violet-600 text-violet-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Existing Team Leader Sign In
              </button>
            </div>

            <div className="p-6 max-h-[78vh] overflow-y-auto">
              {leaderError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {leaderError}
                </div>
              )}

              {leaderMode === 'CREATE_PROJECT' ? (
                <form onSubmit={handleLeaderCreateProjectSubmit} className="space-y-5 text-xs">
                  <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-violet-950 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-violet-600 shrink-0" />
                    <span>
                      <strong>Confidential Account & Activity Storage:</strong> Your Team Leader
                      account data and project creation activity are stored privately and visible{' '}
                      <strong>only to you and the Website Admin</strong>.
                    </span>
                  </div>

                  {/* Section 1: Leader Account Details */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>1. Team Leader Account Details</span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Leader Emoji Avatar
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {AVATAR_EMOJI_OPTIONS.map((opt) => (
                          <button
                            key={opt.emoji}
                            type="button"
                            onClick={() => setLeaderAvatar(opt.emoji)}
                            className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border ${
                              leaderAvatar === opt.emoji
                                ? 'bg-violet-50 border-violet-600 ring-2 ring-violet-500/20'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            {opt.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Leader Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Rohan Verma"
                          value={leaderName}
                          onChange={(e) => setLeaderName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Leader Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g., rohan.lead@geu.ac.in"
                          value={leaderEmail}
                          onChange={(e) => setLeaderEmail(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="Create password"
                          value={leaderPassword}
                          onChange={(e) => setLeaderPassword(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          University ID / Roll No
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 25101210888"
                          value={leaderIdNum}
                          onChange={(e) => setLeaderIdNum(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Leader Department
                        </label>
                        <select
                          value={leaderDept}
                          onChange={(e) => {
                            setLeaderDept(e.target.value);
                            setProjDept(e.target.value);
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                        <select
                          value={leaderYear}
                          onChange={(e) => setLeaderYear(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        >
                          <option>2nd Year (B.Tech)</option>
                          <option>3rd Year (B.Tech)</option>
                          <option>4th Year (B.Tech)</option>
                          <option>M.Tech / Faculty Mentor</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: All Team & Project Details */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>2. Project & Team Requirements Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Project / Team Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., NeuralEdge C++ Distributed Engine"
                          value={projTitle}
                          onChange={(e) => setProjTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Project Domain / Category *
                        </label>
                        <select
                          value={projCategory}
                          onChange={(e) => setProjCategory(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        >
                          {PROJECT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Detailed Project Description & Deliverables *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Describe what your project builds, the problem it solves, and what responsibilities team members will have..."
                        value={projDesc}
                        onChange={(e) => setProjDesc(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    {/* Required Skills Needed in the Team */}
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-800">
                        Required Skills Needed in the Team *
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_SKILLS.map((sk) => {
                          const active = projRequiredSkills.includes(sk);
                          return (
                            <button
                              key={sk}
                              type="button"
                              onClick={() =>
                                toggleItemInList(projRequiredSkills, setProjRequiredSkills, sk)
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                                active
                                  ? 'bg-violet-600 text-white border-violet-600'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300'
                              }`}
                            >
                              {sk}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add specific required skill (e.g., CUDA, ROS2, Socket Programming)..."
                          value={customProjSkill}
                          onChange={(e) => setCustomProjSkill(e.target.value)}
                          className="flex-1 p-2 rounded-lg border border-slate-300 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              customProjSkill.trim() &&
                              !projRequiredSkills.includes(customProjSkill.trim())
                            ) {
                              setProjRequiredSkills([
                                ...projRequiredSkills,
                                customProjSkill.trim(),
                              ]);
                              setCustomProjSkill('');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-semibold"
                        >
                          + Add Required Skill
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Target Team Size (Total Slots) *
                        </label>
                        <input
                          type="number"
                          min={2}
                          max={12}
                          value={projTeamSize}
                          onChange={(e) => setProjTeamSize(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Application Deadline
                        </label>
                        <input
                          type="date"
                          value={projDeadline}
                          onChange={(e) => setProjDeadline(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Project Tech Tags (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={projTagsInput}
                          onChange={(e) => setProjTagsInput(e.target.value)}
                          placeholder="C++20, Graph, Systems"
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActivePortalModal(null)}
                      className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-sm flex items-center gap-2"
                    >
                      <Rocket className="w-4 h-4" />
                      <span>Create Project & Open Team Leader Dashboard</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLeaderLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Team Leader Email or ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., shreya.yadav.cs@geu.ac.in"
                      value={leaderLoginInput}
                      onChange={(e) => setLeaderLoginInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Enter leader password"
                      value={leaderLoginPass}
                      onChange={(e) => setLeaderLoginPass(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActivePortalModal(null)}
                      className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Team Leader Dashboard</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: ADMIN LOGIN GATE (Username: adminsm$4146 / Password: adminsrsad@414.)
         ===================================================================== */}
      {activePortalModal === 'ADMIN' && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black">Supreme Admin Login</h3>
                  <p className="text-xs text-amber-200">
                    Authenticate to control the entire website & inspect all user activities
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePortalModal(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="p-6 space-y-4 text-xs">
              {adminError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                  {adminError}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admin Username *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter Admin Username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admin Password *</label>
                <div className="relative">
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    placeholder="Enter Admin Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-amber-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActivePortalModal(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Enter Admin Control</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
