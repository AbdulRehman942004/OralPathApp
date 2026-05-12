// Browser-side OpenAI client.
//
// The API key is read from localStorage at call time so we never bake a key
// into the bundle or the source tree. Users add their key on the Settings
// page; clearing it from there disables all OpenAI calls and the app falls
// back to its built-in heuristics.
//
// Security notes:
//  * The key lives in browser storage and is visible to any script running
//    on this origin. This is acceptable for a single-user demo PWA but is
//    NOT production-grade — a real deployment must put the key behind a
//    server-side proxy.
//  * We never log the key. Errors carry status + sanitized server message
//    only.

import { storage } from "./storage.js";

const KEY = "openai_key";
const MODEL = "gpt-4o-mini";
const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const getApiKey = () => storage.get(KEY, "");
export const setApiKey = (k) => storage.set(KEY, (k || "").trim());
export const clearApiKey = () => storage.remove(KEY);
export const hasApiKey = () => Boolean(getApiKey());

const sanitize = (msg) => (msg || "").replace(/sk-[A-Za-z0-9_-]+/g, "sk-***");

class OpenAIError extends Error {
  constructor(message, { status, type } = {}) {
    super(sanitize(message));
    this.name = "OpenAIError";
    this.status = status;
    this.type = type;
  }
}

const callChat = async ({
  system,
  user,
  responseFormat,           // optional { type: "json_object" }
  temperature = 0.3,
  maxTokens = 800,
  signal
}) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new OpenAIError("No API key configured.", { type: "no_key" });

  const body = {
    model: MODEL,
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user",   content: user }
    ]
  };
  if (responseFormat) body.response_format = responseFormat;

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    if (e?.name === "AbortError") throw new OpenAIError("Request cancelled.", { type: "abort" });
    throw new OpenAIError("Network error contacting OpenAI.", { type: "network" });
  }

  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json())?.error?.message || ""; } catch {}
    throw new OpenAIError(detail || `OpenAI returned HTTP ${res.status}`, {
      status: res.status,
      type: res.status === 401 ? "auth" : res.status === 429 ? "rate_limit" : "http"
    });
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new OpenAIError("OpenAI returned an empty response.", { type: "empty" });
  return content;
};

// ---------- High-level helpers ----------

const CHAT_SYSTEM = `You are OralPath Assistant, a concise dental-education tutor specialised in
odontogenic oral pathology. Answer in 2–3 short paragraphs using plain language.
Prefer bullet points for lists of features (radiology, histology, treatment).
If the question is outside oral pathology or dental education, briefly redirect.
Never invent dosages, surgical margins, or guidelines you are not confident about — say
"consult a current clinical reference" instead.`;

export const askChat = async (question, { signal } = {}) => {
  return await callChat({
    system: CHAT_SYSTEM,
    user: question,
    temperature: 0.3,
    maxTokens: 500,
    signal
  });
};

const QUIZ_SYSTEM = `You generate multiple-choice questions for dental students from a passage of text.
Output STRICT JSON with the shape:
{
  "questions": [
    { "q": "...", "opts": ["A", "B", "C", "D"], "a": 0, "explain": "..." }
  ]
}
Rules:
- Exactly 4 options per question.
- "a" is the 0-based index of the correct option.
- Questions must test understanding, not trivia.
- Plausible distractors drawn from the same domain (other lesions, structures, treatments).
- Explanations should be 1–2 sentences citing the relevant fact from the passage.
- Do not include any text outside the JSON object.`;

export const generateQuizWithOpenAI = async (text, { count = 8, signal } = {}) => {
  const trimmed = (text || "").slice(0, 12000); // keep tokens bounded
  if (trimmed.length < 80) return [];

  const user = `Generate ${count} multiple-choice questions from the passage below.

PASSAGE:
"""
${trimmed}
"""`;

  const raw = await callChat({
    system: QUIZ_SYSTEM,
    user,
    responseFormat: { type: "json_object" },
    temperature: 0.4,
    maxTokens: 1800,
    signal
  });

  let parsed;
  try { parsed = JSON.parse(raw); }
  catch { throw new OpenAIError("Model returned non-JSON content.", { type: "parse" }); }

  const arr = Array.isArray(parsed?.questions) ? parsed.questions : [];
  return arr
    .filter(q => q && typeof q.q === "string"
              && Array.isArray(q.opts) && q.opts.length === 4
              && Number.isInteger(q.a) && q.a >= 0 && q.a < 4)
    .map((q, i) => ({
      q: q.q,
      opts: q.opts.map(String),
      a: q.a,
      explain: typeof q.explain === "string" ? q.explain : "",
      qid: `ai_${i}`
    }));
};

export { OpenAIError };
