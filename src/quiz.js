// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Creates the initial state for a quiz.
 */
function createQuiz(questions) {
  if (!Array.isArray(questions)) {
    throw new TypeError("questions must be an array");
  }

  return { questions, current: 0, score: 0, answered: false };
}

/**
 * Returns the updated state after answering the current question.
 */
function answerQuestion(state, selectedIndex) {
  if (!state || !Array.isArray(state.questions)) {
    throw new TypeError("state must be a quiz state");
  }
  if (state.answered) {
    return { state, correct: false };
  }

  const correct = isCorrect(state.questions[state.current], selectedIndex);
  return {
    state: {
      ...state,
      score: state.score + (correct ? 1 : 0),
      answered: true,
    },
    correct,
  };
}

/**
 * Advances to the next question without changing the existing state.
 */
function advanceQuestion(state) {
  if (!state || !Array.isArray(state.questions)) {
    throw new TypeError("state must be a quiz state");
  }

  return { ...state, current: state.current + 1, answered: false };
}

/**
 * Returns true when there are no more questions to display.
 */
function isQuizFinished(state) {
  if (!state || !Array.isArray(state.questions)) {
    throw new TypeError("state must be a quiz state");
  }

  return state.current >= state.questions.length;
}

/**
 * Formats the remaining quiz time for display.
 */
function formatTimeLeft(seconds) {
  return `⏱ ${seconds}s`;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Returns true when current is a new best percentage.
 */
function isNewBestScore(current, best) {
  return best === null || current > best;
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

// Returns an encouraging message for a grade: "A", "B", "C" or anything else
function getFeedbackMessage(grade) {
  switch (grade) {
    case "A":
      return "Excellent work! You're a quiz master!";
    case "B":
      return "Good job! Keep up the great work!";
    case "C":
      return "Not bad! Keep practicing and you'll get there!";
    default:
      return "Keep practicing and you'll improve!";
  }
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shuffle,
    isCorrect,
    createQuiz,
    answerQuestion,
    advanceQuestion,
    isQuizFinished,
    formatTimeLeft,
    calculatePercentage,
    isNewBestScore,
    getGrade,
    getFeedbackMessage,
  };
}
