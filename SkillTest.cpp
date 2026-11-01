#include "SkillTest.h"
#include "CVSkillExtractor.h"

#include <algorithm>
#include <chrono>
#include <cctype>
#include <fstream>
#include <iostream>
#include <random>
#include <regex>
#include <string>
#include <vector>

namespace {

struct Question {
    std::string category;
    std::string text;
    std::string options[4];
    char correctAnswer = '\0';
    bool valid = false;
};

struct TestResult {
    int score = 0;
    int total = 0;
    bool passed = false;
};

std::string trim(const std::string& text) {
    const std::string whitespace = " \t\r\n";
    const std::size_t first = text.find_first_not_of(whitespace);
    if (first == std::string::npos) return "";
    const std::size_t last = text.find_last_not_of(whitespace);
    return text.substr(first, last - first + 1);
}

std::string joinPath(const std::string& directory,
                     const std::string& fileName) {
    if (directory.empty() || directory == ".") return fileName;

    const char last = directory[directory.size() - 1];
    if (last == '/' || last == '\\') return directory + fileName;
    return directory + "/" + fileName;
}

std::string bankFileForLanguage(const std::string& language) {
    if (language == "Python") return "PythonQuestions.txt";
    if (language == "C") return "CQuestions.txt";
    if (language == "C++") return "CppQuestions.txt";
    if (language == "Java") return "JavaQuestions.txt";
    return "";
}

bool categoryMatches(const std::string& category,
                     const std::string& wanted) {
    std::string lower = category;
    std::transform(lower.begin(), lower.end(), lower.begin(),
        [](unsigned char ch) { return static_cast<char>(std::tolower(ch)); });

    if (wanted == "normal")
        return lower.find("normal") != std::string::npos;
    if (wanted == "output")
        return lower.find("output") != std::string::npos;
    if (wanted == "fill")
        return lower.find("fill") != std::string::npos;
    return false;
}

std::vector<Question> readQuestionBank(const std::string& filePath) {
    std::ifstream file(filePath);
    if (!file.is_open()) {
        std::cerr << "Error: Could not open question bank: "
                  << filePath << "\n";
        return {};
    }

    const std::regex questionHeader(R"(^\s*Q\d+\s*\[(.*?)\]\s*$)");
    const std::regex optionLine(R"(^\s*([A-D])\.\s*(.*)$)");
    const std::regex answerLine(R"(^\s*Correct Answer:\s*([A-D])\s*$)",
                                std::regex_constants::icase);

    std::vector<Question> questions;
    Question current;
    bool insideQuestion = false;
    std::string line;

    auto saveCurrent = [&]() {
        if (!insideQuestion) return;

        int optionCount = 0;
        for (const std::string& option : current.options) {
            if (!option.empty()) ++optionCount;
        }

        current.text = trim(current.text);
        current.valid = !current.category.empty() &&
                        !current.text.empty() &&
                        optionCount == 4 &&
                        current.correctAnswer >= 'A' &&
                        current.correctAnswer <= 'D';

        if (current.valid) {
            questions.push_back(current);
        }
        current = Question{};
    };

    while (std::getline(file, line)) {
        std::smatch match;

        if (std::regex_match(line, match, questionHeader)) {
            saveCurrent();
            insideQuestion = true;
            current.category = match[1].str();
            continue;
        }

        if (!insideQuestion) continue;

        if (std::regex_match(line, match, optionLine)) {
            const int index = match[1].str()[0] - 'A';
            current.options[index] = trim(match[2].str());
            continue;
        }

        if (std::regex_match(line, match, answerLine)) {
            current.correctAnswer = match[1].str()[0];
            continue;
        }

        // Keep the question text/code, but do not expose the answer key.
        if (current.text.empty()) {
            current.text = line;
        } else {
            current.text += "\n" + line;
        }
    }

    saveCurrent();
    return questions;
}

std::vector<Question> chooseQuestions(const std::vector<Question>& bank,
                                     const std::string& category,
                                     int amount,
                                     std::mt19937& randomEngine) {
    std::vector<Question> matching;
    for (const Question& question : bank) {
        if (categoryMatches(question.category, category))
            matching.push_back(question);
    }

    std::shuffle(matching.begin(), matching.end(), randomEngine);

    if (static_cast<int>(matching.size()) < amount) {
        std::cerr << "Error: Not enough valid questions in the "
                  << category << " category. Needed " << amount
                  << ", found " << matching.size() << ".\n";
        return {};
    }

    matching.resize(amount);
    return matching;
}

int marksFor(const std::string& category) {
    if (categoryMatches(category, "normal")) return 1;
    if (categoryMatches(category, "output")) return 3;
    return 5;
}

TestResult runOneLanguageTest(const std::string& language,
                              const std::string& bankPath) {
    TestResult result;
    const std::vector<Question> bank = readQuestionBank(bankPath);

    if (bank.empty()) {
        std::cout << "Test skipped because the question bank is missing "
                     "or has no valid questions.\n";
        return result;
    }

    std::random_device device;
    std::mt19937 randomEngine(device());

    std::vector<Question> test;
    const auto normal = chooseQuestions(bank, "normal", 11, randomEngine);
    const auto output = chooseQuestions(bank, "output", 3, randomEngine);
    const auto fill = chooseQuestions(bank, "fill", 1, randomEngine);

    if (normal.size() != 11 || output.size() != 3 || fill.size() != 1) {
        std::cout << "Test skipped: question bank format/count is invalid.\n";
        return result;
    }

    test.insert(test.end(), normal.begin(), normal.end());
    test.insert(test.end(), output.begin(), output.end());
    test.insert(test.end(), fill.begin(), fill.end());
    std::shuffle(test.begin(), test.end(), randomEngine);

    result.total = 25;
    int answeredMarks = 0;
    const auto startTime = std::chrono::steady_clock::now();
    const auto timeLimit = std::chrono::minutes(20);

    std::cout << "\n====================================\n";
    std::cout << language << " Skill Test\n";
    std::cout << "15 MCQs | 25 marks | 20 minutes | Pass: 15/25\n";
    std::cout << "Enter A, B, C, or D. You may submit early by entering S.\n";
    std::cout << "====================================\n";

    for (std::size_t i = 0; i < test.size(); ++i) {
        const auto elapsed = std::chrono::steady_clock::now() - startTime;
        if (elapsed >= timeLimit) {
            std::cout << "\nTime limit reached. The test has ended.\n";
            break;
        }

        const Question& question = test[i];
        const int marks = marksFor(question.category);

        std::cout << "\nQ" << (i + 1) << " (" << marks << " mark(s))\n";
        std::cout << question.text << "\n";
        for (int option = 0; option < 4; ++option) {
            std::cout << static_cast<char>('A' + option) << ". "
                      << question.options[option] << "\n";
        }

        std::string input;
        std::cout << "Your answer: ";
        if (!(std::cin >> input)) {
            std::cout << "\nInput ended. Submitting current answers.\n";
            break;
        }

        // Standard console input cannot interrupt a user who is still
        // typing; the deadline is checked again after input is received.
        if (std::chrono::steady_clock::now() - startTime >= timeLimit) {
            std::cout << "Time expired while waiting for your answer. "
                         "That answer was not counted.\n";
            break;
        }

        if (!input.empty()) {
            char answer = static_cast<char>(
                std::toupper(static_cast<unsigned char>(input[0])));

            if (answer == 'S') {
                std::cout << "Test submitted early.\n";
                break;
            }

            if (answer >= 'A' && answer <= 'D') {
                if (answer == question.correctAnswer) {
                    answeredMarks += marks;
                    std::cout << "Answer recorded.\n";
                } else {
                    std::cout << "Answer recorded.\n";
                }
            } else {
                std::cout << "Invalid choice. This question gets 0 marks.\n";
            }
        }
    }

    result.score = answeredMarks;
    result.passed = result.score >= 15;

    std::cout << "\n---------- RESULT ----------\n";
    std::cout << "Language: " << language << "\n";
    std::cout << "Score: " << result.score << "/25\n";
    std::cout << "Status: " << (result.passed ? "PASS" : "NOT PASSED")
              << "\n";
    std::cout << "Passing score: 15/25 (60%)\n";
    std::cout << "Correct answers are not shown during the test.\n";
    std::cout << "----------------------------\n";

    return result;
}

} // namespace

