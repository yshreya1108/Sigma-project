import { Team, TeamMember, StudentProfile, ActivityLog, ReportItem, TeamApplication, ApplicationChatThread, AssessmentSubmission } from './types';

export const BASE_STUDENTS: StudentProfile[] = [
  {
    id: 'student-shishir',
    studentIdNum: '25101210684',
    name: 'Shishir Dwivedi',
    email: 'SHISHIRDWIVEDI.25101210684@gehu.ac.in',
    password: 'Shishir@684#gehu',
    accountType: 'TEAM_MEMBER',
    createdAt: '2026-10-14 09:30',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    year: '3rd Year (B.Tech DSCPP-III)',
    avatar: '👨‍💻',
    bio: 'Passionate low-level systems & C/C++ developer. Focused on graph matching algorithms, memory optimization, and full-stack integration.',
    skills: ['C++', 'C', 'Data Structures', 'Algorithms', 'JavaScript', 'React'],
    interests: ['Systems Architecture', 'Algorithm Optimization', 'Open Source', 'Competitive Programming'],
    availability: '18 hrs/week (Evenings & Weekends)',
    githubUrl: 'https://github.com/yshreya1108/Sigma-project',
    linkedinUrl: 'https://linkedin.com/in/shishir-dwivedi',
    portfolioUrl: 'https://shishirdwivedi.dev',
    resumeFileName: 'Shishir_Dwivedi_Engineering_Resume.pdf',
    resumeUrl: '#',
    coverLetterFileName: 'Cover_Letter_SkillMatch_Core.pdf',
    coverLetterText: 'I am applying to lead and develop high-performance C++ backend modules and graph matching engines for university-level collaborative software.',
    certificates: [
      {
        id: 'cert-1',
        title: 'Advanced Data Structures and C++ Specialization',
        issuer: 'Graphic Era Deemed to be University',
        date: 'October 2025',
        credentialUrl: 'https://gehu.ac.in/verify/cert-cplusplus-2025',
      },
      {
        id: 'cert-2',
        title: 'Full Stack Web Development & Microservices',
        issuer: 'Coursera / Meta',
        date: 'January 2026',
        credentialUrl: 'https://coursera.org/verify/FSW-99120',
      },
    ],
    assessmentStatus: {
      cppVerified: true,
      cVerified: true,
      score: 95,
      verdict: 'VERIFIED_ELIGIBLE',
      cheatFlags: 0,
      completedAt: '2026-10-28 14:30',
      feedbackSummary: 'Verified Developer: Amortized O(1) custom vector with zero memory leaks, excellent RAII destructor.',
    },
    blockedUsers: [],
    isBanned: false,
  },
  {
    id: 'student-shreya',
    studentIdNum: '2510270007',
    name: 'Shreya Yadav',
    email: 'SHREYAYADAV.2510270007@gehu.ac.in',
    password: 'Shreya@0007#lead',
    accountType: 'TEAM_LEADER',
    createdAt: '2026-10-12 10:15',
    phone: '+91 98111 22334',
    department: 'Computer Science & Engineering',
    year: '3rd Year (Team Lead Sigma)',
    avatar: '👩‍💻',
    bio: 'Lead Architect for Team Sigma. Leading frontend layout, responsive design, and core C++ module web integration.',
    skills: ['React', 'JavaScript', 'CSS', 'Tailwind CSS', 'C++', 'Data Structures'],
    interests: ['Frontend Engineering', 'Team Management', 'UI/UX Design', 'System Integration'],
    availability: '20 hrs/week',
    githubUrl: 'https://github.com/yshreya1108',
    linkedinUrl: 'https://linkedin.com/in/shreya-yadav',
    portfolioUrl: 'https://shreyayadav.design',
    resumeFileName: 'Shreya_Yadav_Lead_Resume.pdf',
    coverLetterFileName: 'Shreya_Leadership_Statement.pdf',
    certificates: [
      {
        id: 'cert-3',
        title: 'Modern Frontend Architecture & React 19',
        issuer: 'Graphic Era University Tech Forum',
        date: 'August 2025',
      },
    ],
    assessmentStatus: {
      cppVerified: true,
      cVerified: false,
      score: 90,
      verdict: 'VERIFIED_ELIGIBLE',
      cheatFlags: 0,
      completedAt: '2026-10-25 11:20',
      feedbackSummary: 'Verified proficiency in C++ and frontend systems.',
    },
    blockedUsers: [],
    isBanned: false,
  },
  {
    id: 'student-shiwansh',
    studentIdNum: '25101281936',
    name: 'Shiwansh Mishra',
    email: 'SHIWANSHMISHRA.25101281936@gehu.ac.in',
    password: 'Shiwansh@936#gehu',
    accountType: 'TEAM_MEMBER',
    createdAt: '2026-10-15 11:00',
    phone: '+91 97601 11223',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    avatar: '🚀',
    bio: 'Specialist in priority queues, compatibility scoring algorithms, and ranking module integration.',
    skills: ['C++', 'Data Structures', 'Priority Queue', 'Algorithms', 'SQL', 'PostgreSQL'],
    interests: ['Database Kernels', 'Competitive Math', 'Ranking Algorithms'],
    availability: '15 hrs/week',
    githubUrl: 'https://github.com/shiwanshmishra',
    certificates: [],
    assessmentStatus: {
      cppVerified: true,
      cVerified: true,
      score: 92,
      verdict: 'VERIFIED_ELIGIBLE',
      cheatFlags: 0,
      completedAt: '2026-10-26 16:45',
    },
    blockedUsers: [],
    isBanned: false,
  },
  {
    id: 'student-simran',
    studentIdNum: '25101281727',
    name: 'Simran Kundiyal',
    email: 'SIMRANKUNDIYAL.25101281727@gehu.ac.in',
    password: 'Simran@727#gehu',
    accountType: 'TEAM_MEMBER',
    createdAt: '2026-10-15 12:20',
    phone: '+91 97602 33445',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    avatar: '🎓',
    bio: 'Developer focused on project data pipelines, project-related web interfaces, and skill verification assessment.',
    skills: ['C', 'C++', 'Project Management', 'HTML5', 'CSS', 'JavaScript'],
    interests: ['Full Stack', 'Technical Writing', 'Data Storage Architecture'],
    availability: '15 hrs/week',
    certificates: [],
    assessmentStatus: {
      cppVerified: true,
      cVerified: true,
      score: 88,
      verdict: 'VERIFIED_ELIGIBLE',
      cheatFlags: 0,
      completedAt: '2026-10-27 09:15',
    },
    blockedUsers: [],
    isBanned: false,
  },
  {
    id: 'student-arjun',
    studentIdNum: '25101349012',
    name: 'Arjun Verma',
    email: 'arjun.verma25@gehu.ac.in',
    password: 'Arjun@9012#gehu',
    accountType: 'TEAM_MEMBER',
    createdAt: '2026-10-16 14:10',
    phone: '+91 98120 44556',
    department: 'Artificial Intelligence & Machine Learning',
    year: '2nd Year',
    avatar: '🤖',
    bio: 'AI enthusiast eager to apply computer vision and PyTorch models to real-time robotics.',
    skills: ['Python', 'PyTorch', 'Computer Vision', 'Deep Learning', 'C++'],
    interests: ['Autonomous Drones', 'Edge AI', 'Reinforcement Learning'],
    availability: '12 hrs/week',
    certificates: [],
    assessmentStatus: {
      cppVerified: false,
      cVerified: false,
      score: 0,
      verdict: 'NOT_ATTEMPTED',
      cheatFlags: 0,
    },
    blockedUsers: [],
    isBanned: false,
  },
  {
    id: 'student-riya',
    studentIdNum: '25101456721',
    name: 'Riya Sen',
    email: 'riya.sen@gehu.ac.in',
    password: 'Riya@6721#gehu',
    accountType: 'TEAM_MEMBER',
    createdAt: '2026-10-16 16:40',
    phone: '+91 98120 77889',
    department: 'Cybersecurity & Digital Forensics',
    year: '4th Year',
    avatar: '🛡️',
    bio: 'Certified ethical hacker and secure protocol designer. Experienced in buffer overflow exploitation & mitigations.',
    skills: ['C', 'Operating Systems', 'Penetration Testing', 'Cybersecurity', 'Cryptography'],
    interests: ['Hardware Security', 'Zero Trust Architecture', 'CTFs'],
    availability: '20 hrs/week',
    certificates: [],
    assessmentStatus: {
      cppVerified: false,
      cVerified: true,
      score: 96,
      verdict: 'VERIFIED_ELIGIBLE',
      cheatFlags: 0,
    },
    blockedUsers: [],
    isBanned: false,
  },
];

