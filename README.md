# Sigma-Project

# SkillMatch – Student Skill Exchange & Project Team Matcher

## About the Project
SkillMatch is a C++-based application that helps students form suitable project teams based on their technical skills and project requirements. It calculates compatibility scores, ranks matching students, and suggests teams.

## Objectives
- Student registration and profile management
- Project creation and skill requirement entry
- Exact and related skill matching
- Compatibility score calculation
- Ranking of matching students
- Team formation and suggestions
- File-based data storage

## Features
- **Student Module:** Manages student details, skills, interests, and availability.
- **Project Module:** Stores project details, required skills, team size, and deadline.
- **Matching Module:** Calculates compatibility scores and ranks students.
- **Graph Module:** Represents relationships between related skills.
- **Team Module:** Suggests team members based on matching results.
- **Data Storage Module:** Saves student and project information in text files.

## Technologies Used
- C++
- Object-Oriented Programming (OOP)
- Data Structures
- STL (Standard Template Library)
- File Handling
- Code::Blocks IDE

## Data Structures Used
| Data Structure | Purpose |
|---|---|
| Vector | Stores students, projects, and skills |
| Map | Stores skill relationships |
| Graph | Represents relationships between skills |
| Priority Queue | Ranks matching students |
| Sorting | Organizes matching results, where implemented |

## Matching Methodology
- Exact skill match: 100 points
- Related skill match: 75 points
- No skill match: 0 points

The compatibility score is calculated from the skill-matching results according to the implemented scoring logic.

## Project Structure
```text
SkillMatch/
├── main.cpp
├── StudentModule.h
├── StudentModule.cpp
├── ProjectModule.h
├── ProjectModule.cpp
├── MatchingModule.h
├── MatchingModule.cpp
├── TeamModule.h
├── TeamModule.cpp
├── GraphModule.h
├── GraphModule.cpp
├── DataStorage.h
├── DataStorage.cpp
└── README.md
```

## How to Run
1. Clone or download the repository.
2. Open the `.cbp` project file in Code::Blocks.
3. Ensure all source and header files are included.
4. Build and run the project.
5. Follow the console menu.

Alternatively, compile using a compatible C++ compiler:

```bash
g++ main.cpp StudentModule.cpp ProjectModule.cpp MatchingModule.cpp TeamModule.cpp GraphModule.cpp DataStorage.cpp -o SkillMatch
```

## Team Members
**Team Name:** Code Crew  
**Team ID:** DSCPP-III-T383

- **Shreya Yadav:** Graph Module, Team Module, and Main Program Integration
- **Shishir Dwivedi:** Student Module
- **Shiwansh Mishra:** Matching Module
- **Simran Kundiyal:** Project Module and Data Storage Module

## Future Enhancements
- Develop a user-friendly website.
- Improve skill matching and compatibility scoring.
- Enhance team formation using complementary skills.
- Improve data storage and validation.
- Complete further integration and testing.

## Academic Context
Developed as part of the Project-Based Learning (PBL) coursework for Data Structures and Object-Oriented Programming using C++.
