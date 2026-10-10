#ifndef PROJECTMODULE_H
#define PROJECTMODULE_H

#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Project
{
private:
    int projectId;
    string title;
    string description;
    vector<string> requiredSkills;
    int teamSize;
    string deadline;

public:
    Project();

    void inputProject();
    void displayProject() const;

    int getProjectId() const;
    string getTitle() const;
    string getDescription() const;
    vector<string> getRequiredSkills() const;
    int getTeamSize() const;
    string getDeadline() const;
};

class ProjectModule
{
private:
    vector<Project> projects;

public:
    void addProject();
    void displayAllProjects() const;
    Project* findProjectById(int id);

    vector<Project> getProjects() const;
};

#endif