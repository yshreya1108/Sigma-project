#ifndef STUDENTMODULE_H
#define STUDENTMODULE_H

#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Student
{
private:
    int id;
    string name;
    string email;
    vector<string> skills;
    vector<string> interests;
    string availability;

public:
    Student();

    Student(int id, string name, string email,
            vector<string> skills,
            vector<string> interests,
            string availability);

    void inputStudent();
    void displayStudent() const;

    int getId() const;
    string getName() const;
    string getEmail() const;
    vector<string> getSkills() const;
    vector<string> getInterests() const;
    string getAvailability() const;

    void setSkills(vector<string> newSkills);
};

class StudentModule
{
private:
    vector<Student> students;

public:
    void addStudent();
    void displayAllStudents() const;
    Student* findStudentById(int id);

    vector<Student> getStudents() const;
};

#endif
