import { useMemo, useState } from "react";
import { Donut } from "../components/Charts.jsx";

const PROMPTS = [
  {
    id: 1,
    case: "A 22-year-old male presents with painless swelling of the right posterior mandible. An OPG shows a well-defined unilocular radiolucency surrounding the crown of an impacted third molar, attached at the cement-enamel junction.",
    question: "What is the most likely diagnosis and what is the typical histologic finding?",
    model: "Dentigerous cyst. Histology shows a thin, non-keratinised stratified squamous epithelial lining 2–4 cells thick over a fibrous connective tissue wall.",
    tags: ["dentigerous", "cyst"]
  },
  {
    id: 2,
    case: "A 17-year-old female with multiple basal cell carcinomas presents with bilateral, multilocular radiolucencies in the posterior mandible and ramus. Biopsy shows a parakeratinised lining 6–8 cells thick with a palisaded basal layer.",
    question: "Name the lesion and the syndrome to investigate.",
    model: "Odontogenic keratocysts (OKC) in nevoid basal cell carcinoma syndrome (Gorlin syndrome).",
    tags: ["OKC", "Gorlin"]
  },
  {
    id: 3,
    case: "A 45-year-old male presents with expansion of the left posterior mandible. An OPG shows a multilocular 'soap-bubble' radiolucency with cortical expansion and root resorption.",
    question: "What is the most likely diagnosis and what surgical margin is recommended?",
    model: "Conventional (multicystic) ameloblastoma. Recommended margin: 1–1.5 cm of clear bone.",
    tags: ["ameloblastoma", "tumor"]
  },
  {
    id: 4,
    case: "An 11-year-old boy is referred after a routine periapical radiograph reveals a cluster of small tooth-like radiopacities in the anterior maxilla, blocking the eruption of a permanent canine.",
    question: "What lesion is most likely, and how is it classified pathologically?",
    model: "Compound odontoma — most authors classify it as a developmental hamartoma rather than a true neoplasm.",
    tags: ["odontoma", "hamartoma"]
  },
  {
    id: 5,
    case: "A 36-year-old female has a chronically discoloured upper central incisor. A periapical radiograph shows a well-circumscribed apical radiolucency with loss of lamina dura. The tooth fails to respond to pulp vitality testing.",
    question: "What is the most likely diagnosis and what is the conservative treatment?",
    model: "Radicular (periapical) cyst on a non-vital tooth. Treat by endodontic therapy; persistence after RCT warrants surgical curettage.",
    tags: ["radicular", "inflammatory"]
  }
];

const score = (user, model) => {
  if (!user) return 0;
  const u = user.toLowerCase();
  const tokens = [...new Set(model.toLowerCase().split(/[^a-z]+/).filter(w => w.length >= 5))];
  const hits = tokens.filter(t => u.includes(t)).length;
  return Math.min(100, Math.round((hits / Math.max(8, tokens.length)) * 100));
};

export default function Prompting() {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [shown, setShown] = useState(false);
  const p = PROMPTS[i];
  const matchPct = useMemo(() => (shown ? score(answer, p.model) : null), [shown, answer, p.model]);

  const reset = () => { setAnswer(""); setShown(false); };
  const goto = (idx) => { setI(idx); reset(); };

  return (
    <section className="container section fade-in">
      <div className="spread mb-16">
        <div>
          <span className="hero__chip"><span className="dot" />Prompt engineering · clinical reasoning</span>
          <h2 className="section__title mt-12">Prompting drills</h2>
          <p className="section__sub">
            Type your differential and rationale for each clinical vignette, then reveal the model answer.
            Overlap is scored heuristically against domain keywords.
          </p>
        </div>
      </div>

      <div className="row mb-16" style={{ flexWrap: "wrap", gap: 6 }}>
        {PROMPTS.map((pr, idx) => (
          <button key={idx} className={"btn btn--sm " + (idx === i ? "btn--primary" : "")} onClick={() => goto(idx)}>
            Case {idx + 1}
          </button>
        ))}
      </div>

      <div className="card mb-16" style={{ display: "block" }}>
        <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
          <span className="tag tag--violet">Clinical vignette · Case {p.id}</span>
          {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <p className="mt-12" style={{ fontSize: 16, lineHeight: 1.65 }}>{p.case}</p>
        <p style={{ fontWeight: 700, fontSize: 15 }}>
          <span style={{ color: "var(--brand)" }}>Q: </span>{p.question}
        </p>
      </div>

      <div className="field mb-16">
        <label>Your answer</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your differential and rationale… (focus on diagnosis name, key histology/radiology features and management)"
        />
      </div>

      <div className="row" style={{ gap: 10 }}>
        <button className="btn btn--primary" disabled={!answer.trim()} onClick={() => setShown(true)}>
          🔍 Reveal model answer
        </button>
        <button className="btn" onClick={reset}>Clear</button>
      </div>

      {shown && (
        <div className="card mt-16" style={{ display: "block" }}>
          <div className="spread">
            <div>
              <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                <span className="tag">Model answer</span>
                <span className={"tag " + (matchPct >= 60 ? "" : matchPct >= 30 ? "tag--warn" : "tag--danger")}>
                  Keyword overlap {matchPct}%
                </span>
              </div>
              <p className="mt-12" style={{ fontSize: 16, lineHeight: 1.6 }}>{p.model}</p>
              <p className="muted" style={{ fontSize: 13 }}>
                Overlap is a simple keyword match meant to encourage including the key clinical terms in your answer.
                In a real clinical exam, the markers will look for the diagnosis, radiologic feature, histology and management.
              </p>
            </div>
            <Donut value={matchPct || 0} max={100} color={matchPct >= 60 ? "var(--success)" : matchPct >= 30 ? "var(--warn)" : "var(--danger)"} size={120} />
          </div>
        </div>
      )}

      <div className="grid mt-24">
        <div className="card">
          <div className="card__icon">🧠</div>
          <h3>Why prompt engineering?</h3>
          <p>Clinical reasoning maps closely to prompting an LLM — being specific, scoped and using domain vocabulary changes the answer dramatically.</p>
        </div>
        <div className="card">
          <div className="card__icon">📚</div>
          <h3>Use the Reading module</h3>
          <p>If you score under 60% on a case, open the matching topic in Reading and try again — overlap should improve.</p>
        </div>
        <div className="card">
          <div className="card__icon">🤖</div>
          <h3>Ask the chatbot</h3>
          <p>Use the chat bubble to ask the assistant to explain a specific term from the model answer.</p>
        </div>
      </div>
    </section>
  );
}
