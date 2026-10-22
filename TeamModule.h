#ifndef TEAMMODULE_H
#define TEAMMODULE_H

#include <iostream>
#include <vector>
#include <string>

#include "StudentModule.h"
#include "ProjectModule.h"
#include "MatchingModule.h"
#include "GraphModule.h"

using namespace std;

class TeamModule
{
public:

    void formTeam(const StudentModule& students,
                  const Project& project,
                  const GraphModule& graph) const;

    void displayTeam(const vector<Student>& team,
                     const Project& project) const;
};

#endif
