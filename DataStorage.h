#ifndef DATASTORAGE_H
#define DATASTORAGE_H

#include <iostream>
#include <fstream>
#include <string>

#include "StudentModule.h"
#include "ProjectModule.h"

using namespace std;

class DataStorage
{
public:

    void saveStudents(
        const StudentModule& students,
        string filename
    );

    void saveProjects(
        const ProjectModule& projects,
        string filename
    );
};

#endif