require('dotenv').config();
const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'ANJANA AI', provider: 'openai' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) return res.status(400).json({ error: 'Message is required.' });
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'OpenAI is not configured on the server.' });
    }
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: 'You are ANJANA AI, a helpful bilingual Sinhala and English personal assistant. Reply in the language the user uses.' },
        { role: 'user', content: message }
      ]
    });
    res.json({ reply: completion.choices?.[0]?.message?.content || 'No response received.' });
  } catch (err) {
    console.error('Chat API error:', err?.status || '', err?.message || err);
    res.status(500).json({ error: 'AI request failed. Check Render logs and provider configuration.' });
  }
});

// Provider-specific LiveAvatar session creation must be completed using the
// current API schema from the user's LiveAvatar account. Keep secrets server-side.
app.post('/api/avatar/session', (_req, res) => {
  if (!process.env.LIVEAVATAR_API_KEY || !process.env.LIVEAVATAR_AVATAR_ID) {
    return res.status(503).json({ error: 'LiveAvatar credentials/avatar ID are not configured.' });
  }
  return res.status(501).json({
    error: 'LiveAvatar session adapter is not yet configured.',
    hint: 'Add the official session-create endpoint and response handling for your LiveAvatar API version in server.js.'
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`ANJANA AI server listening on ${port}`));
