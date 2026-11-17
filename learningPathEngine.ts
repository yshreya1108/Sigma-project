/**
 * Learning Path Engine
 * Analyzes assessment feedback and candidate submissions to generate
 * personalized C/C++ learning paths, tutorials, and documentation links.
 */

import { AssessmentSubmission, StudentProfile, TeamApplication } from './types';

export interface LearningTopic {
  id: string;
  title: string;
  category: 'Memory Safety' | 'Pointer Mechanics' | 'Algorithms & Complexity' | 'Modern C++ / STL' | 'Defensive Coding';
  priority: 'HIGH' | 'MEDIUM' | 'RECOMMENDED';
  diagnosedIssue: string;
  description: string;
  tutorials: Array<{
    title: string;
    source: string;
    url: string;
    type: 'Documentation' | 'Interactive Tutorial' | 'Official Guide';
    readTime: string;
  }>;
  codeComparison: {
    vulnerableSnippet: string;
    vulnerableLabel: string;
    fixedSnippet: string;
    fixedLabel: string;
    explanation: string;
  };
}

export interface RoadmapCheckpoint {
  id: string;
  label: string;
  detail: string;
  completed: boolean;
  linkedTopicId?: string;
  actionType?: 'TOGGLE_TOPIC' | 'TAKE_ASSESSMENT' | 'BROWSE_TEAMS';
}

export interface RoadmapStage {
  id: string;
  stepNumber: number;
  title: string;
  shortTitle: string;
  tierLabel: string;
  subtitle: string;
  cppModuleRef: string;
  status: 'MASTERED' | 'IN_PROGRESS' | 'UNLOCKED' | 'LOCKED';
  progressPercent: number;
  checkpoints: RoadmapCheckpoint[];
  keyConcepts: string[];
  nextActionText: string;
}

export interface RoadmapProgress {
  overallReadinessPercent: number;
  readinessTierTitle: string;
  readinessSummary: string;
  completedStagesCount: number;
  totalStagesCount: number;
  currentStageId: string;
  stages: RoadmapStage[];
}

