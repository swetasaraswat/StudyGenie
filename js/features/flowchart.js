async function generateFlowchart() {
  const text = getInputText();
  if (!text) return;

  setButtonsDisabled(true);
  showLoading(true);
  hideResults();
  document.getElementById('diagramSection').style.display = 'block';

  const prompt = `Create a simple Mermaid flowchart for this text. Focus on main sequence of steps.

Text: ${text}

Rules:
1. Start with "flowchart TD"
2. Use simple node IDs: A, B, C
3. Keep labels short (3-5 words max)
4. Use: A[Rectangle], B(Rounded), C{Diamond}
5. Connect with: A --> B
6. Respond with ONLY raw mermaid code, no JSON, no code blocks`;

  let code = await callAIApi(prompt);
  showLoading(false);
  setButtonsDisabled(false);
  if (!code) return;

  code = code.replace(/```mermaid/g, '').replace(/```/g, '').trim();

  await displayFlowchart(code);
  saveToHistory('flowchart', text, { code });
}

async function displayFlowchart(code) {
  const container = document.getElementById('diagramContainer');

  try {
    if (typeof mermaid === 'undefined') {
      throw new Error('Mermaid.js library not loaded.');
    }

    container.innerHTML = '';
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.textContent = code;
    container.appendChild(mermaidDiv);

    await mermaid.run({ querySelector: '.mermaid' });
  } catch (error) {
    console.error('Mermaid error:', error);
    container.innerHTML = `
      <div style="padding: 30px; text-align: center;">
        <div style="color: #f44336; font-size: 18px; margin-bottom: 10px;">⚠️ Rendering Failed</div>
        <div style="color: #666;">Raw code: <pre>${code}</pre></div>
      </div>
    `;
  }
}
