const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

let currentQuestion = "";
const questionsFile = './questions.json';

// Load questions from a JSON file
const loadQuestions = () => {
  const data = fs.readFileSync(questionsFile, 'utf-8');
  return JSON.parse(data).questions;
};

// Pick a random question
const getRandomQuestion = () => {
  const questions = loadQuestions();
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

// Update the question every 24 hours
const updateQuestionDaily = () => {
  currentQuestion = getRandomQuestion();
  setInterval(() => {
    currentQuestion = getRandomQuestion();
  }, 30000); // 24 hours in milliseconds
};

// Set initial random question
updateQuestionDaily();

// Serve the current question at /question endpoint
app.get('/question', (req, res) => {
  res.json({ question: currentQuestion });
});

// Serve a basic HTML page displaying the question
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Today's Question:</h1>
        <p>${currentQuestion}</p>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
