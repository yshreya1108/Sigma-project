#include "StudentModule.h"
#include <limits>
using namespace std;
Student::Student()
{
    id = 0;
    name = "";
    email = "";
    availability = "";
}

Student::Student(int id, string name, string email,
                 vector<string> skills,
                 vector<string> interests,
                 string availability)
{
    this->id = id;
    this->name = name;
    this->email = email;
    this->skills = skills;
    this->interests = interests;
    this->availability = availability;
}


void Student::inputStudent()
{
    cout << "\nEnter Student ID: ";
    cin >> id;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    cout << "Enter Name: ";
    getline(cin, name);

    cout << "Enter Email: ";
    getline(cin, email);

    int n;

    cout << "Enter number of skills: ";
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    skills.clear();

    for(int i = 0; i < n; i++)
    {
        string skill;

        cout << "Enter skill " << i + 1 << ": ";
        getline(cin, skill);

        skills.push_back(skill);
    }

    cout << "Enter number of interests: ";
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    interests.clear();

    for(int i = 0; i < n; i++)
    {
        string interest;

        cout << "Enter interest " << i + 1 << ": ";
        getline(cin, interest);

        interests.push_back(interest);
    }

    cout << "Enter availability: ";
    getline(cin, availability);
}


void Student::displayStudent() const
{
    cout << "\n-----------------------------";
    cout << "\nStudent ID: " << id;
    cout << "\nName: " << name;
    cout << "\nEmail: " << email;

    cout << "\nSkills: ";

    for(size_t i = 0; i < skills.size(); i++)
    {
        cout << skills[i];

        if(i != skills.size() - 1)
            cout << ", ";
    }

    cout << "\nInterests: ";

    for(size_t i = 0; i < interests.size(); i++)
    {
        cout << interests[i];

        if(i != interests.size() - 1)
            cout << ", ";
    }

    cout << "\nAvailability: " << availability;
    cout << "\n-----------------------------\n";
}

int Student::getId() const
{
    return id;
}

string Student::getName() const
{
    return name;
}

string Student::getEmail() const
{
    return email;
}

vector<string> Student::getSkills() const
{
    return skills;
}

vector<string> Student::getInterests() const
{
    return interests;
}

string Student::getAvailability() const
{
    return availability;
}

void Student::setSkills(vector<string> newSkills)
{
    skills = newSkills;
}


// StudentModule

void StudentModule::addStudent()
{
    Student s;

    s.inputStudent();

    students.push_back(s);

    cout << "\nStudent added successfully!\n";
}

void StudentModule::displayAllStudents() const
{
    if(students.empty())
    {
        cout << "\nNo students registered.\n";
        return;
    }

    for(size_t i = 0; i < students.size(); i++)
    {
        students[i].displayStudent();
    }
}

Student* StudentModule::findStudentById(int id)
{
    for(size_t i = 0; i < students.size(); i++)
    {
        if(students[i].getId() == id)
        {
            return &students[i];
        }
    }

    return NULL;
}

vector<Student> StudentModule::getStudents() const
{
    return students;
}