const MEMBER_FIRST_NAMES = [
  'Devansh', 'Ishita', 'Karan', 'Neha', 'Pranav', 'Meera', 'Yashvardhan', 'Anjali',
  'Harsh', 'Sanya', 'Ritvik', 'Divya', 'Ayush', 'Kritika', 'Siddharth', 'Tanvi',
  'Mayank', 'Nandini', 'Varun', 'Sakshi', 'Abhinav', 'Prachi', 'Nikhil', 'Aditi',
  'Gaurav', 'Shruti', 'Rishabh', 'kanika', 'kunal', 'Bhavya', 'chirag', 'Pallavi',
];

const MEMBER_LAST_NAMES = [
  'Negi', 'Rawat', 'Bisht', 'Joshi', 'Chauhan', 'Uniyal', 'Nautiyal', 'Pant',
  'Kandwal', 'Semwal', 'Bhandari', 'Dimri', 'Thapliyal', 'Bahuguna', 'Kothari', 'Raturi',
];

const MEMBER_AVATARS = ['👨‍💻', '👩‍💻', '🚀', '🎓', '⚡', '🔬', '🤖', '🛡️', '🧠', '🌐'];

// Helper to generate 105 realistic University teams across diverse departments
export function generateInitialTeams(): Team[] {
  const departments = [
    {
      name: 'Computer Science & Engineering',
      category: 'CSE & Software Systems',
      skillSets: [
        ['C++', 'Data Structures', 'Graph Theory', 'Algorithms'],
        ['C|C++', 'Algorithms', 'Operating Systems'],
        ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
        ['C++', 'Compiler Design', 'Data Structures'],
        ['Python', 'Django', 'SQL', 'Docker'],
        ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
      ],
      descriptions: [
        'Research and development of distributed graph search algorithms and peer matching engines.',
        'High throughput memory-efficient key-value store using C++ and custom B-Trees.',
        'Interactive real-time collaborative code editor with operational transformation.',
        'Optimizing bytecode compiler and syntax tree analyzer in modern C++20.',
        'University project progress tracker and automated academic portal.',
      ],
    },
    {
      name: 'Artificial Intelligence & Machine Learning',
      category: 'AI / ML & Robotics',
      skillSets: [
        ['Python', 'PyTorch', 'Computer Vision', 'OpenCV'],
        ['Python', 'TensorFlow', 'Deep Learning', 'Data Science'],
        ['Python', 'Natural Language Processing', 'LLMs'],
        ['C++', 'PyTorch', 'Edge AI', 'Algorithms'],
      ],
      descriptions: [
        'Autonomous quadcopter visual navigation and obstacle avoidance system.',
        'Clinical decision support model analyzing retinal imaging scans.',
        'Domain-specific code synthesis and automated refactoring agent for students.',
        'Edge neural network inference optimization on low-power RISC-V hardware.',
      ],
    },
    {
      name: 'Cybersecurity & Digital Forensics',
      category: 'Security & Forensics',
      skillSets: [
        ['C', 'Operating Systems', 'Cybersecurity', 'Assembly'],
        ['Cryptography', 'Cybersecurity', 'Python', 'C++'],
        ['Penetration Testing', 'Cybersecurity', 'Docker', 'Linux'],
      ],
      descriptions: [
        'Kernel-level rootkit detection engine analyzing Linux syscall tables.',
        'Zero-knowledge proof verification pipeline for anonymous student voting.',
        'Automated static vulnerability scanning for campus IoT devices.',
      ],
    },
    {
      name: 'Data Science & Big Data',
      category: 'Data & Analytics',
      skillSets: [
        ['Python', 'Data Science', 'SQL|MySQL', 'Statistics'],
        ['SQL', 'PostgreSQL', 'Docker', 'Python'],
        ['Python', 'Machine Learning', 'Big Data', 'FastAPI'],
      ],
      descriptions: [
        'Predictive modeling for university course attrition and exam grade trajectories.',
        'Distributed query planner for petabyte-scale time-series sensor telemetry.',
        'Campus energy consumption optimization using real-time smart meter feeds.',
      ],
    },
    {
      name: 'Cloud Computing & DevOps',
      category: 'Cloud & Infrastructure',
      skillSets: [
        ['Docker', 'Kubernetes', 'DevOps', 'Go|Python'],
        ['AWS', 'Cloud Computing', 'Terraform', 'Node.js'],
        ['GCP', 'Cloud Computing', 'Docker', 'PostgreSQL'],
      ],
      descriptions: [
        'Automated CI/CD sandbox executing isolated code tests in ephemeral containers.',
        'Multi-region high availability failover gateway for campus web apps.',
        'Infrastructure-as-code automation for distributed lab compute clusters.',
      ],
    },
    {
      name: 'Web3 & Blockchain Engineering',
      category: 'Web3 & Distributed Systems',
      skillSets: [
        ['Solidity', 'Blockchain', 'JavaScript|TypeScript'],
        ['Cryptography', 'Smart Contracts', 'Web3', 'React'],
        ['C++', 'Solidity', 'Distributed Systems'],
      ],
      descriptions: [
        'Decentralized tamper-proof academic credentials and transcript verification.',
        'Peer-to-peer decentralized lab equipment sharing and booking protocol.',
        'Optimistic rollup smart contract architecture for zero-gas student governance.',
      ],
    },
    {
      name: 'Robotics, IoT & Embedded Systems',
      category: 'Hardware & IoT',
      skillSets: [
        ['C', 'Embedded Systems', 'Arduino', 'IoT'],
        ['C++', 'ROS', 'Robotics', 'Computer Vision'],
        ['C', 'Microcontrollers', 'Operating Systems', 'Sensors'],
      ],
      descriptions: [
        'Autonomous warehouse inventory robot with LiDAR mapping and SLAM navigation.',
        'Smart agricultural drone soil nutrient monitoring and micro-spraying system.',
        'Wearable bio-telemetry monitor with real-time BLE vital signs streaming.',
      ],
    },
    {
      name: 'Game Development & Graphics',
      category: 'Games & Interactive Media',
      skillSets: [
        ['C++', 'OpenGL', 'Computer Graphics', 'Data Structures'],
        ['C++', 'Unreal Engine', '3D Math', 'Shaders'],
        ['JavaScript', 'Three.js', 'WebGL', 'HTML5'],
      ],
      descriptions: [
        'Procedural voxel terrain rendering engine with custom dynamic lighting.',
        'Real-time physics engine implementing rigid-body collisions in pure C++.',
        'Interactive 3D virtual tour of the Graphic Era University engineering campus.',
      ],
    },
    {
      name: 'Bio-Informatics & HealthTech',
      category: 'BioTech & Health',
      skillSets: [
        ['Python', 'Data Science', 'Bioinformatics', 'C++'],
        ['Machine Learning', 'Python', 'Biochemistry', 'PyTorch'],
        ['C++', 'Algorithms', 'High-Performance Computing'],
      ],
      descriptions: [
        'Parallelized Smith-Waterman genetic sequence alignment on SIMD instructions.',
        'Protein folding structure prediction using graph neural networks.',
        'Mobile cardiovascular arrhythmia early alert classifier using audio stethoscope.',
      ],
    },
    {
      name: 'Mobile App Engineering',
      category: 'Mobile & Ubiquitous',
      skillSets: [
        ['Flutter', 'Dart', 'Firebase', 'Mobile'],
        ['React Native', 'TypeScript', 'Redux', 'Mobile'],
        ['Swift', 'iOS', 'C++', 'Mobile'],
      ],
      descriptions: [
        'All-in-one student campus companion with offline cafeteria & transit navigation.',
        'Cross-platform peer tutoring marketplace with live in-app whiteboard.',
        'Micro-habit tracker with biometric verification and spaced repetition reminders.',
      ],
    },
  ];

  const gradients = [
    'from-blue-600 via-indigo-600 to-violet-700',
    'from-emerald-600 via-teal-600 to-cyan-700',
    'from-rose-600 via-pink-600 to-purple-700',
    'from-amber-600 via-orange-600 to-red-700',
    'from-indigo-600 via-purple-600 to-pink-700',
    'from-cyan-600 via-blue-600 to-sky-700',
    'from-fuchsia-600 via-pink-600 to-rose-700',
  ];

  const namedLeaders = [
    { name: 'Aarav Sharma', email: 'aarav.sharma@gehu.ac.in', id: 'lead-aarav' },
    { name: 'Pooja Bhatt', email: 'pooja.bhatt@gehu.ac.in', id: 'lead-pooja' },
    { name: 'Rohan Mehra', email: 'rohan.mehra@gehu.ac.in', id: 'lead-rohan' },
    { name: 'Sneha Patel', email: 'sneha.patel@gehu.ac.in', id: 'lead-sneha' },
    { name: 'Vikram Joshi', email: 'vikram.joshi@gehu.ac.in', id: 'lead-vikram' },
    { name: 'Ananya Gupta', email: 'ananya.gupta@gehu.ac.in', id: 'lead-ananya' },
    { name: 'Kavya Nair', email: 'kavya.nair@gehu.ac.in', id: 'lead-kavya' },
    { name: 'Aditya Rawat', email: 'aditya.rawat@gehu.ac.in', id: 'lead-aditya' },
    { name: 'Tanya Negi', email: 'tanya.negi@gehu.ac.in', id: 'lead-tanya' },
  ];

  const LEADER_FIRST_NAMES = [
    'Siddharth', 'Niharika', 'Raghav', 'Aishwarya', 'Kartik', 'Bhumika', 'Dhruv', 'Mansi',
    'Pranav', 'Shraddha', 'Ujjwal', 'Vaishnavi', 'Harshit', 'Deepika', 'Saurabh', 'Kritika',
    'Tushar', 'Himanshi', 'Akash', 'Pallavi', 'Vivek', 'Ritika', 'Mohit', 'Swati',
  ];

  const LEADER_LAST_NAMES = [
    'Nautiyal', 'Chauhan', 'Panwar', 'Kandpal', 'Semwal', 'Gusain', 'Bhatt', 'Negi',
    'Rawat', 'Joshi', 'Uniyal', 'Thapliyal', 'Dimri', 'Bisht', 'Kothari', 'Bahuguna',
  ];

  const teams: Team[] = [];

  // Team 1: Official Team Sigma from the User Report PDF! (Shreya Yadav is ONLY leader of Team Sigma)
  teams.push({
    id: 'team-sigma',
    title: 'Team Sigma: SkillMatch Core Matcher & Engine',
    department: 'Computer Science & Engineering',
    category: 'CSE & Software Systems',
    description:
      'The flagship project from B.Tech DSCPP-III-2026-T383. Implementing Student Module, Project Module, Graph-based skill relations, priority queue ranking, and web integration.',
    deepDescription: [
      'Team Sigma (SkillMatch Core Matcher & Engine) is the flagship academic software systems project developed under Course B.Tech DSCPP-III-2026-T383 at Graphic Era Deemed to be University. The project addresses the complex problem of forming balanced, verified, multi-disciplinary engineering teams across large university cohorts by combining deterministic C++ data structures with an interactive full-stack web platform.',
      'At the heart of Team Sigma is a custom C++ Graph Traversal and Priority Queue Ranking Engine. Skills are modeled as weighted vertices in an adjacency-list graph where edges represent conceptual transferability (for example, C <-> C++ at 80% weight, or Data Structures <-> Algorithms at 85% weight). When a candidate searches or applies for a project, the engine computes exact skill matches (100% credit), related neighbor skill matches via Breadth-First Graph Exploration, and OR-clause skill requirements.',
      'In addition to algorithmic matchmaking, Team Sigma integrates a proctored C/C++ coding verification sandbox that evaluates custom memory management (RAII, dynamic vectors, pointer safety) and anti-cheat telemetry before certifying a candidate as VERIFIED_ELIGIBLE for project recruitment.',
    ],
    problemStatement:
      'University project formation traditionally relies on informal social groups rather than verified technical skills, resulting in unbalanced teams, mismatched domain expertise, and unverified coding claims. Team Sigma solves this by introducing graph-weighted skill compatibility scoring, priority-queue candidate ranking, and automated C/C++ memory-safety verification.',
    objectives: [
      'Design and implement an Adjacency-List Skill Relationship Graph in C++ supporting exact (100%), related graph-edge (75%), and OR-syntax skill evaluation.',
      'Build a Max-Heap Priority Queue ranking pipeline that orders 100+ university project teams in real time according to each student’s skill and interest profile.',
      'Integrate an anti-cheat proctored C/C++ assessment sandbox that verifies RAII memory management, algorithmic complexity, and test-case accuracy.',
      'Deliver a responsive React + TypeScript collaboration portal with 1-on-1 applicant interviews, automatic chat transfer upon approval, and private activity vaults.',
    ],
    architectureModules: [
      {
        name: 'Module 1: Frontend Layout, UI/UX & System Integration',
        role: 'Led by Shreya Yadav (Team Lead)',
        tech: 'React 19, TypeScript, Tailwind CSS, State Sync',
        description:
          'Provides the responsive portal interface, role-based dashboards (Team Member, Team Leader, Supreme Admin), and real-time bridge to the core C++ matching engine.',
      },
      {
        name: 'Module 2: Priority Queue Ranking & Compatibility Scorer',
        role: 'Engineered by Shiwansh Mishra',
        tech: 'C++20, STL Priority Queue, Weighted Graph Heuristics',
        description:
          'Computes multi-factor compatibility scores combining exact skills, graph-related skills, and domain interests, ranking teams in O(N log N) time.',
      },
      {
        name: 'Module 3: Student/Project Data Storage & Skill Verification',
        role: 'Engineered by Simran Kundiyal',
        tech: 'C++, Custom Vector RAII, Persistent JSON/Local Vaults',
        description:
          'Manages structured storage of student profiles, project vacancy slots, proctored C/C++ assessment telemetry, and private owner/admin activity logs.',
      },
      {
        name: 'Module 4: Graph Algorithm Optimization & Full-Stack Bridge (Open Slot)',
        role: 'Open Vacancy Slot (4th Team Member)',
        tech: 'C++, Graph Theory, Data Structures, React Integration',
        description:
          'Extends shortest-path skill adjacency traversal, visualizes live C++ memory allocation frames, and optimizes real-time candidate-to-project matching.',
      },
    ],
    milestones: [
      {
        phase: 'Phase I',
        title: 'System Blueprint & C++ Data Structure Specification',
        timeline: 'Oct 15 – Oct 24, 2026',
        status: 'COMPLETED',
        deliverable: 'Adjacency-list skill graph schema, custom RAII vector design, and module partitioning.',
      },
      {
        phase: 'Phase II',
        title: 'Core Matching Engine & Proctored C/C++ Sandbox',
        timeline: 'Oct 25 – Nov 05, 2026',
        status: 'COMPLETED',
        deliverable: 'Working priority-queue ranker, OR-skill parser, and automated C/C++ test runner.',
      },
      {
        phase: 'Phase III',
        title: 'Full-Stack Web Portal & Role Command Centers',
        timeline: 'Nov 06 – Nov 15, 2026',
        status: 'IN_PROGRESS',
        deliverable: 'Interactive Member, Leader, and Supreme Admin portals with live 1-on-1 and group chat.',
      },
      {
        phase: 'Phase IV',
        title: 'Final University Evaluation & PBL Demonstration',
        timeline: 'Nov 16 – Nov 20, 2026',
        status: 'UPCOMING',
        deliverable: 'Complete technical report, benchmark telemetry across 105+ teams, and faculty defense.',
      },
    ],
    techStackBreakdown: [
      { category: 'Systems & Core Algorithms', items: ['C++20', 'C11', 'STL Containers', 'Custom RAII Vector', 'Adjacency List Graph'] },
      { category: 'Web Application & UI', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'] },
      { category: 'Verification & Security', items: ['Proctored Code Sandbox', 'Tab-Switch Telemetry', 'Owner + Admin Private Vault'] },
    ],
    roleResponsibilities: [
      {
        roleTitle: 'Team Leader & Lead Frontend/Integration Architect',
        assignedTo: 'Shreya Yadav',
        memberId: 'student-shreya',
        status: 'FILLED',
        responsibilities: 'Overall system architecture, frontend design, project module orchestration, and final integration.',
        skills: ['React', 'CSS', 'JavaScript', 'C++'],
      },
      {
        roleTitle: 'Core Algorithm & Priority Queue Engineer',
        assignedTo: 'Shiwansh Mishra',
        memberId: 'student-shiwansh',
        status: 'FILLED',
        responsibilities: 'Priority queue ranking engine, compatibility scoring formula, and complexity optimization.',
        skills: ['C++', 'Priority Queue', 'Ranking'],
      },
      {
        roleTitle: 'Data Storage & Verification Pipeline Engineer',
        assignedTo: 'Simran Kundiyal',
        memberId: 'student-simran',
        status: 'FILLED',
        responsibilities: 'Student/project record persistence, assessment verification workflow, and validation tests.',
        skills: ['C++', 'Data Storage', 'Verification'],
      },
      {
        roleTitle: 'C++ Graph Systems & Matching Specialist (Open Vacancy)',
        assignedTo: 'Open Slot — Accepting Verified Applicants',
        status: 'OPEN_VACANCY',
        responsibilities: 'Collaborate on graph traversal algorithms, C++ memory visualizer, and high-speed matching.',
        skills: ['C++', 'Data Structures', 'Graph Theory', 'Algorithms'],
      },
    ],
    expectedOutcomes: [
      'Sub-5ms compatibility ranking across 105+ concurrent university project teams.',
      '100% deterministic skill verification using proctored C/C++ coding challenges.',
      'Zero unauthorized data leakage via strict Account Creator + Supreme Admin visibility enforcement.',
    ],
    repositoryUrl: 'https://github.com/yshreya1108/Sigma-project',
    documentationUrl: 'https://gehu.ac.in/projects/2026/dscpp-iii-t383-team-sigma',
    academicCourseCode: 'B.Tech DSCPP-III-2026-T383',
    requiredSkills: ['C++', 'Data Structures', 'Graph Theory', 'Algorithms'],
    teamSize: 4,
    leaderId: 'student-shreya',
    leaderName: 'Shreya Yadav (Team Lead)',
    leaderEmail: 'SHREYAYADAV.2510270007@gehu.ac.in',
    members: [
      {
        id: 'student-shreya',
        name: 'Shreya Yadav',
        email: 'SHREYAYADAV.2510270007@gehu.ac.in',
        role: 'Leader',
        skills: ['React', 'CSS', 'JavaScript', 'C++'],
        avatar: '👩‍💻',
      },
      {
        id: 'student-shiwansh',
        name: 'Shiwansh Mishra',
        email: 'SHIWANSHMISHRA.25101281936@gehu.ac.in',
        role: 'Member',
        skills: ['C++', 'Priority Queue', 'Ranking'],
        avatar: '🚀',
      },
      {
        id: 'student-simran',
        name: 'Simran Kundiyal',
        email: 'SIMRANKUNDIYAL.25101281727@gehu.ac.in',
        role: 'Member',
        skills: ['C++', 'Data Storage', 'Verification'],
        avatar: '🎓',
      },
      // 4th spot open for applicants like Shishir!
    ],
    vacancyOpen: true,
    deadline: '2026-11-20',
    tags: ['Phase-III', 'C++ Backend', 'Graph Algorithm', 'PBL Project'],
    bannerGradient: 'from-blue-600 via-indigo-600 to-violet-700',
    createdAt: '2026-10-15',
  });

  // Generate 104 additional diverse university teams to guarantee >= 100 teams
  // Each team gets its OWN unique Team Leader (Shreya Yadav is NEVER assigned to any of these)
  const teamTitles = [
    'QuantumNeural Simulator', 'CyberShield GEHU', 'High-Speed B-Tree Engine', 'BioGenomics Lab',
    'RoboSwarm Navigators', 'Hyperledger Credentials', 'CloudNative Resilience', 'VoxelCraft Graphics Engine',
    'EdgeVision Autonomous Car', 'PulseRate AI Cardio', 'ZeroKnowledge Voting', 'Compiler Optimizers Club',
    'SmartCampus Microgrid', 'RISC-V Simulator', 'DeepNLP Legal Assistant', 'DefensiveSec RedTeam',
    'Predictive Academic Analytics', 'Containerized Sandbox CI', 'Decentralized IPFS Drive', 'Haptic Surgical Robotics',
    'ThreeJS Virtual Campus', 'Multiplayer Game Server', 'Distributed Consensus Node', 'Satellite Image Classifier',
    'Real-time Audio Denoiser', 'Automated Bug Triager', 'FPGA Hardware Accelerators', 'FinTech Fraud Detector',
    'IoT Smart Irrigation', 'Wearable EEG Sensor', 'Rust Embedded RTOS', 'Dynamic Binary Translator',
    'Campus Transit Router', 'Solar Farm Forecaster', 'Multi-tenant DB Sharding', 'WebAssembly Media Player',
    'Code Plagiarism Analyzer', 'Smart Contract Auditor', 'DeepFake Detection Suite', 'Kubernetes Autoscaler',
    'Autonomous Drone Swarm', 'BioMechanical Prosthetic Hand', 'Low-Latency Order Book', 'Speech-to-Speech Translator',
    'Graph Database Engine', 'Thermal Camera Screener', 'Augmented Reality Lab', 'Secure Encrypted Vault',
    'Recommendation Filter Engine', 'Microservices Mesh Gateway', 'Reinforcement Learning Agent', 'Peer-to-Peer File Sync',
    'Medical Diagnosis Assistant', 'Packet Sniffer & Firewall', 'Robotic Arm Inverse Kinematics', 'Generative Art Synthesizer',
    'Vector Search Database', 'Distributed Key-Value Store', 'Realtime Raytracer', 'Emotion Recognition Webcam',
    'Campus Waste Sorter AI', 'Bluetooth Mesh Beacon', 'DNS Spoofing Defense', 'Parallel Matrix Multiplier',
    'Natural Voice TTS Engine', 'Smart Lock IoT Firmware', 'Blockchain Supply Chain', 'Automated Resume Matcher',
    'Code Linting Language Server', 'Neural Machine Translator', 'Disaster Relief Drone', 'Subsurface Sonar Scanner',
    'Smart City Traffic Optimizer', 'End-to-End Encrypted Chat', 'Automated Pentest Scanner', 'Distributed Cache Engine',
    'Zero-Day Threat Analyzer', 'Virtual Reality Anatomical Atlas', 'Self-Healing Cloud Pods', 'Low-Power LoRaWAN Network',
    'Facial Recognition Doorway', 'AI Proctoring Shield', 'Smart Classroom Attendance', 'Gesture Controlled Quadcopter',
    'Microbiome Data Analyzer', 'High-Frequency Trading Bot', 'Decentralized Identity DApp', 'Robotic Telepresence Rig',
    'C++ Realtime Game Engine', 'Automated Penetration Pipeline', 'Solar Panel Cleaning Robot', 'Smart Helmet Sensor Suite',
    'Autonomous Rover Mapping', 'Quantum Key Exchange Simulation', 'Compiler Backend CodeGen', 'Deep OCR Receipt Parser',
    'Serverless MicroVM Runner', 'BioInformatics Blast Query', 'Wearable Fall Detection', 'Smart Parking Spot Finder',
    'Virtual Chemistry Experimenter', 'C++ ThreadPool Workstealing', 'Edge Audio Keyword Spotter', 'Distributed Log Aggregator'
  ];

  for (let i = 0; i < 104; i++) {
    const teamNumber = i + 2;
    const deptIdx = i % departments.length;
    const dept = departments[deptIdx];
    const skillSet = dept.skillSets[i % dept.skillSets.length];
    const description = dept.descriptions[i % dept.descriptions.length];
    const gradient = gradients[i % gradients.length];
    const baseTitle = teamTitles[i % teamTitles.length];
    const title = `${baseTitle} (#${teamNumber})`;

    // Assign a unique leader for every team (use namedLeaders for the first 9, then generate unique leaders)
    const leader =
      i < namedLeaders.length
        ? namedLeaders[i]
        : (() => {
            const lf = LEADER_FIRST_NAMES[i % LEADER_FIRST_NAMES.length];
            const ll = LEADER_LAST_NAMES[Math.floor(i / LEADER_FIRST_NAMES.length) % LEADER_LAST_NAMES.length];
            const fullName = `${lf} ${ll}`;
            return {
              id: `lead-team-${teamNumber}`,
              name: fullName,
              email: `${lf.toLowerCase()}.${ll.toLowerCase()}.lead${teamNumber}@gehu.ac.in`,
            };
          })();

    // Randomize member counts: some open (size 3-5 with 1-2 vacancy), some filled/closed
    const capacity = 3 + (i % 3); // 3, 4, or 5
    const isClosed = i % 7 === 0; // ~15% closed vacancy
    const filledCount = isClosed ? capacity : Math.max(1, capacity - (1 + (i % 2)));

    const cleanSkillsList = skillSet.map((s) => s.split('|')[0]);
    const primarySkill = cleanSkillsList[0] || 'C++';
    const secondarySkill = cleanSkillsList[1] || 'Algorithms';

    const members: TeamMember[] = [
      {
        id: leader.id,
        name: leader.name,
        email: leader.email,
        role: 'Leader',
        skills: [primarySkill, secondarySkill],
        avatar: MEMBER_AVATARS[i % MEMBER_AVATARS.length],
      },
    ];

    for (let m = 1; m < filledCount; m++) {
      const fName = MEMBER_FIRST_NAMES[(i * 3 + m * 5) % MEMBER_FIRST_NAMES.length];
      const lName = MEMBER_LAST_NAMES[(i * 7 + m * 3) % MEMBER_LAST_NAMES.length];
      const formattedFirst = fName.charAt(0).toUpperCase() + fName.slice(1);
      const fullName = `${formattedFirst} ${lName}`;
      const cleanEmailPrefix = `${formattedFirst.toLowerCase()}.${lName.toLowerCase()}.${teamNumber}${m}`;
      const memberSkills = [
        skillSet[m % skillSet.length].split('|')[0],
        skillSet[(m + 1) % skillSet.length].split('|')[0],
      ];

      members.push({
        id: `member-${i}-${m}`,
        name: fullName,
        email: `${cleanEmailPrefix}@gehu.ac.in`,
        role: 'Member',
        skills: Array.from(new Set(memberSkills)),
        avatar: MEMBER_AVATARS[(i + m) % MEMBER_AVATARS.length],
      });
    }

    const openSlotsCount = Math.max(0, capacity - members.length);
    const deadlineDate = `2026-11-${15 + (i % 15)}`;
    const courseCode = `B.Tech ${dept.category.split(' ')[0].toUpperCase()}-2026-T${300 + teamNumber}`;

    const roleResponsibilities = [
      ...members.map((m, idx) => ({
        roleTitle:
          idx === 0
            ? `Team Leader & System Architect (${primarySkill})`
            : idx === 1
            ? `Core ${m.skills[0] || primarySkill} Implementation Engineer`
            : `Testing, Integration & ${m.skills[m.skills.length - 1] || secondarySkill} Specialist`,
        assignedTo: m.name,
        memberId: m.id,
        status: 'FILLED' as const,
        responsibilities:
          idx === 0
            ? `Directs technical architecture for ${baseTitle}, coordinates sprint deliverables, and leads ${primarySkill} core module design.`
            : `Develops and benchmarks ${m.skills.join(' & ')} pipelines, unit test suites, and integration interfaces for ${baseTitle}.`,
        skills: m.skills,
      })),
      ...Array.from({ length: openSlotsCount }).map((_, slotIdx) => ({
        roleTitle: `Open Specialist Slot #${slotIdx + 1}: ${skillSet[(members.length + slotIdx) % skillSet.length]}`,
        assignedTo: 'Open Vacancy — Accepting Student Applications',
        status: 'OPEN_VACANCY' as const,
        responsibilities: `Contribute to ${baseTitle} module development using ${skillSet.join(', ')}, participate in code reviews, and co-author phase deliverables.`,
        skills: skillSet,
      })),
    ];

    teams.push({
      id: `team-${teamNumber}`,
      title,
      department: dept.name,
      category: dept.category,
      description,
      deepDescription: [
        `${title} is a specialized university engineering and research initiative hosted under the Department of ${dept.name} (${dept.category}) at Graphic Era Deemed to be University. Led by ${leader.name}, the team is focused on ${description.charAt(0).toLowerCase() + description.slice(1)}`,
        `The system architecture combines high-efficiency ${skillSet.join(', ')} modules with rigorous benchmarking, automated testing, and modular API boundaries. Each subsystem is engineered to handle real-world concurrency, deterministic memory footprints, and fault-tolerant execution across campus laboratory clusters.`,
        `Students joining ${title} collaborate through structured bi-weekly engineering sprints, code reviews, and faculty milestone evaluations under course code ${courseCode}, culminating in a production-grade prototype and technical research demonstration.`,
      ],
      problemStatement: `Conventional implementations in ${dept.category} suffer from high latency, poor scalability, and fragmented tooling when dealing with ${description.toLowerCase().replace(/\.$/, '')}. ${baseTitle} addresses this gap by engineering a tightly integrated pipeline using ${skillSet.join(' and ')}.`,
      objectives: [
        `Architect and implement the core ${baseTitle} engine utilizing ${primarySkill} and ${secondarySkill} with deterministic performance guarantees.`,
        `Achieve modular interoperability across ${skillSet.join(', ')} components with comprehensive automated test coverage.`,
        `Benchmark throughput, memory safety, and latency against baseline academic datasets in the ${dept.name} lab.`,
        `Deliver complete technical documentation, source repository, and live faculty demonstration before ${deadlineDate}.`,
      ],
      architectureModules: [
        {
          name: `Module 1: Core ${primarySkill} Processing Kernel`,
          role: `Led by ${leader.name} (Team Lead)`,
          tech: `${primarySkill}, ${secondarySkill}, Systems Core`,
          description: `Implements the foundational data structures, state machine, and core execution loop powering ${baseTitle}.`,
        },
        {
          name: `Module 2: ${dept.category} Pipeline & Middleware`,
          role: members[1] ? `Engineered by ${members[1].name}` : 'Assigned to Core Team Roster',
          tech: skillSet.join(', '),
          description: `Handles data ingestion, transformation, and high-speed communication between internal subsystems.`,
        },
        {
          name: 'Module 3: Telemetry, Diagnostics & Interface Layer',
          role: members[2] ? `Engineered by ${members[2].name}` : 'Collaborative Team Module',
          tech: `${cleanSkillsList[cleanSkillsList.length - 1] || primarySkill}, Real-time Metrics`,
          description: `Provides interactive monitoring, diagnostic logs, and visual verification of ${baseTitle} outputs.`,
        },
        {
          name: 'Module 4: Stress Benchmarking & Verification Suite',
          role: openSlotsCount > 0 ? 'Open Vacancy / Shared Sprint Module' : 'Team QA & Verification',
          tech: `Automated Testing, Profiling, ${primarySkill}`,
          description: `Validates edge-case resilience, memory safety, and end-to-end accuracy under synthetic and real workloads.`,
        },
      ],
      milestones: [
        {
          phase: 'Phase I',
          title: 'Problem Formulation & System Architecture Design',
          timeline: 'Oct 18 – Oct 27, 2026',
          status: 'COMPLETED',
          deliverable: `Approved architecture specification and module interface contracts for ${baseTitle}.`,
        },
        {
          phase: 'Phase II',
          title: `Core ${primarySkill} Module Implementation`,
          timeline: 'Oct 28 – Nov 06, 2026',
          status: 'COMPLETED',
          deliverable: `Working prototype of the core ${primarySkill} & ${secondarySkill} processing pipeline.`,
        },
        {
          phase: 'Phase III',
          title: 'Subsystem Integration & Performance Profiling',
          timeline: 'Nov 07 – Nov 14, 2026',
          status: 'IN_PROGRESS',
          deliverable: `End-to-end integration of ${skillSet.join(', ')} modules and latency benchmarking.`,
        },
        {
          phase: 'Phase IV',
          title: 'Final Defense, Documentation & Deployment',
          timeline: `Nov 15 – ${deadlineDate}`,
          status: 'UPCOMING',
          deliverable: 'Final project report, source code release, and live university panel evaluation.',
        },
      ],
      techStackBreakdown: [
        { category: 'Primary Languages & Core', items: skillSet.map((s) => s.replace('|', ' / ')) },
        { category: 'Domain & Category Stack', items: [dept.category, dept.name, 'Linux / POSIX Env'] },
        { category: 'Engineering Workflow', items: ['Git Version Control', 'Automated Unit Tests', 'Peer Code Review', 'PBL Milestone Tracking'] },
      ],
      roleResponsibilities,
      expectedOutcomes: [
        `Production-ready ${baseTitle} prototype verified on university benchmark workloads.`,
        `Complete modular codebase in ${skillSet.join(', ')} with reproducible build scripts.`,
        `Technical research paper and live demonstration for ${dept.name} faculty evaluation.`,
      ],
      repositoryUrl: `https://github.com/gehu-projects-2026/team-${teamNumber}-${baseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      documentationUrl: `https://gehu.ac.in/projects/2026/team-${teamNumber}/specification`,
      academicCourseCode: courseCode,
      requiredSkills: skillSet,
      teamSize: capacity,
      leaderId: leader.id,
      leaderName: leader.name,
      leaderEmail: leader.email,
      members,
      vacancyOpen: !isClosed,
      deadline: deadlineDate,
      tags: [dept.category.split(' ')[0], primarySkill, isClosed ? 'Closed' : 'Active Vacancy'],
      bannerGradient: gradient,
      createdAt: '2026-10-18',
    });
  }

  return teams;
}

export const INITIAL_TEAMS: Team[] = generateInitialTeams();

/**
 * Builds the complete university directory of StudentProfiles so EVERY person
 * (all flagship students, all 10 team leaders, and every member across all 105 teams)
 * has a complete profile, login credentials (email, studentIdNum, password),
 * skills, interests, and verification status visible to Admin.
 */
export function buildAllInitialStudents(teams: Team[]): StudentProfile[] {
  const byId = new Map<string, StudentProfile>();
  for (const stu of BASE_STUDENTS) {
    byId.set(stu.id, stu);
  }

  let seq = 100;
  for (const team of teams) {
    for (const member of team.members) {
      if (byId.has(member.id)) continue;
      seq += 1;
      const isLeader = member.role === 'Leader' || member.id.startsWith('lead-');
      const studentIdNum = isLeader ? `25101100${seq}` : `25101900${seq}`;
      const firstToken = member.name.split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'User';
      const deterministicPassword = `${firstToken}@${seq}#gehu`;
      const cleanSkills =
        member.skills && member.skills.length > 0
          ? member.skills.map((s) => s.split('|')[0])
          : ['C++', 'Algorithms'];
      const hasCppOrC = cleanSkills.some(
        (s) => s.toLowerCase() === 'c++' || s.toLowerCase() === 'c'
      );
      const score = isLeader ? 88 + (seq % 11) : 76 + (seq % 20);

      byId.set(member.id, {
        id: member.id,
        studentIdNum,
        name: member.name,
        email: member.email,
        password: deterministicPassword,
        accountType: isLeader ? 'TEAM_LEADER' : 'TEAM_MEMBER',
        createdAt: `2026-10-${10 + (seq % 18)} ${10 + (seq % 8)}:${10 + (seq % 45)}`,
        phone: `+91 98${String(10000000 + seq * 137).slice(0, 8)}`,
        department: team.department,
        year: isLeader
          ? '3rd Year (Project Lead)'
          : ['2nd Year', '3rd Year', '4th Year'][seq % 3],
        avatar: member.avatar || MEMBER_AVATARS[seq % MEMBER_AVATARS.length],
        bio: isLeader
          ? `Team Leader for ${team.title} in ${team.department}. Coordinating architecture, deliverables, and member sprint tasks.`
          : `Active project member in ${team.title} (${team.department}). Focused on ${cleanSkills.join(' & ')} implementation.`,
        skills: Array.from(new Set([...cleanSkills, 'C++'])),
        interests: [team.category, ...team.tags.slice(0, 2)],
        availability: `${12 + (seq % 10)} hrs/week`,
        githubUrl: `https://github.com/${firstToken.toLowerCase()}-${seq}`,
        certificates: [],
        assessmentStatus: {
          cppVerified: isLeader || hasCppOrC || seq % 2 === 0,
          cVerified: hasCppOrC,
          score,
          verdict: score >= 75 ? 'VERIFIED_ELIGIBLE' : 'ELIGIBLE_WITH_CONDITIONS',
          cheatFlags: 0,
          completedAt: `2026-10-${12 + (seq % 15)} 15:20`,
          feedbackSummary: `Verified proficiency for ${team.title} (${score}% score).`,
        },
        blockedUsers: [],
        isBanned: false,
      });
    }
  }

  return Array.from(byId.values());
}

export const INITIAL_STUDENTS: StudentProfile[] = buildAllInitialStudents(INITIAL_TEAMS);


export const INITIAL_APPLICATIONS: TeamApplication[] = [
  {
    id: 'app-sigma-shishir',
    teamId: 'team-sigma',
    teamTitle: 'Team Sigma: SkillMatch Core Matcher & Engine',
    studentId: 'student-shishir',
    studentName: 'Shishir Dwivedi',
    studentEmail: 'SHISHIRDWIVEDI.25101210684@gehu.ac.in',
    studentSkills: ['C++', 'C', 'Data Structures', 'Algorithms', 'JavaScript', 'React'],
    status: 'PENDING',
    appliedAt: '2026-10-31 11:30',
    message: 'Hello Shreya! I have completed the C++ Dynamic Vector & RAII skill assessment with a 95% score and no cheat flags. I would love to contribute to our Graph and Matching algorithm implementation.',
    matchScore: 98,
    assessmentScore: 95,
    assessmentVerdict: 'VERIFIED_ELIGIBLE',
  },
];

export const INITIAL_CHAT_THREADS: Record<string, ApplicationChatThread> = {
  'app-sigma-shishir': {
    applicationId: 'app-sigma-shishir',
    teamId: 'team-sigma',
    studentId: 'student-shishir',
    transferredToTeamChat: false,
    messages: [
      {
        id: 'msg-1',
        senderId: 'student-shishir',
        senderName: 'Shishir Dwivedi',
        senderRole: 'Applicant',
        content: 'Hi Shreya! Submitted my application for Team Sigma. My resume and C++ verified test results are attached for your review.',
        timestamp: '11:31 AM',
      },
      {
        id: 'msg-2',
        senderId: 'student-shreya',
        senderName: 'Shreya Yadav (Team Lead)',
        senderRole: 'Team Leader',
        content: 'Hey Shishir! Looking at your assessment report now. Your custom vector RAII implementation and memory safety checks look stellar!',
        timestamp: '11:34 AM',
      },
      {
        id: 'msg-3',
        senderId: 'student-shishir',
        senderName: 'Shishir Dwivedi',
        senderRole: 'Applicant',
        content: 'Thank you! Excited to collaborate on our Graphic Era university project and connect the React frontend with our C++ modules.',
        timestamp: '11:36 AM',
      },
    ],
  },
};

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    reportedUserId: 'student-fake-test',
    reportedUserName: 'CryptoBot User',
    reporterId: 'student-shreya',
    reporterName: 'Shreya Yadav',
    reporterEmail: 'SHREYAYADAV.2510270007@gehu.ac.in',
    reason: 'Suspicious profile claiming 15 years experience as a 1st year student with fake external links.',
    details: 'The GitHub link points to a 404 page and assessment scores are falsified.',
    status: 'PENDING',
    createdAt: '2026-10-30 18:20',
  },
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'REGISTRATION',
    description: 'Shishir Dwivedi registered and verified university email credentials.',
    actor: 'Shishir Dwivedi',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-2',
    type: 'ASSESSMENT',
    description: 'Shishir Dwivedi completed C++ RAII Vector Assessment with 95% score (VERIFIED_ELIGIBLE).',
    actor: 'Assessment Engine',
    timestamp: '1 hour ago',
  },
  {
    id: 'act-3',
    type: 'APPLICATION',
    description: 'Shishir Dwivedi applied to join Team Sigma (SkillMatch Core).',
    actor: 'Shishir Dwivedi',
    timestamp: '45 mins ago',
  },
  {
    id: 'act-4',
    type: 'REPORT',
    description: 'Shreya Yadav reported an account for suspicious fraudulent credentials.',
    actor: 'Shreya Yadav',
    timestamp: '30 mins ago',
  },
];