void SkillTest::runFromCVFile(const std::string& cvFilePath,
                              const std::string& questionBankDirectory) {
    CVSkillExtractor extractor;

    const std::string cvText = extractor.readCVFromFile(cvFilePath);
    if (cvText.empty()) {
        std::cout << "Error: CV file could not be read or is empty: "
                  << cvFilePath << "\n";
        std::cout << "For now, provide the CV as a plain-text file (.txt).\n";
        return;
    }

    const CVSkills skills = extractor.extractSkills(cvText);

    if (skills.programmingLanguages.empty()) {
        if (!skills.otherSkills.empty()) {
            std::cout << "No programming language was detected in the CV.\n";
            std::cout << "Other detected skills:\n";
            for (const std::string& skill : skills.otherSkills)
                std::cout << "- " << skill << "\n";

            std::cout << "\nPlease provide portfolio evidence for manual "
                         "review (for example, project links, screenshots, "
                         "or image/file paths).\n";
        } else {
            std::cout << "No supported programming language or other skill "
                         "was detected in the CV.\n";
            std::cout << "Check the CV text and try again.\n";
        }
        return;
    }

    std::cout << "Programming languages detected in CV:\n";
    for (const std::string& language : skills.programmingLanguages)
        std::cout << "- " << language << "\n";

    std::cout << "\nEach detected language has its own separate test.\n";
    std::cout << "A passing result in one language does not affect another.\n";

    for (const std::string& language : skills.programmingLanguages) {
        const std::string bankFile = bankFileForLanguage(language);
        if (bankFile.empty()) continue;

        const std::string bankPath = joinPath(questionBankDirectory, bankFile);
        runOneLanguageTest(language, bankPath);
    }

    std::cout << "\nRole suggestions should be treated as recommendations only. "
                 "Final team selection should be made by a human reviewer.\n";
}
