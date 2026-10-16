// Quiz questions.
// "answer" is the index (starting at 0) of the correct option.
const QUESTIONS = [
  {
    question: "Which command creates a new Git branch and switches to it?",
    options: ["git branch -d", "git switch -c", "git merge", "git push -u"],
    answer: 1,
  },
  {
    question: "Which file does GitHub show as a repository's front page?",
    options: ["index.txt", "README.md", "HOME.md", "about.html"],
    answer: 1,
  },
  {
    question: "What does PR stand for on GitHub?",
    options: ["Pull request", "Push release", "Project review", "Public repository"],
    answer: 0,
  },
  {
    question: "In GitHub Copilot, which key accepts an inline suggestion?",
    options: ["Enter", "Esc", "Tab", "Shift"],
    answer: 2,
  },
  {
    question: "Which file gives Copilot custom instructions for a repository?",
    options: [".github/copilot-instructions.md", "copilot.json", ".vscode/ai.txt", "package.json"],
    answer: 0,
  },
  {
    question: "What does `git clone` do?",
    options: [
      "Deletes a repository",
      "Copies a remote repository to your computer",
      "Creates a new branch",
      "Merges two branches",
    ],
    answer: 1,
  },
  {
    question: "What is the primary purpose of a `.gitignore` file?",
    options: [
      "To ignore specific files when committing changes",
      "To ignore all files in the repository",
      "To ignore only untracked files", 
      "To ignore files in a specific branch"
    ],
    answer: 0,
  },
  {
    question: "Which command stages all changes in the current directory for the next commit?",
    options: ["git add .", "git commit -m", "git push", "git status"],
    answer: 0,
  },
  {
    question: "What is the purpose of a pull request on GitHub?",
    options: [
      "To request changes to be merged into a repository",
      "To pull the latest changes from a remote repository",
      "To create a new branch in a repository",
      "To delete a repository"
    ],
    answer: 0,
  }
];

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTIONS };
}
