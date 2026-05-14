// Derive achievement state from stored attempts/bookmarks/notes. Pure functions.

import { attemptsFor, getBookmarks, getNotes } from "./storage.js";

export const ACHIEVEMENTS = [
  { id: "first-quiz",    icon: "🚀", title: "First steps",     hint: "Complete your first quiz" },
  { id: "perfect",       icon: "💯", title: "Perfectionist",   hint: "Score 100% on any quiz" },
  { id: "five-quizzes",  icon: "🔥", title: "On a roll",       hint: "Complete 5 quizzes" },
  { id: "high-flyer",    icon: "🏆", title: "High flyer",      hint: "Average ≥ 80% across attempts" },
  { id: "explorer",      icon: "🧭", title: "Topic explorer",  hint: "Attempt quizzes on 3+ topics" },
  { id: "bookworm",      icon: "📚", title: "Bookworm",        hint: "Bookmark 3+ reading modules" },
  { id: "scholar",       icon: "✍️", title: "Scholar",         hint: "Write notes on 3+ topics" },
  { id: "ar-pioneer",    icon: "🦷", title: "AR pioneer",      hint: "Open the AR viewer" }
];

export const computeAchievements = (email) => {
  const attempts = attemptsFor(email);
  const bookmarks = getBookmarks(email);
  const notes = getNotes(email);
  const noteCount = Object.values(notes).filter(v => (v || "").trim().length > 10).length;
  const topics = new Set(attempts.map(a => a.quizId));
  const avg = attempts.length ? attempts.reduce((s, a) => s + a.percent, 0) / attempts.length : 0;
  const visitedAR = !!localStorage.getItem("oralpath:v1:visited_ar");

  return {
    "first-quiz":   attempts.length >= 1,
    "perfect":      attempts.some(a => a.percent === 100),
    "five-quizzes": attempts.length >= 5,
    "high-flyer":   attempts.length >= 3 && avg >= 80,
    "explorer":     topics.size >= 3,
    "bookworm":     bookmarks.length >= 3,
    "scholar":      noteCount >= 3,
    "ar-pioneer":   visitedAR
  };
};

export const markARVisited = () => {
  try { localStorage.setItem("oralpath:v1:visited_ar", "1"); } catch {}
};

export const computeStreak = (email) => {
  const attempts = attemptsFor(email);
  if (!attempts.length) return 0;
  const dayKey = (d) => new Date(d).toISOString().slice(0, 10);
  const days = new Set(attempts.map(a => dayKey(a.when)));
  let streak = 0;
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  for (;;) {
    const k = cur.toISOString().slice(0, 10);
    if (days.has(k)) { streak++; cur.setDate(cur.getDate() - 1); }
    else break;
  }
  return streak;
};

export const attemptsByDay = (email, span = 84) => {
  const attempts = attemptsFor(email);
  const map = {};
  for (const a of attempts) {
    const k = new Date(a.when).toISOString().slice(0, 10);
    map[k] = (map[k] || 0) + 1;
  }
  return map;
};
