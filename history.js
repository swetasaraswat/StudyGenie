function saveToHistory(type, text, result) {
  const historyItem = {
    id: Date.now(),
    type,
    text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
    fullText: text,
    result,
    date: new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }),
  };

  historyData.unshift(historyItem);
  if (historyData.length > 10) {
    historyData = historyData.slice(0, 10);
  }

  try {
    localStorage.setItem('studyGenieHistory', JSON.stringify(historyData));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }

  displayHistory();
}

function loadHistory() {
  try {
    const saved = localStorage.getItem('studyGenieHistory');
    if (saved) {
      historyData = JSON.parse(saved);
      displayHistory();
    }
  } catch (e) {
    console.warn('Could not load history:', e);
  }
}

function displayHistory() {
  const container = document.getElementById('historyContainer');

  if (historyData.length === 0) {
    container.innerHTML = '<p class="history-empty">No history yet. Start your learning journey!</p>';
    return;
  }

  const typeEmoji = { summary: '📝', quiz: '🎯', flowchart: '🎨' };

  container.innerHTML = '';
  historyData.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'history-item';
    el.onclick = () => loadFromHistory(item);
    el.innerHTML = `
      <div class="history-item-title">${typeEmoji[item.type] || '📄'} ${item.type.toUpperCase()}</div>
      <div class="history-item-preview">${item.text}</div>
      <div class="history-item-date">${item.date}</div>
    `;
    container.appendChild(el);
  });
}

function loadFromHistory(item) {
  document.getElementById('inputText').value = item.fullText;
  hideResults();
  showTab('tab-tools', document.getElementById('btn-tools'));

  if (item.type === 'summary') {
    displayResults(item.result);
    document.getElementById('resultSection').style.display = 'block';
  } else if (item.type === 'quiz') {
    displayQuiz(item.result.questions);
  } else if (item.type === 'flowchart') {
    document.getElementById('diagramSection').style.display = 'block';
    displayFlowchart(item.result.code);
  }

  window.scrollTo({ top: document.getElementById('loading').offsetTop, behavior: 'smooth' });
}

function clearHistory() {
  if (confirm('Are you sure you want to clear all history?')) {
    historyData = [];
    localStorage.removeItem('studyGenieHistory');
    displayHistory();
  }
}
