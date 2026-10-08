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
    map<string, vector<string> >::const_iterator it;

    it = skillGraph.find(skill);

    if(it != skillGraph.end())
        return it->second;

    return vector<string>();
}

void GraphModule::displayGraph() const
{
    if(skillGraph.empty())
    {
        cout << "\nNo skill relationships available.\n";
        return;
    }

    cout << "\n========== SKILL RELATIONSHIP GRAPH ==========\n";

    map<string, vector<string> >::const_iterator it;

    for(it = skillGraph.begin(); it != skillGraph.end(); ++it)
    {
        cout << it->first << " -> ";

        for(size_t i = 0; i < it->second.size(); i++)
        {
            cout << it->second[i];

            if(i != it->second.size() - 1)
                cout << ", ";
        }

        cout << endl;
    }

    cout << "==============================================\n";
}
