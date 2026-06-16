// Sends note text to the Azure OpenAI deployment and returns a study guide
// shaped exactly like the React frontend expects: { summary, keywords, questions }.
//
// This uses the Azure "v1" API surface (endpoint ends in /openai/v1), so we use
// the plain OpenAI client with a baseURL — NOT AzureOpenAI with an api-version.
const OpenAI = require('openai');

const endpoint = process.env.AZURE_OPENAI_ENDPOINT; // e.g. https://<resource>.services.ai.azure.com/openai/v1
const apiKey = process.env.AZURE_OPENAI_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

let client;
function getClient() {
  if (!client) {
    if (!endpoint || !apiKey || !deployment) {
      throw new Error('Azure OpenAI settings not set. Check your .env file.');
    }
    // The Azure v1 surface still requires an api-version query param, but the
    // value is the literal "preview" (not a date). defaultQuery appends it to
    // every request the SDK makes.
    client = new OpenAI({
      baseURL: endpoint,
      apiKey,
      defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || 'preview' },
    });
  }
  return client;
}

const SYSTEM_PROMPT = `You are a study assistant. Given a student's notes, return a JSON object with exactly these fields:
- "summary": a concise paragraph (3-5 sentences) summarizing the notes.
- "keywords": an array of 5-8 key terms or concepts as short strings.
- "questions": an array of 4-6 practice questions that test understanding.
Return ONLY valid JSON. Do not wrap it in markdown.`;

async function generateStudyGuide(text) {
  const ai = getClient();

  const response = await ai.chat.completions.create({
    model: deployment, // the deployment name (e.g. gpt-4o-mini)
    response_format: { type: 'json_object' }, // force valid JSON back
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: text },
    ],
  });

  const parsed = JSON.parse(response.choices[0].message.content);

  // Normalize the shape so the frontend never crashes on a missing field.
  return {
    summary: parsed.summary || '',
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    questions: Array.isArray(parsed.questions) ? parsed.questions : [],
  };
}

module.exports = { generateStudyGuide };
