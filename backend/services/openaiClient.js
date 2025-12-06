const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function classifyDomain(text) {
  const prompt = `Classify the following resume text into one of: IT, Medical, Non-tech. Return only the single label.\n\nText:\n${text.slice(0, 3000)}`;
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0
  });
  const label = (resp.choices?.[0]?.message?.content || '').trim();
  return label;
}

async function extractSkills(text) {
  const prompt = `Extract a JSON array of technical and soft skills found in this resume. Respond with JSON only.\n\nResume:\n${text.slice(0, 3000)}`;
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2
  });
  const content = resp.choices?.[0]?.message?.content || '[]';
  try {
    const json = JSON.parse(content);
    return json;
  } catch (e) {
    // fallback: split lines
    return content.split(/[\r\n,]+/).map(s => s.trim()).filter(Boolean);
  }
}

async function generateFeedback(text, skills, domain) {
  const prompt = `Given the resume text below, the domain: ${domain}, and the extracted skills: ${JSON.stringify(skills)}, produce a JSON object with keys: strengths (array), weaknesses (array), improvements (array of suggestions). Keep answers concise.\n\nResume:\n${text.slice(0, 4000)}`;
  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });
  const content = resp.choices?.[0]?.message?.content || '{}';
  try {
    return JSON.parse(content);
  } catch (e) {
    return { strengths: [], weaknesses: [], improvements: [content] };
  }
}

module.exports = { classifyDomain, extractSkills, generateFeedback };


