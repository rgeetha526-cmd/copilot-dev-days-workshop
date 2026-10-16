// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
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
} = require("../src/quiz.js");

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("createQuiz creates a fresh initial state", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, { questions, current: 0, score: 0, answered: false });
  assert.notEqual(state, questions);
});

test("createQuiz creates an unfinished state for empty questions", () => {
  assert.deepEqual(createQuiz([]), { questions: [], current: 0, score: 0, answered: false });
});

test("createQuiz rejects null questions", () => {
  assert.throws(() => createQuiz(null), TypeError);
});

test("answerQuestion returns a new state and increments a correct answer", () => {
  const state = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(state, 1);

  assert.equal(result.correct, true);
  assert.deepEqual(result.state, { questions: state.questions, current: 0, score: 1, answered: true });
  assert.deepEqual(state, { questions: [{ answer: 1 }], current: 0, score: 0, answered: false });
  assert.notEqual(result.state, state);
});

test("answerQuestion marks a wrong answer without incrementing the score", () => {
  const result = answerQuestion(createQuiz([{ answer: 1 }]), 0);

  assert.equal(result.correct, false);
  assert.equal(result.state.score, 0);
  assert.equal(result.state.answered, true);
});

test("answerQuestion leaves an already answered state unchanged", () => {
  const state = { ...createQuiz([{ answer: 1 }]), score: 1, answered: true };
  const result = answerQuestion(state, 1);

  assert.equal(result.correct, false);
  assert.equal(result.state, state);
});

test("answerQuestion rejects a null state", () => {
  assert.throws(() => answerQuestion(null, 0), TypeError);
});

test("advanceQuestion updates only the current question", () => {
  const state = { ...createQuiz([{ answer: 0 }, { answer: 1 }]), score: 1, answered: true };
  const nextState = advanceQuestion(state);

  assert.deepEqual(nextState, { ...state, current: 1, answered: false });
  assert.deepEqual(state, { ...createQuiz(state.questions), score: 1, answered: true });
  assert.notEqual(nextState, state);
});

test("isQuizFinished returns false before the final question", () => {
  assert.equal(isQuizFinished(createQuiz([{ answer: 0 }])), false);
});

test("isQuizFinished returns true at the end of the quiz", () => {
  const state = advanceQuestion(createQuiz([{ answer: 0 }]));
  assert.equal(isQuizFinished(state), true);
});

test("isQuizFinished returns true for an empty quiz", () => {
  assert.equal(isQuizFinished(createQuiz([])), true);
});

test("isQuizFinished rejects a null state", () => {
  assert.throws(() => isQuizFinished(null), TypeError);
});

test("formatTimeLeft formats remaining seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft formats the zero-second boundary", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("isNewBestScore returns true when there is no saved best", () => {
  assert.equal(isNewBestScore(0, null), true);
});

test("isNewBestScore returns true when current score exceeds the best", () => {
  assert.equal(isNewBestScore(81, 80), true);
});

test("isNewBestScore returns false when current score ties the best", () => {
  assert.equal(isNewBestScore(80, 80), false);
});

test("isNewBestScore returns false when current score is below the best", () => {
  assert.equal(isNewBestScore(79, 80), false);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns the A message for an A grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work! You're a quiz master!");
});

test("getFeedbackMessage returns the B message for a B grade", () => {
  assert.equal(getFeedbackMessage("B"), "Good job! Keep up the great work!");
});

test("getFeedbackMessage returns the C message for a C grade", () => {
  assert.equal(getFeedbackMessage("C"), "Not bad! Keep practicing and you'll get there!");
});

test("getFeedbackMessage returns the default message for another grade", () => {
  assert.equal(getFeedbackMessage("Keep practicing"), "Keep practicing and you'll improve!");
});
