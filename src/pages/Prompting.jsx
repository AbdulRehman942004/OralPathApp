import { useMemo, useState } from "react";

const PROMPTS = [
  {
    id: 1,
    case: "A 22-year-old male presents with painless swelling of the right posterior mandible. An OPG shows a well-defined unilocular radiolucency surrounding the crown of an impacted third molar, attached at the cement-enamel junction.",
    question: "What is the most likely diagnosis and what is the typical histologic finding?",
    model: "Dentigerous cyst. Histology shows a thin, non-keratinised stratified squamous epithelial lining 2–4 cells thick over a fibrous connective tissue wall."
  },
  {
    id: 2,
    case: "A 17-year-old female with multiple basal cell carcinomas presents with bilateral, multilocular radiolucencies in the posterior mandible and ramus. Biopsy shows a parakeratinised lining 6–8 cells thick with a palisaded basal layer.",
    question: "Name the lesion and the syndrome to investigate.",
    model: "Odontogenic keratocysts (OKC) in nevoid basal cell carcinoma syndrome (Gorlin syndrome)."
  },
  {
    id: 3,
    case: "A 45-year-old male presents with expansion of the left posterior mandible. An OPG shows a multilocular 'soap-bubble' radiolucency with cortical expansion and root resorption.",
    question: "What is the most likely diagnosis and what surgical margin is recommended?",
    model: "Conventional (multicystic) ameloblastoma. Recommended margin: 1–1.5 cm of clear bone."
  },
  {
    id: 4,
    case: "An 11-year-old boy is referred after a routine periapical radiograph reveals a cluster of small tooth-like radiopacities in the anterior maxilla, blocking the eruption of a permanent canine.",
    question: "What lesion is most likely, and how is it classified pathologically?",
    model: "Compound odontoma — most authors classify it as a developmental hamartoma rather than a true neoplasm."
  },
  {
    id: 5,
    case: "A 36-year-old female has a chronically discoloured upper central incisor. A periapical radiograph shows a well-circumscribed apical radiolucency with loss of lamina dura. The tooth fails to respond to pulp vitality testing.",
    question: "What is the most likely diagnosis and what is the conservative treatment?",
    model: "Radicular (periapical) cyst on a non-vital tooth. Treat by endodontic therapy; persistence after RCT warrants surgical curettage."
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
    <section className="container section">
      <h2 className="section__title">Prompting drills</h2>
      <p className="section__sub">Type your answer, then reveal the model answer. Your overlap is scored heuristically.</p>

      <div className="row mb-16" style={{ flexWrap: "wrap", gap: 6 }}>
        {PROMPTS.map((_, idx) => (
          <button key={idx} className={"btn btn--sm " + (idx === i ? "btn--primary" : "")} onClick={() => goto(idx)}>
            Case {idx + 1}
          </button>
        ))}
      </div>

      <div className="card mb-16" style={{ display: "block" }}>
        <span className="tag">Clinical vignette</span>
        <p className="mt-12" style={{ fontSize: 15 }}>{p.case}</p>
        <p style={{ fontWeight: 700 }}>Q: {p.question}</p>
      </div>

      <div className="field mb-16">
        <label>Your answer</label>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your differential and rationale…"></textarea>
      </div>

      <div className="row" style={{ gap: 10 }}>
        <button className="btn btn--primary" disabled={!answer.trim()} onClick={() => setShown(true)}>Reveal model answer</button>
        <button className="btn" onClick={reset}>Clear</button>
      </div>

      {shown && (
        <div className="card mt-16" style={{ display: "block" }}>
          <div className="row" style={{ gap: 8 }}>
            <span className="tag">Model answer</span>
            <span className={"tag " + (matchPct >= 60 ? "" : matchPct >= 30 ? "tag--warn" : "tag--danger")}>
              Overlap {matchPct}%
            </span>
          </div>
          <p className="mt-12">{p.model}</p>
          <p className="muted" style={{ fontSize: 13 }}>
            Note: overlap is a simple keyword match meant to encourage including the key terms in your answer.
          </p>
        </div>
      )}
    </section>
  );
}
