// Thin localStorage wrapper with namespacing so different installs of the app
// (e.g. running side-by-side on the same origin) don't collide.

const NS = "oralpath:v1:";

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(NS + key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(NS + key); } catch {}
  }
};

// ---- Auth ----
export const getUser = () => storage.get("user");
export const setUser = (u) => storage.set("user", u);
export const clearUser = () => storage.remove("user");

// ---- Quiz attempts ----
// Stored as an array of attempts: { id, userEmail, userName, role, quizId, title, score, total, percent, when, answers }
export const getAttempts = () => storage.get("attempts", []);
export const saveAttempt = (attempt) => {
  const list = getAttempts();
  list.unshift({ ...attempt, id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` });
  storage.set("attempts", list);
};
export const attemptsFor = (email) => getAttempts().filter(a => a.userEmail === email);

// ---- Uploaded materials (faculty) ----
// Stored as: { id, title, by, when, summary, generatedQuiz }
export const getMaterials = () => storage.get("materials", []);
export const saveMaterial = (m) => {
  const list = getMaterials();
  list.unshift({ ...m, id: `mat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` });
  storage.set("materials", list);
};
export const removeMaterial = (id) => storage.set("materials", getMaterials().filter(m => m.id !== id));

// ---- Bookmarks / notes ----
export const getNotes = (email) => storage.get(`notes:${email}`, {});
export const setNoteFor = (email, topicId, text) => {
  const all = getNotes(email);
  all[topicId] = text;
  storage.set(`notes:${email}`, all);
};
export const getBookmarks = (email) => storage.get(`bookmarks:${email}`, []);
export const toggleBookmark = (email, topicId) => {
  const list = getBookmarks(email);
  const idx = list.indexOf(topicId);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(topicId);
  storage.set(`bookmarks:${email}`, list);
  return list;
};

// ---- Faculty blog posts ----
// { id, title, body, tags[], coverDataUrl, pdfDataUrl, pdfName, by, byEmail, when, views }
export const getBlogPosts = () => storage.get("blog_posts", []);
export const saveBlogPost = (p) => {
  const list = getBlogPosts();
  const id = p.id || `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const next = { ...p, id, when: p.when || new Date().toISOString(), views: p.views || 0 };
  const existing = list.findIndex(x => x.id === id);
  if (existing >= 0) list[existing] = next;
  else list.unshift(next);
  storage.set("blog_posts", list);
  return next;
};
export const removeBlogPost = (id) =>
  storage.set("blog_posts", getBlogPosts().filter(p => p.id !== id));
export const incrementBlogView = (id) => {
  const list = getBlogPosts();
  const p = list.find(x => x.id === id);
  if (p) { p.views = (p.views || 0) + 1; storage.set("blog_posts", list); }
};
export const getBlogPost = (id) => getBlogPosts().find(p => p.id === id);
