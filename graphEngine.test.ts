import test from 'node:test';
import assert from 'node:assert/strict';
import { SkillGraphEngine, MatchingEngine } from './graphEngine';

test('SkillGraphEngine adds relationships and checks relatedness', () => {
  const graph = new SkillGraphEngine();
  
  // Directly seeded
  assert.equal(graph.areRelated('C', 'C++'), true);
  assert.equal(graph.areRelated('C++', 'C'), true);
  assert.equal(graph.areRelated('Python', 'Django'), true);
  
  // Custom addition
  graph.addSkillRelationship('Rust', 'Systems Programming');
  assert.equal(graph.areRelated('Rust', 'Systems Programming'), true);
  assert.equal(graph.areRelated('Rust', 'HTML'), false);
});

test('MatchingEngine compares exact and related skills correctly', () => {
  const graph = new SkillGraphEngine();
  
  // Exact = 100
  assert.equal(MatchingEngine.compareSkill('C++', 'C++', graph), 100);
  assert.equal(MatchingEngine.compareSkill('c++', 'C++', graph), 100);
  
  // Related = 75 (C related to C++)
  assert.equal(MatchingEngine.compareSkill('C', 'C++', graph), 75);
  
  // Unrelated = 0
  assert.equal(MatchingEngine.compareSkill('Ruby', 'C++', graph), 0);
});

test('MatchingEngine handles OR requirements like C|Python and calculates averages', () => {
  const graph = new SkillGraphEngine();
  const studentSkills = ['C', 'Tailwind CSS'];
  
  // Requirement: "C++|Python" -> student knows C which is related to C++ (75 score)
  // Requirement: "CSS" -> student knows Tailwind CSS which is related to CSS (75 score)
  const result = MatchingEngine.calculateDetailedScore(
    studentSkills,
    ['C++|Python', 'CSS'],
    graph
  );
  
  assert.equal(result.score, 75);
  assert.equal(result.breakdown.length, 2);
  assert.equal(result.breakdown[0].matchType, 'related');
});

test('MatchingEngine scores 100 for exact matches across all requirements', () => {
  const graph = new SkillGraphEngine();
  const studentSkills = ['C++', 'React', 'Data Structures'];
  
  const score = MatchingEngine.calculateScore(
    studentSkills,
    ['C++', 'React'],
    graph
  );
  
  assert.equal(score, 100);
});
