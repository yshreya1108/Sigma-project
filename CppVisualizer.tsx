import React, { useState } from 'react';
import { defaultSkillGraph, MatchingEngine } from '../lib/graphEngine';
import {
  Layers,
  Code2,
  Share2,
  FileCode,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  GraduationCap,
} from 'lucide-react';

export const CppVisualizer: React.FC = () => {
  const [activeFileTab, setActiveFileTab] = useState<'MATCHING' | 'GRAPH' | 'TEAM' | 'MAIN' | 'STUDENT'>('MATCHING');

  // Interactive Live Graph Tester
  const [skill1, setSkill1] = useState('C');
  const [skill2, setSkill2] = useState('C++');
  const areSkillsRelated = defaultSkillGraph.areRelated(skill1, skill2);
  const relatedList1 = defaultSkillGraph.getRelatedSkills(skill1);

  // Interactive Score Tester
  const [testStudentSkills, setTestStudentSkills] = useState('C, Tailwind CSS, JavaScript');
  const [testRequiredSkills, setTestRequiredSkills] = useState('C++|Python, CSS, React');

  const testCalc = MatchingEngine.calculateDetailedScore(
    testStudentSkills.split(',').map((s) => s.trim()).filter(Boolean),
    testRequiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
    defaultSkillGraph
  );

  const fileSnippets = {
    MATCHING: `// MatchingModule.cpp - Compatibility Score & OR Requirement Parsing
#include "MatchingModule.h"

int MatchingModule::compareSkill(string studentSkill,
                                 string requiredSkill,
                                 const GraphModule& graph) const
{
    // Exact match = 100%
    if(studentSkill == requiredSkill)
    {
        return 100;
    }

    // Related match = 75%
    if(graph.areRelated(studentSkill, requiredSkill))
    {
        return 75;
    }

    return 0;
}

double MatchingModule::calculateScore(const Student& student,
                                      const Project& project,
                                      const GraphModule& graph) const
{
    vector<string> studentSkills = student.getSkills();
    vector<string> requiredSkills = project.getRequiredSkills();

    if(requiredSkills.empty())
        return 0;

    double totalScore = 0;

    for(size_t i = 0; i < requiredSkills.size(); i++)
    {
        string requirement = requiredSkills[i];

        // Supports OR requirements. Example: "C|Python" means C OR Python.
        vector<string> options;
        string current = "";
        for(size_t j = 0; j <= requirement.length(); j++)
        {
            if(j == requirement.length() || requirement[j] == '|')
            {
                if(current != "")
                    options.push_back(current);
                current = "";
            }
            else
            {
                current += requirement[j];
            }
        }

        int bestScore = 0;
        for(size_t j = 0; j < options.size(); j++)
        {
            for(size_t k = 0; k < studentSkills.size(); k++)
            {
                int score = compareSkill(studentSkills[k], options[j], graph);
                if(score > bestScore)
                    bestScore = score;
            }
        }
        totalScore += bestScore;
    }

    return totalScore / requiredSkills.size();
}`,
    GRAPH: `// GraphModule.cpp - Adjacency List for Related Technical Skills
#include "GraphModule.h"

void GraphModule::addSkillRelationship(string skill1, string skill2)
{
    skillGraph[skill1].push_back(skill2);
    skillGraph[skill2].push_back(skill1);
}

bool GraphModule::areRelated(string skill1, string skill2) const
{
    if(skill1 == skill2)
        return true;

    map<string, vector<string> >::const_iterator it;
    it = skillGraph.find(skill1);

    if(it == skillGraph.end())
        return false;

    vector<string> related = it->second;
    for(size_t i = 0; i < related.size(); i++)
    {
        if(related[i] == skill2)
            return true;
    }

    return false;
}

vector<string> GraphModule::getRelatedSkills(string skill) const
{
    map<string, vector<string> >::const_iterator it = skillGraph.find(skill);
    if(it != skillGraph.end())
        return it->second;
    return vector<string>();
}`,
    TEAM: `// TeamModule.cpp - Priority Queue Ranking & Team Formation
#include "TeamModule.h"

void TeamModule::formTeam(
    const StudentModule& students,
    const Project& project,
    const GraphModule& graph) const
{
    MatchingModule matcher;
    vector<Match> matches = matcher.getMatches(students, project, graph);

    if(matches.empty())
    {
        cout << "\\nUnable to form team. No matching students available.\\n";
        return;
    }

    vector<Student> allStudents = students.getStudents();
    vector<Student> team;
    int requiredSize = project.getTeamSize();

    // Select students based on highest matching score
    for(size_t i = 0; i < matches.size(); i++)
    {
        if((int)team.size() >= requiredSize)
            break;

        for(size_t j = 0; j < allStudents.size(); j++)
        {
            if(allStudents[j].getId() == matches[i].studentId)
            {
                team.push_back(allStudents[j]);
                break;
            }
        }
    }

    displayTeam(team, project);
}`,
    MAIN: `// main.cpp - SkillMatch Entry Point & Default Skill Graph Relationships
#include <iostream>
#include "StudentModule.h"
#include "ProjectModule.h"
#include "MatchingModule.h"
#include "GraphModule.h"
#include "TeamModule.h"

int main() {
    GraphModule graphModule;
    // Relationships from Team Sigma B.Tech Project:
    graphModule.addSkillRelationship("C", "C++");
    graphModule.addSkillRelationship("Python", "Django");
    graphModule.addSkillRelationship("Python", "Flask");
    graphModule.addSkillRelationship("JavaScript", "React");
    graphModule.addSkillRelationship("JavaScript", "Node.js");
    graphModule.addSkillRelationship("HTML", "HTML5");
    graphModule.addSkillRelationship("CSS", "Tailwind CSS");
    graphModule.addSkillRelationship("CSS", "Bootstrap");
    graphModule.addSkillRelationship("SQL", "MySQL");
    graphModule.addSkillRelationship("SQL", "PostgreSQL");

    cout << "\\nSkillMatch Engine Initialized.\\n";
    return 0;
}`,
    STUDENT: `// StudentModule.h - Student Data Entity
#ifndef STUDENTMODULE_H
#define STUDENTMODULE_H

#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Student {
private:
    int id;
    string name;
    string email;
    vector<string> skills;
    vector<string> interests;
    string availability;
public:
    Student(int id, string name, string email,
            vector<string> skills,
            vector<string> interests,
            string availability);
    int getId() const;
    string getName() const;
    vector<string> getSkills() const;
};
#endif`,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              C++ Core Modules & Graph Engine Architecture
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Graphic Era University PBL Project (Team Sigma). Directly demonstrates the attached C++ modular source code running in unison with the web platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct C++ Parity
          </span>
        </div>
      </div>

      {/* Interactive C++ Engine Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sandbox 1: Graph Relation Live Probe */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              GraphModule::areRelated(s1, s2) Live Probe
            </h3>
            <span className="text-[11px] text-slate-400">Adjacency List Query</span>
          </div>

          <p className="text-xs text-slate-600">
            Test whether two technical skills share an edge in the undirected skill graph:
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Skill 1:</label>
              <input
                type="text"
                value={skill1}
                onChange={(e) => setSkill1(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Skill 2:</label>
              <input
                type="text"
                value={skill2}
                onChange={(e) => setSkill2(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              areSkillsRelated
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className="font-semibold">
              Result:{' '}
              {areSkillsRelated
                ? `TRUE (Related in Graph -> 75% compatibility bonus)`
                : 'FALSE (No direct relation -> 0% baseline)'}
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border font-bold">
              {areSkillsRelated ? 'MATCH_RELATED' : 'NO_MATCH'}
            </span>
          </div>

          {relatedList1.length > 0 && (
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Neighbors for "{skill1}": </span>
              {relatedList1.join(', ')}
            </div>
          )}
        </div>

        {/* Sandbox 2: MatchingModule Calculation with OR Syntax */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              MatchingModule::calculateScore Live Runner
            </h3>
            <span className="text-[11px] text-indigo-600 font-bold">
              Score: {testCalc.score}%
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Demonstrates C++ OR syntax evaluation (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">C++|Python</code>) and averaging:
          </p>

          <div className="space-y-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Student Skills:</label>
              <input
                type="text"
                value={testStudentSkills}
                onChange={(e) => setTestStudentSkills(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Project Required Skills (Supports OR with <code className="font-mono">|</code>):
              </label>
              <input
                type="text"
                value={testRequiredSkills}
                onChange={(e) => setTestRequiredSkills(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {testCalc.breakdown.map((b, i) => (
              <span
                key={i}
                className={`text-[11px] px-2 py-0.5 rounded border font-medium ${
                  b.matchType === 'exact'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : b.matchType === 'related'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {b.required} ➔ {b.score}% ({b.matchType})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded C++ Source Code Files Viewer */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        {/* File tabs */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 font-semibold px-2">C++ Files:</span>
            <button
              type="button"
              onClick={() => setActiveFileTab('MATCHING')}
              className={`px-3 py-1.5 rounded font-mono font-medium transition-colors ${
                activeFileTab === 'MATCHING'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              MatchingModule.cpp
            </button>
            <button
              type="button"
              onClick={() => setActiveFileTab('GRAPH')}
              className={`px-3 py-1.5 rounded font-mono font-medium transition-colors ${
                activeFileTab === 'GRAPH'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              GraphModule.cpp
            </button>
            <button
              type="button"
              onClick={() => setActiveFileTab('TEAM')}
              className={`px-3 py-1.5 rounded font-mono font-medium transition-colors ${
                activeFileTab === 'TEAM'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              TeamModule.cpp
            </button>
            <button
              type="button"
              onClick={() => setActiveFileTab('MAIN')}
              className={`px-3 py-1.5 rounded font-mono font-medium transition-colors ${
                activeFileTab === 'MAIN'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              main.cpp
            </button>
            <button
              type="button"
              onClick={() => setActiveFileTab('STUDENT')}
              className={`px-3 py-1.5 rounded font-mono font-medium transition-colors ${
                activeFileTab === 'STUDENT'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              StudentModule.h
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            /public/assets/aistudio/
          </span>
        </div>

        {/* Code Content */}
        <pre className="p-5 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed bg-slate-950">
          <code>{fileSnippets[activeFileTab]}</code>
        </pre>
      </div>
    </div>
  );
};
