#ifndef SKILLTEST_H
#define SKILLTEST_H

#include <string>

class SkillTest {
public:
    // Reads a plain-text CV, detects programming languages, and starts
    // one separate test for each detected language.
    void runFromCVFile(const std::string& cvFilePath,
                       const std::string& questionBankDirectory = ".");
};

#endif
