#include <iostream>

#include "StudentModule.h"
#include "ProjectModule.h"
#include "MatchingModule.h"
#include "GraphModule.h"
#include "TeamModule.h"
#include "DataStorage.h"

using namespace std;

int main()
{
    StudentModule studentModule;
    ProjectModule projectModule;
    GraphModule graphModule;
    MatchingModule matchingModule;
    TeamModule teamModule;
    DataStorage storage;

    /*
       Some initial skill relationships.

       These are examples only.
       New relationships can be added later.
    */

    graphModule.addSkillRelationship(
        "C", "C++"
    );

    graphModule.addSkillRelationship(
        "Python", "Django"
    );

    graphModule.addSkillRelationship(
        "Python", "Flask"
    );

    graphModule.addSkillRelationship(
        "JavaScript", "React"
    );

    graphModule.addSkillRelationship(
        "JavaScript", "Node.js"
    );

    graphModule.addSkillRelationship(
        "HTML", "HTML5"
    );

    graphModule.addSkillRelationship(
        "CSS", "Tailwind CSS"
    );

    graphModule.addSkillRelationship(
        "CSS", "Bootstrap"
    );

    graphModule.addSkillRelationship(
        "SQL", "MySQL"
    );

    graphModule.addSkillRelationship(
        "SQL", "PostgreSQL"
    );

    int choice;

    do
    {
        cout << "\n\n========================================";
        cout << "\n             SKILLMATCH";
        cout << "\n========================================";

        cout << "\n1. Register Student";
        cout << "\n2. Display Students";

        cout << "\n3. Create Project";
        cout << "\n4. Display Projects";

        cout << "\n5. Display Skill Relationships";

        cout << "\n6. Find Student Matches";

        cout << "\n7. Form Suggested Team";

        cout << "\n8. Save Data";

        cout << "\n0. Exit";

        cout << "\n\nEnter your choice: ";
        cin >> choice;

        switch(choice)
        {
            case 1:
                studentModule.addStudent();
                break;

            case 2:
                studentModule.displayAllStudents();
                break;

            case 3:
                projectModule.addProject();
                break;

            case 4:
                projectModule.displayAllProjects();
                break;

            case 5:
                graphModule.displayGraph();
                break;

            case 6:
            {
                int projectId;

                cout << "\nEnter Project ID: ";
                cin >> projectId;

                Project* project =
                    projectModule.findProjectById(
                        projectId
                    );

                if(project == NULL)
                {
                    cout << "\nProject not found.\n";
                }
                else
                {
                    matchingModule.findMatches(
                        studentModule,
                        *project,
                        graphModule
                    );
                }

                break;
            }

            case 7:
            {
                int projectId;

                cout << "\nEnter Project ID: ";
                cin >> projectId;

                Project* project =
                    projectModule.findProjectById(
                        projectId
                    );

                if(project == NULL)
                {
                    cout << "\nProject not found.\n";
                }
                else
                {
                    teamModule.formTeam(
                        studentModule,
                        *project,
                        graphModule
                    );
                }

                break;
            }

            case 8:

                storage.saveStudents(
                    studentModule,
                    "students.txt"
                );

                storage.saveProjects(
                    projectModule,
                    "projects.txt"
                );

                break;

            case 0:
                cout << "\nThank you for using SkillMatch!\n";
                break;

            default:
                cout << "\nInvalid choice.\n";
        }

    } while(choice != 0);

    return 0;
}
