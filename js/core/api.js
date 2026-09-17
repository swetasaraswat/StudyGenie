async function callAIApi(prompt) {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      alert(`AI request failed: ${errorData.error || response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (!data.content) {
      throw new Error('Empty response from AI service');
    }
    return data.content;
  } catch (error) {
    console.error('AI API error:', error);
    alert('Could not reach the AI service. Please try again in a moment.');
    return null;
  }
}