export class LearningPathEngine {
  public static generateLearningPath(
    profile: StudentProfile,
    submissions: AssessmentSubmission[]
  ): {
    headline: string;
    overallRecommendation: string;
    topics: LearningTopic[];
  } {
    const candidateSubmissions = submissions.filter((s) => s.candidateId === profile.id);
    const latestSubmission = candidateSubmissions.length > 0 ? candidateSubmissions[0] : null;

    const topics: LearningTopic[] = [];

    // Analyze feedback & audit notes from submission or profile
    const hasMemoryLeakIssue = latestSubmission?.memorySafetyNotes.some((n) =>
      n.toLowerCase().includes('leak') || n.toLowerCase().includes('delete') || n.toLowerCase().includes('free')
    );
    const hasBufferOverflowIssue = latestSubmission?.memorySafetyNotes.some((n) =>
      n.toLowerCase().includes('buffer') || n.toLowerCase().includes('gets') || n.toLowerCase().includes('overflow')
    );
    const hasNullCheckIssue = latestSubmission?.memorySafetyNotes.some((n) =>
      n.toLowerCase().includes('null') || n.toLowerCase().includes('defensive')
    );
    const hasComplexityIssue = latestSubmission?.timeComplexity.includes('O(N^2)');
    const score = latestSubmission ? latestSubmission.score : profile.assessmentStatus?.score || 0;

    // Topic 1: RAII & Heap Memory Management (Always high yield in C++)
    topics.push({
      id: 'topic-raii-memory',
      title: 'RAII & Dynamic Heap Deallocation (`delete[]` / `free`)',
      category: 'Memory Safety',
      priority: hasMemoryLeakIssue || score < 90 ? 'HIGH' : 'RECOMMENDED',
      diagnosedIssue: hasMemoryLeakIssue
        ? 'Identified during assessment: Dynamic allocations were not paired with corresponding deallocators in the destructor.'
        : 'Essential for Graphic Era University C++ project teams: Zero memory leak invariant under exceptions and capacity scaling.',
      description:
        'In C++, resource management must be tied to object lifetime (RAII). When allocating arrays via `new[]`, you must invoke `delete[]` in the class destructor to prevent heap leaks.',
      tutorials: [
        {
          title: 'cppreference: Resource Acquisition Is Initialization (RAII)',
          source: 'cppreference.com',
          url: 'https://en.cppreference.com/w/cpp/language/raii',
          type: 'Documentation',
          readTime: '6 min',
        },
        {
          title: 'C++ Core Guidelines: Resource Management & Destructors',
          source: 'isocpp.github.io',
          url: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii',
          type: 'Official Guide',
          readTime: '10 min',
        },
        {
          title: 'Valgrind Memcheck: Detecting Heap Memory Leaks in C/C++',
          source: 'valgrind.org',
          url: 'https://valgrind.org/docs/manual/mc-manual.html',
          type: 'Interactive Tutorial',
          readTime: '8 min',
        },
      ],
      codeComparison: {
        vulnerableLabel: 'Vulnerable: Leaky Dynamic Array Destructor',
        vulnerableSnippet: `class CustomVector {
    int* data;
    size_t sz, cap;
public:
    CustomVector(size_t c = 2) : sz(0), cap(c) {
        data = new int[cap];
    }
    // BUG: Missing destructor! Memory leaks when object goes out of scope.
};`,
        fixedLabel: 'Fixed: Idiomatic RAII with Destructor',
        fixedSnippet: `class CustomVector {
    int* data;
    size_t sz, cap;
public:
    CustomVector(size_t c = 2) : sz(0), cap(c) {
        data = new int[cap];
    }
    // FIX: Deallocate heap buffer with delete[]
    ~CustomVector() {
        delete[] data;
    }
};`,
        explanation:
          'Failing to declare `~CustomVector()` leaks the heap buffer upon scope exit. Modern C++ also prefers `std::unique_ptr<int[]>` for automated memory safety.',
      },
    });

    // Topic 2: Raw Pointer Arithmetic & Defensive Null Checks
    topics.push({
      id: 'topic-pointers-nullsafety',
      title: 'Raw Pointer Mechanics & Defensive NULL/nullptr Validation',
      category: 'Pointer Mechanics',
      priority: hasNullCheckIssue || score < 85 ? 'HIGH' : 'MEDIUM',
      diagnosedIssue: hasNullCheckIssue
        ? 'Identified during assessment: Defensive null checks were missing before dereferencing raw pointers.'
        : 'Critical for C systems programming: Safeguarding against segmentation faults and dangling references.',
      description:
        'In pure C and low-level C++, raw pointers do not carry boundary or validity metadata. Every public API function must check for `NULL` / `nullptr` before dereferencing.',
      tutorials: [
        {
          title: 'Learn-C.org: Pointers and Pointer Arithmetic in C',
          source: 'learn-c.org',
          url: 'https://www.learn-c.org/en/Pointers',
          type: 'Interactive Tutorial',
          readTime: '7 min',
        },
        {
          title: 'cppreference: nullptr and Pointer Safety Best Practices',
          source: 'cppreference.com',
          url: 'https://en.cppreference.com/w/cpp/language/nullptr',
          type: 'Documentation',
          readTime: '5 min',
        },
      ],
      codeComparison: {
        vulnerableLabel: 'Vulnerable: Insecure Pointer Dereference',
        vulnerableSnippet: `void reverse_string(char* str) {
    char* end = str;
    // CRASH: Undefined behavior / segfault if str is NULL!
    while (*end != '\\0') end++;
}`,
        fixedLabel: 'Fixed: Defensive Null Check & In-place Swap',
        fixedSnippet: `void reverse_string(char* str) {
    if (str == NULL) return; // Guard clause
    
    char* start = str;
    char* end = str;
    while (*end != '\\0') end++;
    end--; // Step back from '\\0'
    
    while (start < end) {
        char tmp = *start;
        *start++ = *end--;
    }
}`,
        explanation:
          'Adding a defensive guard clause `if (str == NULL) return;` prevents catastrophic segmentation faults across operating system threads.',
      },
    });

    // Topic 3: Graph Traversal & Shortest Path (PBL SkillMatch Core)
    topics.push({
      id: 'topic-graph-bfs',
      title: 'Graph Adjacency Lists & BFS Shortest Path Traversal',
      category: 'Algorithms & Complexity',
      priority: 'RECOMMENDED',
      diagnosedIssue:
        'Directly applicable to Team Sigma\'s GraphModule: Matching skills across K degrees of separation using BFS queues.',
      description:
        'Using `std::unordered_map<std::string, std::vector<std::string>>` and `std::queue` guarantees optimal $O(V + E)$ shortest-distance queries without cyclic infinite loops.',
      tutorials: [
        {
          title: 'GeeksforGeeks: Breadth First Search (BFS) for a Graph in C++',
          source: 'geeksforgeeks.org',
          url: 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/',
          type: 'Interactive Tutorial',
          readTime: '8 min',
        },
        {
          title: 'cppreference: std::queue container adapter documentation',
          source: 'cppreference.com',
          url: 'https://en.cppreference.com/w/cpp/container/queue',
          type: 'Documentation',
          readTime: '4 min',
        },
      ],
      codeComparison: {
        vulnerableLabel: 'Vulnerable: Unvisited Graph Traversal (Cycle Danger)',
        vulnerableSnippet: `void traverse(string node) {
    // BUG: Missing visited set! Cyclic graphs cause stack overflow.
    for (auto& neighbor : adj[node]) {
        traverse(neighbor);
    }
}`,
        fixedLabel: 'Fixed: BFS with std::unordered_set Visited Guard',
        fixedSnippet: `bool areRelated(string start, string target, int maxK) {
    unordered_set<string> visited;
    queue<pair<string, int>> q;
    q.push({start, 0});
    visited.insert(start);

    while (!q.empty()) {
        auto [curr, dist] = q.front(); q.pop();
        if (curr == target) return true;
        if (dist >= maxK) continue;

        for (const auto& next : adj[curr]) {
            if (visited.insert(next).second) {
                q.push({next, dist + 1});
            }
        }
    }
    return false;
}`,
        explanation:
          '`visited.insert(next).second` atomically checks and inserts visited nodes in $O(1)$, completely preventing cycle re-entry.',
      },
    });

    // Topic 4: Defensive Coding & Buffer Overflow Mitigation
    topics.push({
      id: 'topic-buffer-safety',
      title: 'Buffer Bounds Safety & Elimination of Unsafe C Functions',
      category: 'Defensive Coding',
      priority: hasBufferOverflowIssue ? 'HIGH' : 'MEDIUM',
      diagnosedIssue: hasBufferOverflowIssue
        ? 'Identified during assessment: Insecure memory copy or unchecked boundary buffer operations.'
        : 'Essential for university cybersecurity and low-level systems engineering.',
      description:
        'Avoid depreciated C library functions like `gets()` or unchecked array bounds. Use bounded operations (`fgets`, `snprintf`, `std::string_view`, bounds-checking `vector::at()`).',
      tutorials: [
        {
          title: 'SEI CERT C Coding Standard: Eliminate Buffer Overflows (STR31-C)',
          source: 'wiki.sei.cmu.edu',
          url: 'https://wiki.sei.cmu.edu/confluence/display/c/STR31-C.+Guarantee+that+storage+for+strings+has+sufficient+space+for+character+data+and+the+null+terminator',
          type: 'Official Guide',
          readTime: '9 min',
        },
        {
          title: 'cppreference: std::string_view and Memory Safety',
          source: 'cppreference.com',
          url: 'https://en.cppreference.com/w/cpp/string/basic_string_view',
          type: 'Documentation',
          readTime: '6 min',
        },
      ],
      codeComparison: {
        vulnerableLabel: 'Vulnerable: Insecure gets() and Buffer Overflow',
        vulnerableSnippet: `void read_input() {
    char buffer[64];
    // DANGEROUS: gets() does not check buffer boundary! Vulnerable to exploits.
    gets(buffer);
}`,
        fixedLabel: 'Fixed: Safe fgets() with Bounded Buffer Capacity',
        fixedSnippet: `void read_input() {
    char buffer[64];
    // SAFE: Reads at most sizeof(buffer)-1 characters
    if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
        // Securely bounded
    }
}`,
        explanation:
          'Using `fgets()` ensures the input cannot exceed the allocated array capacity, preventing memory corruption and exploits.',
      },
    });

    const headline =
      score >= 90
        ? 'Advanced C/C++ Systems Mastery & High-Performance Optimizations'
        : score >= 70
        ? 'Personalized C/C++ Improvement Path: Memory Hygiene & Defensive Pointers'
        : 'Foundational C/C++ Recovery Path: Pointer Arithmetic & Zero-Leak Principles';

    const overallRecommendation =
      score >= 90
        ? 'Your score qualifies you as a Verified C/C++ Developer! To push your expertise toward compiler engineering and distributed systems, focus on cache locality and modern C++20 concurrency.'
        : score >= 70
        ? 'You have demonstrated solid algorithmic foundations. Reviewing the RAII destructor deallocation and boundary guard tutorials below will ensure 100% eligibility across all university project criteria.'
        : 'Review the high-priority tutorials on raw pointer arithmetic and dynamic memory allocation (`delete[]`/`free`). Practice the before/after code comparisons and retake the assessment to earn your verified badge.';

    return {
      headline,
      overallRecommendation,
      topics,
    };
  }

