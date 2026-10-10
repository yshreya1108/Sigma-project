#ifndef MATCHINGMODULE_H
#define MATCHINGMODULE_H

#include <iostream>
#include <vector>
#include <queue>
#include <string>

#include "StudentModule.h"
#include "ProjectModule.h"
#include "GraphModule.h"

using namespace std;

struct Match
{
    int studentId;
    string studentName;
    double score;
};

struct CompareMatch
{
    bool operator()(const Match& a, const Match& b)
    {
        return a.score < b.score;
    }
};

class MatchingModule
{
private:

    int compareSkill(string studentSkill,
                     string requiredSkill,
                     const GraphModule& graph) const;

    double calculateScore(const Student& student,
                          const Project& project,
                          const GraphModule& graph) const;

public:

    void findMatches(const StudentModule& students,
                     const Project& project,
                     const GraphModule& graph) const;

    vector<Match> getMatches(const StudentModule& students,
                             const Project& project,
                             const GraphModule& graph) const;

    void displayMatch(const Match& match) const;
};

#endif
