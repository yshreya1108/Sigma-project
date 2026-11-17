# SkillMatch — Student Skill Exchange & Project Team Platform

**Graphic Era Deemed to be University • Course B.Tech DSCPP-III-2026-T383**  
*Website created by ShishirTB4146*

---

## Quick Start (Run Locally on Your Computer)

1. **Install Node.js** (v18+ recommended) from [nodejs.org](https://nodejs.org/).
2. **Extract this ZIP archive** and open a terminal inside the project folder:
   ```bash
   cd SkillMatch-Source-Code
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. Open **`http://localhost:3000`** in your browser.

---

## Portal Access & Admin Credentials

The Opening Home Page provides three role portals:

1. **Be a Team Member**: Register a new student account with your skills and interests (or sign in to an existing student account). Automatically matches you with all 105+ project teams using the C++ Graph & Priority Queue engine.
2. **Be a Team Leader**: Create a new project & team with full technical specifications (or sign in as an existing team leader, e.g., `shreya.yadav.cs@geu.ac.in` for Team Sigma).
3. **Admin Control Portal**:
   - **Username**: `adminsm$4146`
   - **Password**: `adminsrsad@414.`

---

## Project Structure

```text
├── index.html                  # HTML entry point & Google Fonts (Caveat, Dancing Script)
├── package.json                # Dependencies & scripts (React 19, Vite, Tailwind CSS, Lucide)
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
└── src/
    ├── main.tsx                # React DOM root
    ├── index.css               # Tailwind CSS v4 & signature font utilities
    ├── App.tsx                 # Main layout, navigation routing, modals & persistent footer
    ├── context/
    │   └── AppContext.tsx      # Global state, localStorage persistence & role management
    ├── lib/
    │   ├── types.ts            # TypeScript interfaces for Students, Teams, Applications, Logs
    │   ├── initialData.ts      # 105+ project teams (Team Sigma led by Shreya Yadav) & student profiles
    │   ├── graphEngine.ts      # C++ STL Adjacency List Graph & Priority Queue matchmaking engine
    │   ├── portalAuthEngine.ts # Private account/activity vault & deep team technical specs generator
    │   ├── assessmentEngine.ts # Proctored C/C++ skill assessment & anti-cheat engine
    │   ├── learningPathEngine.ts # C++ Beginner-to-Project-Ready learning path engine
    │   └── streakEngine.ts     # Daily coding & collaboration streak tracker engine
    └── components/
        ├── HomePage.tsx                # Opening page with 3 role portals, live metrics & 105 teams
        ├── Navbar.tsx                  # Top navigation bar
        ├── TeamDetailPage.tsx          # Dedicated full-page deep project architecture & roster view
        ├── TeamExplorer.tsx            # Searchable/filterable directory of all 105+ teams
        ├── CandidateDashboard.tsx      # Student dashboard with matched teams & learning path
        ├── CandidateLearningPath.tsx   # Interactive C++ learning path visualizer
        ├── CandidateStreakTracker.tsx  # Daily activity streak & milestone tracker
        ├── TeamLeaderDashboard.tsx     # Team leader project & applicant management portal
        ├── AdminDashboard.tsx          # Supreme Admin control panel for all 105+ teams & accounts
        ├── SkillAssessment.tsx         # Proctored C/C++ assessment environment
        ├── CppVisualizer.tsx           # Interactive C++ Graph & Priority Queue algorithm visualizer
        ├── ApplyTeamModal.tsx          # Team application modal
        ├── ApplicantChatModal.tsx      # Real-time 1-on-1 leader/applicant chat modal
        ├── StudentProfileModal.tsx     # Student profile inspector
        ├── StudentRegistrationModal.tsx# Quick student registration modal
        ├── LeaderInvitationPopup.tsx   # Real-time team leader notification popup
        └── UserAvatar.tsx              # Emoji & avatar badge component
```
