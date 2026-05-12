// Heuristic quiz generator that builds plausible MCQs from arbitrary text.
//
// The faculty PDF-upload flow extracts text (utils/pdf.js) and feeds it here.
// We pick fact-like sentences and turn them into cloze-style multiple-choice
// questions. Distractors are sampled from other content words in the document.

const STOPWORDS = new Set((
  "the of and to a in is are was were be by for on with as it that this these those an or " +
  "from at into about across between among through during after before within without among" +
  " not no nor but if then than which who whom whose what when where why how does do did " +
  "such most more less few many some any all both each every other another"
).split(/\s+/));

const sentencesOf = (text) =>
  text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z(])/)
    .map(s => s.trim())
    .filter(s => s.length >= 40 && s.length <= 240 && /\b[a-z]{4,}\b/i.test(s));

const candidateWords = (sentence) => {
  return [...new Set(
    sentence
      .replace(/[^A-Za-z\- ]/g, " ")
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length >= 5)
      .filter(w => !STOPWORDS.has(w.toLowerCase()))
  )];
};

const pickAnswer = (words) => {
  // Prefer the longest non-stopword (likely a domain noun).
  const sorted = [...words].sort((a, b) => b.length - a.length);
  return sorted[0] || null;
};

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const generateQuizFromText = (text, { maxQuestions = 8 } = {}) => {
  if (!text || text.trim().length < 80) return [];
  const sentences = sentencesOf(text);
  if (!sentences.length) return [];

  // Build a global pool of long words to serve as distractors.
  const pool = [...new Set(
    text.replace(/[^A-Za-z\- ]/g, " ").split(/\s+/)
      .filter(w => w.length >= 6 && !STOPWORDS.has(w.toLowerCase()))
  )];

  const out = [];
  for (const s of sentences) {
    if (out.length >= maxQuestions) break;
    const words = candidateWords(s);
    const ans = pickAnswer(words);
    if (!ans) continue;
    const blank = s.replace(new RegExp(`\\b${ans}\\b`), "_____");
    if (!blank.includes("_____")) continue;

    // Distractors: random words from the document not equal to the answer.
    const distractors = shuffle(pool.filter(w => w.toLowerCase() !== ans.toLowerCase())).slice(0, 6);
    const choices = shuffle([ans, ...distractors.slice(0, 3)]);
    if (choices.length < 4) continue;

    out.push({
      q: `Fill in the blank: ${blank}`,
      opts: choices,
      a: choices.indexOf(ans),
      explain: `Source sentence: "${s}"`,
      qid: `gen_${out.length}`
    });
  }
  return out;
};
