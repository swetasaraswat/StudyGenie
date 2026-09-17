async function generateQuiz() {
  const text = getInputText();
  if (!text) return;

  setButtonsDisabled(true);
  showLoading(true);
  hideResults();

  const prompt = `Generate 5 multiple choice questions based on this text. Each question has 4 options with one correct answer. The correct property must be the zero-based index (0-3) of the correct answer.

Text: ${text}

Format as JSON:
{
  "questions": [
    {
      "question": "question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}`;

  const content = await callAIApi(prompt);
  showLoading(false);
  setButtonsDisabled(false);
  if (!content) return;

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);

    if (result.questions && Array.isArray(result.questions)) {
      displayQuiz(result.questions);
      saveToHistory('quiz', text, result);
    } else {
      alert('Error: Quiz format incorrect or API returned non-JSON.');
    }
  } catch (error) {
    alert('Error parsing quiz response: ' + error.message);
  }
}

function displayQuiz(questions) {
  quizData = questions;
  userAnswers = {};

  const container = document.getElementById('quizContainer');
  container.innerHTML = '';

  questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'question-card';

    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = `${index + 1}. ${q.question}`;
    card.appendChild(questionText);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    q.options.forEach((option, optIndex) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option';
      optionDiv.textContent = option;
      optionDiv.onclick = () => selectOption(index, optIndex, optionDiv);
      optionsDiv.appendChild(optionDiv);
    });

    card.appendChild(optionsDiv);
    container.appendChild(card);
  });

  document.getElementById('quizSection').style.display = 'block';
  document.getElementById('submitBtn').style.display = 'block';
  document.getElementById('score').textContent = '';
  document.getElementById('resultSection').style.display = 'none';
  document.getElementById('diagramSection').style.display = 'none';
}

function selectOption(questionIndex, optionIndex, element) {
  const options = element.parentElement.children;
  for (const opt of options) {
    opt.classList.remove('selected', 'correct', 'wrong');
  }
  element.classList.add('selected');
  userAnswers[questionIndex] = optionIndex;
}

function submitQuiz() {
  let correct = 0;
  const questions = document.querySelectorAll('#quizSection .question-card');

  questions.forEach((card, index) => {
    const options = card.querySelectorAll('.option');
    const userAnswer = userAnswers[index];
    const correctAnswer = quizData[index].correct;

    options.forEach((opt, optIndex) => {
      opt.classList.remove('correct', 'wrong');
      if (optIndex === correctAnswer) opt.classList.add('correct');
      if (userAnswer === optIndex && optIndex !== correctAnswer) opt.classList.add('wrong');
      opt.onclick = null;
    });

    if (userAnswer === correctAnswer) correct++;
  });

  const score = document.getElementById('score');
  score.textContent = `Your Score: ${correct}/${quizData.length} (${Math.round((correct / quizData.length) * 100)}%)`;
  document.getElementById('submitBtn').style.display = 'none';
}
