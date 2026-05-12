# OralPath Learn — Interactive Educational Application in Odontogenic Oral Pathology

> Computer Vision · BSCS 8 · Bahria University, Lahore Campus · Assignment 3

A cross-platform Progressive Web App (PWA) that bridges the gap between
textbook theory and clinical practice for dental students. Features include:

- **Curated reading modules** on the most common odontogenic cysts and tumors
- **3D / Augmented Reality viewer** (`<model-viewer>` + ARCore on Android)
- **Topic and randomised sample quizzes** with instant feedback and explanations
- **Clinical prompting drills** (type-then-reveal cases with overlap scoring)
- **Faculty PDF upload → automatic quiz generation** (in-browser via `pdf.js`)
- **Class performance reports** (per quiz, per student)
- **Built-in chatbot** that searches the local knowledge base
- **Installable PWA** with offline caching via a service worker
- **Persistent local storage** for users, notes, bookmarks, and attempts

---

## Quick start

```bash
cd OralPathApp
npm install            # one time
npm run build          # bundles src/ -> dist/bundle.js
npm start              # serves at http://localhost:5173
```

Open `http://localhost:5173` in any modern browser. On Android Chrome, tap
"Install" in the address bar to add it to the home screen.

### Development with auto-rebuild

```bash
npm run dev            # esbuild --serve on :5173 with rebuild on save
```

---

## Project structure

```
OralPathApp/
├── index.html              # entry HTML (loads dist/bundle.js, model-viewer CDN, sw.js)
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # service worker (cache-first)
├── assets/
│   └── icon.svg            # app icon (any .glb dental models also drop here)
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # top-level router/auth
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Chatbot.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── StudentHome.jsx
│   │   ├── FacultyHome.jsx
│   │   ├── Reading.jsx
│   │   ├── ARView.jsx
│   │   ├── Quiz.jsx
│   │   ├── Results.jsx
│   │   ├── Prompting.jsx
│   │   ├── FacultyUpload.jsx
│   │   ├── FacultyReports.jsx
│   │   └── UserGuide.jsx
│   ├── data/
│   │   ├── topics.js       # curated reading content
│   │   ├── quizzes.js      # quiz bank (topic + sample)
│   │   └── models.js       # 3D model entries (replace with .glb dental scans)
│   ├── utils/
│   │   ├── router.js       # hash-based router (~30 lines)
│   │   ├── storage.js      # localStorage wrapper
│   │   ├── pdf.js          # in-browser PDF text extraction (pdf.js via ESM CDN)
│   │   └── quizGen.js      # heuristic cloze-MCQ generator
│   └── styles/app.css      # full theme (dark, glassy)
├── screenshots/            # auto-captured screens for the report
├── dist/bundle.js          # production bundle (committed)
└── screenshot.mjs          # headless capture script (puppeteer-core)
```

---

## Roles and demo credentials

The demo build has no server — any non-empty email + password is accepted, and
the role chip (Student / Faculty) determines which dashboard is shown.

Recommended demo accounts:

| Role    | Email             | Password (any) |
| ------- | ----------------- | -------------- |
| Student | ali@uni.edu       | demo123        |
| Faculty | sana@uni.edu      | demo123        |

---

## Replacing the 3D models with real dental scans

1. Find a free `.glb` dental model on Sketchfab (filter: *Downloadable*) or
   on the [NIH 3D Print Exchange](https://3d.nih.gov/).
2. Save it as `assets/tooth.glb` (or any name).
3. Edit `src/data/models.js` and change the `url` field to `./assets/tooth.glb`.
4. Run `npm run build` and refresh.

The `<model-viewer>` element supports automatic AR launch on Android (ARCore)
and iOS (USDZ via Quick Look — convert `.glb → .usdz` if you want iOS AR).

---

## OpenAI integration (gpt-4o-mini)

The chatbot and the faculty PDF→quiz generator both have an optional OpenAI
backend (`gpt-4o-mini`). When configured:

- **Chatbot** — answers free-form questions in 2–3 paragraphs.
- **PDF → Quiz** — produces higher-quality MCQs from uploaded chapters.

When **not** configured, both features fall back to offline rule-based
heuristics so the demo continues to work without an account.

### How the key is handled

1. The key is **never** put in source files, `.env`, or the bundle.
2. The user enters it on the in-app **Settings** page (top-right ⚙️).
3. It is stored in the user's own browser `localStorage` under
   `oralpath:v1:openai_key`.
4. Calls go directly from the browser to `https://api.openai.com`.
5. **Remove key** clears it from this device.

### Why not a `.env` file?

A static frontend (no server) cannot keep a secret. A `.env` baked into the
bundle is **visible to anyone** who opens DevTools on the deployed site, so a
`.env` would be *less* safe than the Settings page. The correct production
pattern is a server-side proxy (Cloudflare Worker / Vercel function) that
holds the key and forwards calls — see `report/Report.docx` §III for the
upgrade path.

The repo's `.gitignore` already blocks `.env`, `*.key`, and `secrets/` as
defence-in-depth.

### Trying it

1. Sign in (any role).
2. Click the ⚙️ icon in the header → paste an OpenAI key → **Save key** →
   **Test connection**.
3. Open the chatbot or the faculty Upload page; the badge will say
   `gpt-4o-mini` instead of `local fallback`.

---

## Deploying to GitHub Pages (free, takes ~3 minutes)

1. Create a new repo on GitHub (e.g. `oralpath-learn`).
2. From this folder:
   ```bash
   git init && git add . && git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-user>/oralpath-learn.git
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages**, set **Source: Deploy from a branch**,
   pick `main` and `/ (root)`, save.
4. Within ~1 minute your live URL appears:
   `https://<your-user>.github.io/oralpath-learn/`
5. Paste that URL into the appendix of the research report.

> The app is fully static — no backend, no build step on the server.
> GitHub Pages will serve `index.html` and the prebuilt `dist/bundle.js`.

---

## Updating the bundle after edits

```bash
npm run build
```

Commit the updated `dist/bundle.js` and push. Pages will redeploy automatically.

---

## Tested against

- Chromium 119+ (Linux, macOS, Windows)
- Chrome on Android 9+ (ARCore device for AR projection)
- Firefox 121+, Safari 17+ (3D works; AR limited)

---

## Submission rubric mapping

| Rubric line                                          | Where it lives                                          |
| ---------------------------------------------------- | ------------------------------------------------------- |
| Sample architecture + UI prototype (10)              | `report/Report.docx` §Dev Method + this README          |
| Deployable cross-platform app w/ chatbot + AR (10)   | This entire `OralPathApp/` folder                       |
| Research report w/ IEEE citations (5)                | `report/Report.docx`                                    |
| AR / prompt-eng / Google AI Studio exploration (5)   | `report/Report.docx` §Related Work + §Dev Method        |
| Class presentation (5)                               | Author's responsibility                                 |

---

## License

Educational use, Bahria University assignment submission. Knowledge base
content is summarised from standard textbooks (Shafer's, Neville) for
teaching purposes only.
