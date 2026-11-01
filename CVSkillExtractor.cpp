#include "CVSkillExtractor.h"
#include <fstream>
#include <algorithm>
#include <cctype>

// Convert text into lowercase
static std::string toLowerCase(std::string text) {
    std::transform(text.begin(), text.end(), text.begin(),
        [](unsigned char ch) {
            return static_cast<char>(std::tolower(ch));
        });

    return text;
}

// Check if a keyword exists as a separate word or phrase
static bool containsKeyword(const std::string& text,
                            const std::string& keyword) {
    size_t position = 0;

    while ((position = text.find(keyword, position))
           != std::string::npos) {

        size_t endPosition = position + keyword.length();

        bool leftBoundary =
            position == 0 ||
            !std::isalnum(static_cast<unsigned char>(
                text[position - 1]));

        bool rightBoundary =
            endPosition == text.length() ||
            !std::isalnum(static_cast<unsigned char>(
                text[endPosition]));

        if (leftBoundary && rightBoundary) {
            return true;
        }

        position++;
    }

    return false;
}

// Read text from a CV file
std::string CVSkillExtractor::readCVFromFile(
    const std::string& filePath) {

    std::ifstream file(filePath);

    if (!file.is_open()) {
        return "";
    }

    std::string cvText;
    std::string line;

    while (std::getline(file, line)) {
        cvText += line + "\n";
    }

    return cvText;
}

// Extract programming languages and other skills
CVSkills CVSkillExtractor::extractSkills(
    const std::string& cvText) {

    CVSkills skills;
    std::string text = toLowerCase(cvText);

    // Programming languages
    if (containsKeyword(text, "python"))
        skills.programmingLanguages.push_back("Python");

    if (containsKeyword(text, "c++") ||
        containsKeyword(text, "cpp"))
        skills.programmingLanguages.push_back("C++");

    if (containsKeyword(text, "java"))
        skills.programmingLanguages.push_back("Java");

    if (containsKeyword(text, "c language") ||
        containsKeyword(text, "c programming") ||
        containsKeyword(text, "programming in c"))
        skills.programmingLanguages.push_back("C");

    // Other skills
    if (containsKeyword(text, "ui/ux") ||
        containsKeyword(text, "ui ux") ||
        containsKeyword(text, "ux design") ||
        containsKeyword(text, "ui design"))
        skills.otherSkills.push_back("UI/UX Design");

    if (containsKeyword(text, "graphic design") ||
        containsKeyword(text, "graphic designer"))
        skills.otherSkills.push_back("Graphic Design");

    if (containsKeyword(text, "web design") ||
        containsKeyword(text, "web designer"))
        skills.otherSkills.push_back("Web Design");

    if (containsKeyword(text, "video editing") ||
        containsKeyword(text, "video editor"))
        skills.otherSkills.push_back("Video Editing");

    if (containsKeyword(text, "powerpoint") ||
        containsKeyword(text, "ppt"))
        skills.otherSkills.push_back("PowerPoint");

    return skills;
}
