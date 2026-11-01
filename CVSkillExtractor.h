#ifndef CVSKILLEXTRACTOR_H
#define CVSKILLEXTRACTOR_H

#include <string>
#include <vector>

struct CVSkills {
    std::vector<std::string> programmingLanguages;
    std::vector<std::string> otherSkills;
};

class CVSkillExtractor {
public:
    CVSkills extractSkills(const std::string& cvText);
    std::string readCVFromFile(const std::string& filePath);
};

#endif
