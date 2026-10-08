#ifndef GRAPHMODULE_H
#define GRAPHMODULE_H

#include <iostream>
#include <vector>
#include <map>
#include <string>

using namespace std;

class GraphModule
{
private:
    map<string, vector<string> > skillGraph;

public:
    void addSkillRelationship(string skill1, string skill2);

    bool areRelated(string skill1, string skill2) const;

    void displayGraph() const;

    vector<string> getRelatedSkills(string skill) const;
};

#endif
