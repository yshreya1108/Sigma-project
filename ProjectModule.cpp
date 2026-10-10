#include "ProjectModule.h"

Project::Project()
{
    projectId = 0;
    title = "";
    description = "";
    teamSize = 0;
    deadline = "";
}

void Project::inputProject()
{
    cout << "\nEnter Project ID: ";
    cin >> projectId;
    cin.ignore();

    cout << "Enter Project Title: ";
    getline(cin, title);

    cout << "Enter Project Description: ";
    getline(cin, description);

    int n;

    cout << "Enter number of required skills: ";
    cin >> n;
    cin.ignore();

    requiredSkills.clear();

    for(int i = 0; i < n; i++)
    {
        string skill;

        cout << "Enter required skill " << i + 1 << ": ";
        getline(cin, skill);

        requiredSkills.push_back(skill);
    }

    cout << "Enter required team size: ";
    cin >> teamSize;
    cin.ignore();

    cout << "Enter project deadline: ";
    getline(cin, deadline);
}

void Project::displayProject() const
{
    cout << "\n=============================";
    cout << "\nProject ID: " << projectId;
    cout << "\nTitle: " << title;
    cout << "\nDescription: " << description;

    cout << "\nRequired Skills: ";

    for(size_t i = 0; i < requiredSkills.size(); i++)
    {
        cout << requiredSkills[i];

        if(i != requiredSkills.size() - 1)
            cout << ", ";
    }

    cout << "\nTeam Size: " << teamSize;
    cout << "\nDeadline: " << deadline;
    cout << "\n=============================\n";
}

int Project::getProjectId() const
{
    return projectId;
}

string Project::getTitle() const
{
    return title;
}

string Project::getDescription() const
{
    return description;
}

vector<string> Project::getRequiredSkills() const
{
    return requiredSkills;
}

int Project::getTeamSize() const
{
    return teamSize;
}

string Project::getDeadline() const
{
    return deadline;
}


// ProjectModule

void ProjectModule::addProject()
{
    Project p;

    p.inputProject();

    projects.push_back(p);

    cout << "\nProject created successfully!\n";
}

void ProjectModule::displayAllProjects() const
{
    if(projects.empty())
    {
        cout << "\nNo projects available.\n";
        return;
    }

    for(size_t i = 0; i < projects.size(); i++)
    {
        projects[i].displayProject();
    }
}

Project* ProjectModule::findProjectById(int id)
{
    for(size_t i = 0; i < projects.size(); i++)
    {
        if(projects[i].getProjectId() == id)
        {
            return &projects[i];
        }
    }

    return NULL;
}

vector<Project> ProjectModule::getProjects() const
{
    return projects;
}