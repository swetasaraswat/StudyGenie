function getInputText() {
  const text = document.getElementById('inputText').value.trim();
  if (!text) {
    alert('Please enter some text or upload a PDF first!');
    return null;
  }
  return text;
}

function setButtonsDisabled(disabled) {
  document.getElementById('summaryBtn').disabled = disabled;
  document.getElementById('quizBtn').disabled = disabled;
  document.getElementById('diagramBtn').disabled = disabled;
}

function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function hideResults() {
  document.getElementById('resultSection').style.display = 'none';
  document.getElementById('quizSection').style.display = 'none';
  document.getElementById('diagramSection').style.display = 'none';
}
