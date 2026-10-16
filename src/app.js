// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME_SECONDS = 15;
const BEST_SCORE_STORAGE_KEY = "dev-days-quiz-best-score";
let state = createQuiz([]);
let timeLeft = QUESTION_TIME_SECONDS;
let timerInterval = null;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const answerFeedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const startBestScoreText = document.getElementById("start-best-score");
const resultBestScoreText = document.getElementById("result-best-score");
const resultNewBestText = document.getElementById("result-new-best");
const startStorageNotice = document.getElementById("start-storage-notice");
const resultStorageNotice = document.getElementById("result-storage-notice");

let bestScore = null;
let storageAvailable = true;

function readBestScore() {
  try {
    const savedScore = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    if (savedScore === null || !/^(100|[1-9]?\d)$/.test(savedScore)) {
      return null;
    }
    return Number(savedScore);
  } catch {
    storageAvailable = false;
    return null;
  }
}

function saveBestScore(score) {
  try {
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
    return true;
  } catch {
    storageAvailable = false;
    return false;
  }
}

function renderBestScore(element) {
  element.hidden = bestScore === null || !storageAvailable;
  element.textContent = element.hidden ? "" : `Best score: ${bestScore}%`;
}

function renderStorageNotice(element) {
  element.hidden = storageAvailable;
  element.textContent = storageAvailable
    ? ""
    : "Your score could not be saved. Best-score tracking is unavailable.";
}

function renderStartBestScore() {
  renderBestScore(startBestScoreText);
  renderStorageNotice(startStorageNotice);
}

bestScore = readBestScore();
renderStartBestScore();

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  stopTimer();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  answerFeedback.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startTimer();
}

function updateTimerDisplay() {
  timerText.textContent = formatTimeLeft(timeLeft);
  timerText.classList.toggle("timer-low", timeLeft <= 5);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  timeLeft = QUESTION_TIME_SECONDS;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft === 0) {
      handleTimeUp();
    }
  }, 1000);
}

function selectAnswer(selectedIndex, selectedButton) {
  if (state.answered) return;
  stopTimer();

  const question = state.questions[state.current];
  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  if (result.correct) {
    selectedButton.classList.add("correct");
    answerFeedback.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    answerFeedback.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function handleTimeUp() {
  if (state.answered) return;
  stopTimer();

  const question = state.questions[state.current];
  state = answerQuestion(state, -1).state;
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  buttons[question.answer].classList.add("correct");
  answerFeedback.textContent = "Time's up!";
  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  stopTimer();
  state = advanceQuestion(state);
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  document.getElementById("feedback-message").textContent = getFeedbackMessage(getGrade(percentage));
  resultNewBestText.hidden = true;
  resultStorageNotice.hidden = true;

  const hadBestScore = bestScore !== null;
  if (storageAvailable && isNewBestScore(percentage, bestScore)) {
    if (saveBestScore(percentage)) {
      bestScore = percentage;
      resultNewBestText.hidden = !hadBestScore;
    } else {
      bestScore = null;
    }
  }

  renderBestScore(resultBestScoreText);
  renderStorageNotice(resultStorageNotice);
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
