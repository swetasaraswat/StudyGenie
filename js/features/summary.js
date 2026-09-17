async function summarizeText() {
  const text = getInputText();
  if (!text) return;

  setButtonsDisabled(true);
  showLoading(true);
  hideResults();
  document.getElementById('resultSection').style.display = 'block';

  const prompt = `Analyze this text and provide:
1. A concise summary (2-3 sentences)
2. 5-7 key topics/points

Text: ${text}

Format as JSON:
{
  "summary": "summary here",
  "topics": ["topic1", "topic2", ...]
}`;

  const content = await callAIApi(prompt);
  showLoading(false);
  setButtonsDisabled(false);
  if (!content) return;

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    displayResults(result);
    saveToHistory('summary', text, result);
  } catch (error) {
    alert('Error parsing API response: ' + error.message);
    document.getElementById('summary').textContent = 'Could not parse summary. Raw response: ' + content;
    document.getElementById('topics').innerHTML = '';
  }
}

function displayResults(result) {
  document.getElementById('summary').textContent = result.summary;

  const topicsList = document.getElementById('topics');
  topicsList.innerHTML = '';
  if (Array.isArray(result.topics)) {
    result.topics.forEach((topic) => {
      const li = document.createElement('li');
      li.textContent = topic;
      topicsList.appendChild(li);
    });
  }

  document.getElementById('resultSection').style.display = 'block';
  document.getElementById('quizSection').style.display = 'none';
  document.getElementById('diagramSection').style.display = 'none';
}