  public static calculateRoadmapProgress(
    profile: StudentProfile,
    submissions: AssessmentSubmission[],
    masteredTopicIds: string[] = [],
    applications: TeamApplication[] = []
  ): RoadmapProgress {
    const candidateSubmissions = submissions.filter((s) => s.candidateId === profile.id);
    const latestSubmission = candidateSubmissions.length > 0 ? candidateSubmissions[0] : null;
    const score = latestSubmission ? latestSubmission.score : profile.assessmentStatus?.score || 0;
    const cppVerified = Boolean(profile.assessmentStatus?.cppVerified);
    const cVerified = Boolean(profile.assessmentStatus?.cVerified);
    const verdict = profile.assessmentStatus?.verdict || 'PENDING';
    const cheatFlags = profile.assessmentStatus?.cheatFlags || 0;

    const hasCppSkill = profile.skills.some((s) =>
      ['c++', 'c', 'data structures', 'stl', 'systems programming'].includes(s.toLowerCase())
    );
    const hasSyntaxPassed = Boolean(latestSubmission?.syntaxValid) || score >= 50;
    const isPointersMastered = masteredTopicIds.includes('topic-pointers-nullsafety');
    const isBufferMastered = masteredTopicIds.includes('topic-buffer-safety');
    const isRaiiMastered = masteredTopicIds.includes('topic-raii-memory');
    const isGraphMastered = masteredTopicIds.includes('topic-graph-bfs');

    const hasZeroMemoryLeakAudit =
      score >= 75 &&
      (!latestSubmission ||
        !latestSubmission.memorySafetyNotes.some(
          (n) => n.toLowerCase().includes('leak') || n.toLowerCase().includes('missing')
        ));

    const hasOptimalComplexity =
      score >= 75 &&
      (!latestSubmission || !latestSubmission.timeComplexity.includes('O(N^2)'));

    const hasUploadedCredentials = Boolean(
      profile.resumeFileName || profile.githubUrl || (profile.certificates && profile.certificates.length > 0)
    );

    const candidateApps = applications.filter((a) => a.studentId === profile.id);
    const hasAppliedOrJoinedTeam = candidateApps.some(
      (a) => a.status === 'PENDING' || a.status === 'APPROVED'
    );
    const hasAcceptedTeam = candidateApps.some((a) => a.status === 'APPROVED');

    // Define raw stages with checkpoints
    const rawStages: Array<{
      id: string;
      stepNumber: number;
      title: string;
      shortTitle: string;
      tierLabel: string;
      subtitle: string;
      cppModuleRef: string;
      checkpoints: RoadmapCheckpoint[];
      keyConcepts: string[];
      nextActionText: string;
    }> = [
      {
        id: 'stage-1-foundations',
        stepNumber: 1,
        title: 'Beginner C/C++ Syntax & Pointer Foundations',
        shortTitle: '1. C/C++ Foundations',
        tierLabel: 'Tier 1 • Beginner Concepts',
        subtitle: 'Address-of mechanics, defensive nullptr guards, and bounded C buffer operations.',
        cppModuleRef: 'StudentModule.h / DataStorage.h',
        keyConcepts: ['Raw Pointers (*, &)', 'Null-Safety Guards', 'Bounded I/O (fgets/snprintf)', 'Compilation & Syntax'],
        nextActionText: 'Review defensive pointer mechanics and mark foundational C/C++ topics as mastered.',
        checkpoints: [
          {
            id: 'cp-1-skill-profile',
            label: 'C/C++ Core Language & Syntax Readiness',
            detail: 'Declare C/C++ proficiency in student profile or pass initial syntax compiler check.',
            completed: hasCppSkill || hasSyntaxPassed,
            actionType: 'TAKE_ASSESSMENT',
          },
          {
            id: 'cp-1-null-guards',
            label: 'Defensive Pointer Arithmetic & Null-Safety Guards',
            detail: 'Validate raw pointers before dereferencing (`ptr != nullptr`) in linked structures.',
            completed: isPointersMastered,
            linkedTopicId: 'topic-pointers-nullsafety',
            actionType: 'TOGGLE_TOPIC',
          },
          {
            id: 'cp-1-buffer-bounds',
            label: 'Secure Buffer Boundaries & String Safety',
            detail: 'Eliminate unbounded C array writes using `fgets`, `snprintf`, or `std::string_view`.',
            completed: isBufferMastered,
            linkedTopicId: 'topic-buffer-safety',
            actionType: 'TOGGLE_TOPIC',
          },
        ],
      },
      {
        id: 'stage-2-memory-raii',
        stepNumber: 2,
        title: 'Dynamic Memory Management & RAII Idioms',
        shortTitle: '2. Memory & RAII',
        tierLabel: 'Tier 2 • Core Systems C++',
        subtitle: 'Deterministic destructor cleanup, heap lifecycle discipline, and smart pointers.',
        cppModuleRef: 'StudentModule.cpp / ProjectModule.cpp',
        keyConcepts: ['RAII Destructors (~T)', 'new[] / delete[] Pairing', 'std::unique_ptr', 'Zero-Leak Valgrind Hygiene'],
        nextActionText: 'Master RAII destructor patterns and pass the static memory-leak verification audit.',
        checkpoints: [
          {
            id: 'cp-2-raii-topic',
            label: 'RAII & Deterministic Heap Deallocation',
            detail: 'Pair every dynamic allocation with scoped destructor cleanup or `std::unique_ptr`.',
            completed: isRaiiMastered,
            linkedTopicId: 'topic-raii-memory',
            actionType: 'TOGGLE_TOPIC',
          },
          {
            id: 'cp-2-zero-leak-audit',
            label: 'Static Memory Leak Verification Audit',
            detail: 'Submit C/C++ assessment code with zero unfreed heap blocks and score >= 75%.',
            completed: hasZeroMemoryLeakAudit,
            actionType: 'TAKE_ASSESSMENT',
          },
          {
            id: 'cp-2-c-verified',
            label: 'Low-Level C Pointer & Memory Verification',
            detail: 'Achieve verified status in C pointer manipulation and linked node reallocation.',
            completed: cVerified || score >= 80,
            actionType: 'TAKE_ASSESSMENT',
          },
        ],
      },
      {
        id: 'stage-3-dsa-graphs',
        stepNumber: 3,
        title: 'STL Data Structures & Graph Algorithms',
        shortTitle: '3. STL & Graph Algorithms',
        tierLabel: 'Tier 3 • Algorithmic Fluency',
        subtitle: 'Adjacency lists, O(V + E) Breadth-First Search, and priority-queue ranking.',
        cppModuleRef: 'GraphModule.cpp / MatchingModule.cpp',
        keyConcepts: ['std::vector & unordered_map', 'Bipartite Adjacency Graph', 'BFS Shortest-Path', 'O(V + E) Complexity'],
        nextActionText: 'Master O(V + E) graph traversal and eliminate quadratic O(N^2) nested loops.',
        checkpoints: [
          {
            id: 'cp-3-graph-topic',
            label: 'Adjacency List & O(V + E) BFS Traversal',
            detail: 'Implement `std::queue` Breadth-First Search for skill-to-project graph discovery.',
            completed: isGraphMastered,
            linkedTopicId: 'topic-graph-bfs',
            actionType: 'TOGGLE_TOPIC',
          },
          {
            id: 'cp-3-complexity-audit',
            label: 'Optimal Time & Space Complexity Benchmark',
            detail: 'Pass automated Big-O complexity check without O(N^2) performance bottlenecks.',
            completed: hasOptimalComplexity,
            actionType: 'TAKE_ASSESSMENT',
          },
          {
            id: 'cp-3-cpp-verified',
            label: 'Modern C++ STL Container Proficiency',
            detail: 'Earn the Verified C++ badge via dynamic vector or graph engine assessment.',
            completed: cppVerified,
            actionType: 'TAKE_ASSESSMENT',
          },
        ],
      },
      {
        id: 'stage-4-verification',
        stepNumber: 4,
        title: 'Multi-Module Architecture & Proctored Verification',
        shortTitle: '4. Proctored Verification',
        tierLabel: 'Tier 4 • Verified Developer',
        subtitle: 'Anti-cheat proctored certification, multi-file header modularity, and recruiter audit.',
        cppModuleRef: 'main.cpp / TeamModule.h',
        keyConcepts: ['Header Guards (#pragma once)', 'Proctored Anti-Cheat Integrity', 'Recruiter Code Audit', 'VERIFIED_ELIGIBLE Tier'],
        nextActionText: 'Complete the proctored C/C++ assessment with >= 75% score and zero anti-cheat violations.',
        checkpoints: [
          {
            id: 'cp-4-proctored-integrity',
            label: 'Anti-Cheat Proctoring Integrity Clearance',
            detail: 'Complete timed assessment with zero unauthorized tab switches or clipboard injections.',
            completed: (cppVerified || cVerified || score >= 70) && cheatFlags === 0,
            actionType: 'TAKE_ASSESSMENT',
          },
          {
            id: 'cp-4-eligibility-verdict',
            label: 'Verified Eligible Recruiter Audit Verdict',
            detail: 'Achieve `VERIFIED_ELIGIBLE` status on the automated C/C++ recruiting rubric.',
            completed: verdict === 'VERIFIED_ELIGIBLE',
            actionType: 'TAKE_ASSESSMENT',
          },
          {
            id: 'cp-4-dual-language',
            label: 'Full-Stack Systems Mastery (C & C++ Dual Badge)',
            detail: 'Hold dual verification across both C++ OOP/STL and C pointer systems.',
            completed: cppVerified && cVerified,
            actionType: 'TAKE_ASSESSMENT',
          },
        ],
      },
      {
        id: 'stage-5-collaboration',
        stepNumber: 5,
        title: 'Advanced Project Collaboration Readiness',
        shortTitle: '5. Collaboration Ready',
        tierLabel: 'Tier 5 • Production Team Ready',
        subtitle: 'Verified engineering dossier, algorithmic team matching, and active PBL collaboration.',
        cppModuleRef: 'TeamModule.cpp / MatchingModule.h',
        keyConcepts: ['PDF Dossier & GitHub Repo', 'Graph Compatibility Matching', 'Leader Pre-Acceptance Chat', 'Multi-Developer PBL'],
        nextActionText: 'Apply to high-compatibility university project teams and collaborate with team leaders.',
        checkpoints: [
          {
            id: 'cp-5-dossier',
            label: 'Technical Resume PDF & GitHub Portfolio Linked',
            detail: 'Upload verified PDF credentials and GitHub repository link for team leader inspection.',
            completed: hasUploadedCredentials,
          },
          {
            id: 'cp-5-eligibility-unlocked',
            label: 'University Team Recruitment Eligibility Unlocked',
            detail: 'Meet minimum skill assessment threshold (`ELIGIBLE_WITH_CONDITIONS` or `VERIFIED_ELIGIBLE`).',
            completed: verdict === 'VERIFIED_ELIGIBLE' || verdict === 'ELIGIBLE_WITH_CONDITIONS',
            actionType: 'TAKE_ASSESSMENT',
          },
          {
            id: 'cp-5-active-collaboration',
            label: 'Active Team Application & Leader Collaboration',
            detail: hasAcceptedTeam
              ? 'Accepted into an active university project team with full team chat access.'
              : 'Submit an application to a matching team and initiate real-time leader discussion.',
            completed: hasAppliedOrJoinedTeam,
            actionType: 'BROWSE_TEAMS',
          },
        ],
      },
    ];

    // Calculate status and progress per stage
    let previousStageMastered = true;
    let currentStageId = rawStages[0].id;
    let foundActiveStage = false;

    const stages: RoadmapStage[] = rawStages.map((raw) => {
      const totalCp = raw.checkpoints.length;
      const doneCp = raw.checkpoints.filter((c) => c.completed).length;
      const progressPercent = totalCp > 0 ? Math.round((doneCp / totalCp) * 100) : 0;

      let status: RoadmapStage['status'];
      if (progressPercent === 100) {
        status = 'MASTERED';
      } else if (progressPercent > 0 || previousStageMastered) {
        status = 'IN_PROGRESS';
        if (!foundActiveStage) {
          currentStageId = raw.id;
          foundActiveStage = true;
        }
      } else {
        status = 'UNLOCKED';
      }

      previousStageMastered = progressPercent === 100;

      return {
        ...raw,
        status,
        progressPercent,
      };
    });

    if (!foundActiveStage) {
      currentStageId = stages[stages.length - 1].id;
    }

    const totalCheckpoints = stages.reduce((acc, s) => acc + s.checkpoints.length, 0);
    const completedCheckpoints = stages.reduce(
      (acc, s) => acc + s.checkpoints.filter((c) => c.completed).length,
      0
    );
    const overallReadinessPercent =
      totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;
    const completedStagesCount = stages.filter((s) => s.status === 'MASTERED').length;

    let readinessTierTitle = 'Stage 1: Foundational C/C++ Learner';
    let readinessSummary =
      'Build core pointer safety and memory management habits to unlock university project team eligibility.';

    if (overallReadinessPercent >= 90) {
      readinessTierTitle = 'Stage 5: Advanced Project Collaboration Ready';
      readinessSummary =
        'You have mastered C/C++ memory safety, STL graph algorithms, and proctored verification—fully ready to lead or contribute to top university PBL teams.';
    } else if (overallReadinessPercent >= 70) {
      readinessTierTitle = 'Stage 4: Verified Systems & STL Practitioner';
      readinessSummary =
        'Strong command of C++ RAII, STL containers, and algorithmic complexity. Complete remaining verification or team checkpoints for 100% readiness.';
    } else if (overallReadinessPercent >= 45) {
      readinessTierTitle = 'Stage 3: Intermediate C++ & Data Structures Builder';
      readinessSummary =
        'Solid progress on foundational pointer safety. Focus on RAII heap cleanup and O(V + E) graph algorithms to earn full verification.';
    }

    return {
      overallReadinessPercent,
      readinessTierTitle,
      readinessSummary,
      completedStagesCount,
      totalStagesCount: stages.length,
      currentStageId,
      stages,
    };
  }
}

