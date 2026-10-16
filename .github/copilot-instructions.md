# Copilot instructions

## Project shape

This is a dependency-free quiz app built with browser-native HTML, CSS, and JavaScript; there is no transpilation or bundling step. `src/index.html` loads `questions.js`, `quiz.js`, then `app.js` as classic scripts, so their order and global bindings are part of the app's integration. `app.js` owns DOM updates and quiz flow; `quiz.js` contains DOM-free quiz logic and exports it for Node tests; `questions.js` provides the quiz data. The repository-root `index.html` redirects GitHub Pages visitors to `src/index.html`.

## Commands

- `npm test` runs both test files with Node's built-in test runner. No dependency installation is needed.
- Run one test by name, for example: `node --test --test-name-pattern="isCorrect returns true for the right answer" tests/quiz.test.js`. Use `tests/questions.test.js` to target question-data tests.
- `npm start` serves `src/` at `http://localhost:8080`.

## Code and test conventions

- Keep browser code compatible with the existing classic-script setup. Avoid introducing a module loader or build step unless the task calls for changing that setup.
- Keep quiz rules in `src/quiz.js` rather than mixing them into DOM event handlers. Keep the `module.exports` guards in `quiz.js` and `questions.js` so the same source works in browsers and Node tests.
- Each entry in `src/questions.js` has `question` text, exactly four `options`, and an `answer` index that is zero-based. `tests/questions.test.js` validates this shape and unique question text.
- Tests use `node:test` and `node:assert/strict`; test files are listed explicitly in the `test` script in `package.json`.
- One test currently fails on purpose: the exact-90% grade boundary in `tests/quiz.test.js` is the workshop's planted debugging exercise. Preserve it unless the task is to fix or work through that exercise. See `README.md` and the workshop guides for the guided workflow.
