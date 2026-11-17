/**
 * SkillGraph and Matching Engine
 * Direct TypeScript port and extension of C++ modules:
 * GraphModule.h / GraphModule.cpp
 * MatchingModule.h / MatchingModule.cpp
 * TeamModule.h / TeamModule.cpp
 */

export class SkillGraphEngine {
  private adjacencyList: Map<string, Set<string>> = new Map();

  constructor() {
    this.seedDefaultRelationships();
  }

  // Exact counterpart to GraphModule::addSkillRelationship
  public addSkillRelationship(skill1: string, skill2: string): void {
    const s1 = skill1.trim().toLowerCase();
    const s2 = skill2.trim().toLowerCase();

    if (!this.adjacencyList.has(s1)) {
      this.adjacencyList.set(s1, new Set());
    }
    if (!this.adjacencyList.has(s2)) {
      this.adjacencyList.set(s2, new Set());
    }

    this.adjacencyList.get(s1)!.add(s2);
    this.adjacencyList.get(s2)!.add(s1);
  }

  // Exact counterpart to GraphModule::areRelated
  public areRelated(skill1: string, skill2: string): boolean {
    const s1 = skill1.trim().toLowerCase();
    const s2 = skill2.trim().toLowerCase();

    if (s1 === s2) return true;

    const neighbors = this.adjacencyList.get(s1);
    if (!neighbors) return false;

    return neighbors.has(s2);
  }

  // Exact counterpart to GraphModule::getRelatedSkills
  public getRelatedSkills(skill: string): string[] {
    const s = skill.trim().toLowerCase();
    const set = this.adjacencyList.get(s);
    return set ? Array.from(set) : [];
  }

  public getAllRelationships(): Array<{ skill: string; related: string[] }> {
    const result: Array<{ skill: string; related: string[] }> = [];
    for (const [skill, relatedSet] of this.adjacencyList.entries()) {
      result.push({
        skill,
        related: Array.from(relatedSet),
      });
    }
    return result;
  }

  // Default skill relationships from main.cpp plus real university project domains
  private seedDefaultRelationships(): void {
    // Relationships from main.cpp:
    this.addSkillRelationship('C', 'C++');
    this.addSkillRelationship('Python', 'Django');
    this.addSkillRelationship('Python', 'Flask');
    this.addSkillRelationship('JavaScript', 'React');
    this.addSkillRelationship('JavaScript', 'Node.js');
    this.addSkillRelationship('HTML', 'HTML5');
    this.addSkillRelationship('CSS', 'Tailwind CSS');
    this.addSkillRelationship('CSS', 'Bootstrap');
    this.addSkillRelationship('SQL', 'MySQL');
    this.addSkillRelationship('SQL', 'PostgreSQL');

    // Extended domains for 100+ university teams:
    this.addSkillRelationship('C++', 'Data Structures');
    this.addSkillRelationship('C++', 'Algorithms');
    this.addSkillRelationship('C', 'Embedded Systems');
    this.addSkillRelationship('C', 'Operating Systems');
    this.addSkillRelationship('TypeScript', 'JavaScript');
    this.addSkillRelationship('React', 'Next.js');
    this.addSkillRelationship('Python', 'PyTorch');
    this.addSkillRelationship('Python', 'TensorFlow');
    this.addSkillRelationship('PyTorch', 'Deep Learning');
    this.addSkillRelationship('TensorFlow', 'Machine Learning');
    this.addSkillRelationship('Machine Learning', 'Data Science');
    this.addSkillRelationship('Docker', 'Kubernetes');
    this.addSkillRelationship('Docker', 'DevOps');
    this.addSkillRelationship('AWS', 'Cloud Computing');
    this.addSkillRelationship('GCP', 'Cloud Computing');
    this.addSkillRelationship('Cryptography', 'Cybersecurity');
    this.addSkillRelationship('Penetration Testing', 'Cybersecurity');
    this.addSkillRelationship('Solidity', 'Smart Contracts');
    this.addSkillRelationship('Blockchain', 'Solidity');
    this.addSkillRelationship('ROS', 'Robotics');
    this.addSkillRelationship('Arduino', 'IoT');
    this.addSkillRelationship('Computer Vision', 'OpenCV');
    this.addSkillRelationship('Natural Language Processing', 'LLMs');
  }
}

// Global singleton instance for consistency
export const defaultSkillGraph = new SkillGraphEngine();

export interface StudentMatchScore {
  studentId: string;
  studentName: string;
  studentSkills: string[];
  score: number; // 0 to 100
  breakdown: Array<{
    required: string;
    matchedSkill: string | null;
    score: number;
    matchType: 'exact' | 'related' | 'none';
  }>;
}

/**
 * Exact counterpart to MatchingModule in C++:
 * compareSkill: exact -> 100, related -> 75, none -> 0
 * calculateScore: handles "SkillA|SkillB" OR expressions, averages requirement scores
 */
export class MatchingEngine {
  public static compareSkill(
    studentSkill: string,
    requiredSkill: string,
    graph: SkillGraphEngine = defaultSkillGraph
  ): number {
    const s1 = studentSkill.trim().toLowerCase();
    const s2 = requiredSkill.trim().toLowerCase();

    // Exact match
    if (s1 === s2) {
      return 100;
    }

    // Related match
    if (graph.areRelated(s1, s2)) {
      return 75;
    }

    return 0;
  }

  public static calculateDetailedScore(
    studentSkills: string[],
    requiredSkills: string[],
    graph: SkillGraphEngine = defaultSkillGraph
  ): {
    score: number;
    breakdown: Array<{
      required: string;
      matchedSkill: string | null;
      score: number;
      matchType: 'exact' | 'related' | 'none';
    }>;
  } {
    if (!requiredSkills || requiredSkills.length === 0) {
      return { score: 100, breakdown: [] };
    }

    let totalScore = 0;
    const breakdown: Array<{
      required: string;
      matchedSkill: string | null;
      score: number;
      matchType: 'exact' | 'related' | 'none';
    }> = [];

    for (const requirement of requiredSkills) {
      // Split OR requirements (e.g., "C|Python")
      const options = requirement.split('|').map((opt) => opt.trim());
      let bestScore = 0;
      let bestMatchedSkill: string | null = null;
      let bestMatchType: 'exact' | 'related' | 'none' = 'none';

      for (const option of options) {
        for (const sSkill of studentSkills) {
          const s = this.compareSkill(sSkill, option, graph);
          if (s > bestScore) {
            bestScore = s;
            bestMatchedSkill = sSkill;
            bestMatchType = s === 100 ? 'exact' : 'related';
          }
        }
      }

      totalScore += bestScore;
      breakdown.push({
        required: requirement,
        matchedSkill: bestMatchedSkill,
        score: bestScore,
        matchType: bestMatchType,
      });
    }

    const finalScore = Math.round(totalScore / requiredSkills.length);
    return {
      score: finalScore,
      breakdown,
    };
  }

  public static calculateScore(
    studentSkills: string[],
    requiredSkills: string[],
    graph: SkillGraphEngine = defaultSkillGraph
  ): number {
    return this.calculateDetailedScore(studentSkills, requiredSkills, graph).score;
  }
}
