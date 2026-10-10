#include "MatchingModule.h"

int MatchingModule::compareSkill(string studentSkill,
                                 string requiredSkill,
                                 const GraphModule& graph) const
{
    // Exact match
    if(studentSkill == requiredSkill)
    {
        return 100;
    }

    // Related match
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

        /*
           Supports OR requirements.

           Example:
           "C|Python"

           means C OR Python.
        */

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
                int score = compareSkill(
                    studentSkills[k],
                    options[j],
                    graph
                );

                if(score > bestScore)
                    bestScore = score;
            }
        }

        totalScore += bestScore;
    }

    return totalScore / requiredSkills.size();
}


vector<Match> MatchingModule::getMatches(
    const StudentModule& students,
    const Project& project,
    const GraphModule& graph) const
{
    vector<Match> result;

    vector<Student> studentList = students.getStudents();

    for(size_t i = 0; i < studentList.size(); i++)
    {
        double score = calculateScore(
            studentList[i],
            project,
            graph
        );

        if(score > 0)
        {
            Match m;

            m.studentId = studentList[i].getId();
            m.studentName = studentList[i].getName();
            m.score = score;

            result.push_back(m);
        }
    }

    return result;
}


void MatchingModule::findMatches(
    const StudentModule& students,
    const Project& project,
    const GraphModule& graph) const
{
    vector<Match> matches =
        getMatches(students, project, graph);

    if(matches.empty())
    {
        cout << "\nNo matching students found.\n";
        return;
    }

    priority_queue<
        Match,
        vector<Match>,
        CompareMatch
    > pq;

    for(size_t i = 0; i < matches.size(); i++)
    {
        pq.push(matches[i]);
    }

    cout << "\n========================================";
    cout << "\n       RANKED STUDENT MATCHES";
    cout << "\n========================================\n";

    int rank = 1;

    while(!pq.empty())
    {
        Match m = pq.top();
        pq.pop();

        cout << "\nRank " << rank;
        displayMatch(m);

        rank++;
    }
}


void MatchingModule::displayMatch(const Match& match) const
{
    cout << "\nStudent ID   : " << match.studentId;
    cout << "\nStudent Name : " << match.studentName;
    cout << "\nMatch Score  : " << match.score << "%\n";
}
