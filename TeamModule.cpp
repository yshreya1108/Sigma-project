#include "TeamModule.h"

void TeamModule::formTeam(
    const StudentModule& students,
    const Project& project,
    const GraphModule& graph) const
{
    MatchingModule matcher;

    vector<Match> matches =
        matcher.getMatches(
            students,
            project,
            graph
        );

    if(matches.empty())
    {
        cout << "\nUnable to form team.";
        cout << "\nNo matching students available.\n";
        return;
    }

    vector<Student> allStudents =
        students.getStudents();

    vector<Student> team;

    int requiredSize =
        project.getTeamSize();

    /*
       Select students based on highest
       matching score.
    */

    for(size_t i = 0; i < matches.size(); i++)
    {
        if((int)team.size() >= requiredSize)
            break;

        for(size_t j = 0; j < allStudents.size(); j++)
        {
            if(allStudents[j].getId() ==
               matches[i].studentId)
            {
                team.push_back(allStudents[j]);
                break;
            }
        }
    }

    displayTeam(team, project);
}


void TeamModule::displayTeam(
    const vector<Student>& team,
    const Project& project) const
{
    cout << "\n======================================";
    cout << "\n          SUGGESTED TEAM";
    cout << "\n======================================";

    cout << "\nProject: "
         << project.getTitle();

    cout << "\nRequired Team Size: "
         << project.getTeamSize();

    cout << "\nSelected Members: "
         << team.size();

    for(size_t i = 0; i < team.size(); i++)
    {
        cout << "\n\nMember " << i + 1;

        cout << "\nID: "
             << team[i].getId();

        cout << "\nName: "
             << team[i].getName();

        cout << "\nSkills: ";

        vector<string> skills =
            team[i].getSkills();

        for(size_t j = 0; j < skills.size(); j++)
        {
            cout << skills[j];

            if(j != skills.size() - 1)
                cout << ", ";
        }
    }

    cout << "\n\n======================================\n";
}
