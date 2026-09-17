exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let prompt;
  try {
    ({ prompt } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!prompt) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt' }) };
  }

  const keys = (process.env.GEMINI_API_KEYS || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  if (!keys.length) {
    return { statusCode: 500, body: JSON.stringify({ error: 'No API keys configured on the server' }) };
  }

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=';

  for (const key of keys) {
    try {
      const response = await fetch(endpoint + key, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
      });

      if (!response.ok) {
        if ([400, 403, 429].includes(response.status)) continue;
        const errorData = await response.json().catch(() => ({}));
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: errorData.error?.message || response.statusText }),
        };
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) continue;

      return { statusCode: 200, body: JSON.stringify({ content }) };
    } catch {
      continue;
    }
  }

  return { statusCode: 502, body: JSON.stringify({ error: 'All configured API keys failed' }) };
};