export const INITIAL_SUBMISSIONS: AssessmentSubmission[] = [
  {
    id: 'sub-1',
    candidateId: 'student-shishir',
    candidateName: 'Shishir Dwivedi',
    candidateEmail: 'SHISHIRDWIVEDI.25101210684@gehu.ac.in',
    language: 'cpp',
    challengeId: 'cpp-smart-vector',
    challengeTitle: 'C++ Custom Dynamic Vector & Memory Management',
    submittedCode: `#include <iostream>
#include <stdexcept>

class CustomVector {
private:
    int* data;
    size_t sz;
    size_t cap;

public:
    CustomVector() {
        cap = 2;
        sz = 0;
        data = new int[cap];
    }

    ~CustomVector() {
        delete[] data;
    }

    void push_back(int val) {
        if (sz >= cap) {
            cap *= 2;
            int* nextData = new int[cap];
            for (size_t i = 0; i < sz; ++i) {
                nextData[i] = data[i];
            }
            delete[] data;
            data = nextData;
        }
        data[sz++] = val;
    }

    int at(int index) const {
        if (index < 0 || (size_t)index >= sz) {
            return -1;
        }
        return data[index];
    }

    size_t size() const { return sz; }
    size_t capacity() const { return cap; }
};`,
    syntaxValid: true,
    testCasesPassed: 4,
    totalTestCases: 4,
    score: 95,
    timeSpentSeconds: 340,
    tabSwitchCount: 0,
    copyPasteCount: 0,
    cheatSuspicion: 'LOW',
    timeComplexity: 'Amortized O(1) push_back, O(1) random access',
    spaceComplexity: 'O(N) dynamic storage',
    memorySafetyNotes: ['RAII destructor correctly deallocates buffer with delete[]'],
    verdict: 'VERIFIED_ELIGIBLE',
    personalizedFeedback: 'Candidate demonstrates strong proficiency in CPP systems programming. Test execution passed 4/4 criteria with clean memory deallocation and optimal Amortized O(1) push_back, O(1) random access efficiency. High integrity rating with zero suspicious cheat indicators. Highly recommended for project teams requiring rigorous CPP core skills.',
    submittedAt: '2026-10-31 11:15',
  },
];
