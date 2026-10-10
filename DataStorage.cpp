#include "DataStorage.h"

void DataStorage::saveStudents(
    const StudentModule& students,
    string filename)
{
    ofstream file(filename.c_str());

    if(!file)
    {
        cout << "\nError opening student file.\n";
        return;
    }

    vector<Student> list =
        students.getStudents();

    for(size_t i = 0; i < list.size(); i++)
    {
        file << "ID: "
             << list[i].getId()
             << "\n";

        file << "Name: "
             << list[i].getName()
             << "\n";

        file << "Email: "
             << list[i].getEmail()
             << "\n";

        file << "Skills: ";

        vector<string> skills =
            list[i].getSkills();

        for(size_t j = 0; j < skills.size(); j++)
        {
            file << skills[j];

            if(j != skills.size() - 1)
                file << ",";
        }

        file << "\n";

        file << "Interests: ";

        vector<string> interests =
            list[i].getInterests();

        for(size_t j = 0; j < interests.size(); j++)
        {
            file << interests[j];

            if(j != interests.size() - 1)
                file << ",";
        }

        file << "\n";

        file << "Availability: "
             << list[i].getAvailability()
             << "\n";

        file << "----------------------\n";
    }

    file.close();

    cout << "\nStudents saved successfully.\n";
}


void DataStorage::saveProjects(
    const ProjectModule& projects,
    string filename)
{
    ofstream file(filename.c_str());

    if(!file)
    {
        cout << "\nError opening project file.\n";
        return;
    }

    vector<Project> list =
        projects.getProjects();

    for(size_t i = 0; i < list.size(); i++)
    {
        file << "Project ID: "
             << list[i].getProjectId()
             << "\n";

        file << "Title: "
             << list[i].getTitle()
             << "\n";

        file << "Description: "
             << list[i].getDescription()
             << "\n";

        file << "Required Skills: ";

        vector<string> skills =
            list[i].getRequiredSkills();

        for(size_t j = 0; j < skills.size(); j++)
        {
            file << skills[j];

            if(j != skills.size() - 1)
                file << ",";
        }

        file << "\n";

        file << "Team Size: "
             << list[i].getTeamSize()
             << "\n";

        file << "Deadline: "
             << list[i].getDeadline()
             << "\n";

        file << "----------------------\n";
    }

    file.close();

    cout << "\nProjects saved successfully.\n";
}