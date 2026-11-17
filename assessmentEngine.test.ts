import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentEngine, C_CPP_CHALLENGES } from './assessmentEngine';

test('AssessmentEngine evaluates valid C++ code with 100% and low cheat suspicion', () => {
  const challenge = C_CPP_CHALLENGES.find((c) => c.id === 'cpp-smart-vector')!;
  const result = AssessmentEngine.evaluateCode(challenge.starterCode, challenge, {
    timeSpentSeconds: 300,
    tabSwitchCount: 0,
    copyPasteCount: 0,
  });

  assert.equal(result.syntaxValid, true);
  assert.equal(result.verdict, 'VERIFIED_ELIGIBLE');
  assert.equal(result.cheatSuspicion, 'LOW');
  assert.ok(result.score >= 80);
  assert.ok(result.personalizedFeedback.includes('VERIFIED_ELIGIBLE') || result.personalizedFeedback.includes('recommending') || result.personalizedFeedback.includes('proficiency'));
});

test('AssessmentEngine flags memory leak when new is used without delete', () => {
  const challenge = C_CPP_CHALLENGES.find((c) => c.id === 'cpp-smart-vector')!;
  const leakyCode = `
#include <iostream>
class CustomVector {
  int* data;
public:
  CustomVector() { data = new int[10]; }
  // Destructor missing!
};
int main() { return 0; }
  `;
  const result = AssessmentEngine.evaluateCode(leakyCode, challenge, {
    timeSpentSeconds: 120,
    tabSwitchCount: 0,
    copyPasteCount: 0,
  });

  assert.equal(result.detailedAudit.hasDestructorOrFree, false);
  assert.ok(result.memorySafetyNotes.some((n) => n.includes('Memory leak')));
});

test('AssessmentEngine flags high cheat suspicion for excessive tab switching', () => {
  const challenge = C_CPP_CHALLENGES.find((c) => c.id === 'c-pointer-string-reverse')!;
  const result = AssessmentEngine.evaluateCode(challenge.starterCode, challenge, {
    timeSpentSeconds: 10,
    tabSwitchCount: 5,
    copyPasteCount: 3,
  });

  assert.equal(result.cheatSuspicion, 'HIGH');
  assert.notEqual(result.verdict, 'VERIFIED_ELIGIBLE');
});
