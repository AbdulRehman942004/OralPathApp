// Quiz bank for the Interactive Educational Application in Odontogenic Oral Pathology.
// Each question references its topicId so generated quizzes can target a specific reading.

export const QUIZZES = {
  "intro": {
    title: "Foundations of Odontogenic Pathology",
    questions: [
      {
        q: "Which embryonic tissue is NOT considered an odontogenic tissue?",
        opts: ["Enamel organ", "Dental papilla", "Dental follicle", "Stratum corneum"],
        a: 3,
        explain: "Stratum corneum is the outer keratinised layer of the skin epidermis and is not odontogenic."
      },
      {
        q: "The 'rests of Malassez' are remnants of which structure?",
        opts: ["Hertwig's epithelial root sheath", "Reduced enamel epithelium", "Dental lamina", "Nasmyth's membrane"],
        a: 0,
        explain: "Rests of Malassez are remnants of Hertwig's epithelial root sheath and lie in the periodontal ligament."
      },
      {
        q: "Which imaging modality has become indispensable for three-dimensional evaluation of jaw lesions?",
        opts: ["Panoramic radiograph", "Periapical radiograph", "Cone Beam CT", "Lateral cephalogram"],
        a: 2,
        explain: "CBCT provides high-resolution 3D visualisation of jaw lesions with lower radiation than medical CT."
      }
    ]
  },
  "dentigerous-cyst": {
    title: "Dentigerous Cyst",
    questions: [
      {
        q: "A dentigerous cyst is most commonly associated with which tooth?",
        opts: ["Maxillary central incisor", "Mandibular third molar", "Mandibular first premolar", "Maxillary canine"],
        a: 1,
        explain: "Most dentigerous cysts envelop the crown of the impacted mandibular third molar."
      },
      {
        q: "The cyst forms by fluid accumulation between which two structures?",
        opts: ["Enamel and dentin", "Reduced enamel epithelium and the crown", "Periodontal ligament and root", "Cementum and bone"],
        a: 1,
        explain: "Fluid accumulates between the reduced enamel epithelium and the crown after complete enamel formation."
      },
      {
        q: "Radiographically, a dentigerous cyst attaches at the:",
        opts: ["Root apex", "Cement-enamel junction", "Furcation", "Middle third of root"],
        a: 1,
        explain: "The cyst characteristically attaches at the CEJ of the involved unerupted tooth."
      },
      {
        q: "Which is a recognised radiographic variant of a dentigerous cyst?",
        opts: ["Trabecular", "Circumferential", "Reticular", "Eccentric apical"],
        a: 1,
        explain: "Central, lateral, and circumferential variants are described."
      }
    ]
  },
  "okc": {
    title: "Odontogenic Keratocyst",
    questions: [
      {
        q: "The OKC most commonly occurs in which region?",
        opts: ["Anterior maxilla", "Posterior mandible / ramus", "Hard palate", "Floor of mouth"],
        a: 1,
        explain: "Posterior body of mandible and ramus is the classic site."
      },
      {
        q: "Multiple OKCs in a young patient should prompt evaluation for:",
        opts: ["Paget's disease", "Gorlin (NBCC) syndrome", "Sturge–Weber syndrome", "Albright syndrome"],
        a: 1,
        explain: "Multiple OKCs are a major criterion of nevoid basal cell carcinoma syndrome."
      },
      {
        q: "Histologic hallmark of the OKC lining is:",
        opts: ["Orthokeratinised epithelium with granular cells", "Parakeratinised epithelium with palisaded basal cells", "Pseudostratified ciliated columnar epithelium", "Non-keratinised lining with cholesterol clefts"],
        a: 1,
        explain: "Parakeratinised stratified squamous epithelium with a corrugated surface and palisaded basal layer."
      },
      {
        q: "Reported recurrence rate of OKC after simple enucleation is approximately:",
        opts: ["0–5%", "10–15%", "25–60%", "Over 90%"],
        a: 2,
        explain: "Recurrence rates of 25–60% are well documented in the literature."
      }
    ]
  },
  "ameloblastoma": {
    title: "Ameloblastoma",
    questions: [
      {
        q: "The classic radiographic description of conventional ameloblastoma is:",
        opts: ["Cotton-wool appearance", "Ground-glass appearance", "Soap-bubble / honeycomb radiolucency", "Sunburst periosteal reaction"],
        a: 2,
        explain: "Multilocular 'soap-bubble' or 'honeycomb' radiolucency is the classical description."
      },
      {
        q: "The most common histologic patterns of conventional ameloblastoma are:",
        opts: ["Acanthomatous and granular", "Follicular and plexiform", "Basal cell and desmoplastic", "Cystic and solid"],
        a: 1,
        explain: "Follicular and plexiform patterns are the most common; others are recognised variants."
      },
      {
        q: "Recommended surgical margin for conventional (multicystic) ameloblastoma is:",
        opts: ["Enucleation alone", "1–1.5 cm clear margin", "Curettage only", "Marsupialisation only"],
        a: 1,
        explain: "Resection with 1–1.5 cm margins is recommended to minimise recurrence."
      },
      {
        q: "Which is NOT a recognised clinical variant of ameloblastoma?",
        opts: ["Unicystic", "Conventional", "Peripheral", "Aneurysmal"],
        a: 3,
        explain: "Unicystic, conventional, and peripheral are recognised; aneurysmal is not."
      }
    ]
  },
  "odontoma": {
    title: "Odontoma",
    questions: [
      {
        q: "Compound odontomas are most often seen in the:",
        opts: ["Posterior mandible", "Anterior maxilla", "Hard palate", "Maxillary sinus"],
        a: 1,
        explain: "Compound odontomas favour the anterior maxilla; complex ones favour the posterior mandible."
      },
      {
        q: "Odontomas are best classified as:",
        opts: ["Malignant tumors", "Hamartomas", "Cysts", "Inflammatory lesions"],
        a: 1,
        explain: "Most authors regard odontomas as developmental hamartomas rather than true neoplasms."
      }
    ]
  },
  "radicular-cyst": {
    title: "Radicular Cyst",
    questions: [
      {
        q: "A radicular cyst arises from:",
        opts: ["Reduced enamel epithelium", "Rests of Malassez", "Dental lamina", "Reduced ameloblasts"],
        a: 1,
        explain: "Inflammation stimulates the rests of Malassez in the periodontal ligament."
      },
      {
        q: "The pulp status of the involved tooth in a radicular cyst is:",
        opts: ["Vital", "Hyper-responsive", "Non-vital", "Variable"],
        a: 2,
        explain: "The associated tooth is non-vital by definition."
      },
      {
        q: "Which histologic feature may be seen in a radicular cyst?",
        opts: ["Liesegang rings", "Rushton bodies", "Russell bodies only", "Verocay bodies"],
        a: 1,
        explain: "Rushton bodies are eosinophilic, hyaline structures sometimes seen in odontogenic cyst linings."
      }
    ]
  },
  "ceot": {
    title: "CEOT (Pindborg)",
    questions: [
      {
        q: "The classical radiographic feature of CEOT is described as:",
        opts: ["Soap bubble", "Driven snow", "Sunburst", "Ground glass"],
        a: 1,
        explain: "'Driven snow' calcifications scattered within a radiolucency around an impacted tooth."
      },
      {
        q: "Which microscopic finding is characteristic?",
        opts: ["Verocay bodies", "Liesegang ring calcifications and amyloid-like material", "Cholesterol clefts", "Russell bodies"],
        a: 1,
        explain: "Liesegang ring calcifications within amyloid-like material are hallmark."
      }
    ]
  },
  "ar-anatomy": {
    title: "AR Anatomy",
    questions: [
      {
        q: "Which technology underlies AR projection on Android devices?",
        opts: ["ARKit", "ARCore", "OpenXR", "WebXR-only"],
        a: 1,
        explain: "Google's ARCore powers AR scene understanding on supported Android devices; model-viewer uses it for 'View in your space'."
      },
      {
        q: "An advantage of an AR-based learning experience over a static textbook diagram is:",
        opts: ["Cheaper paper printing", "True 3D spatial relationship and scale", "Eliminates need for cadaveric study entirely", "Replaces clinical examination"],
        a: 1,
        explain: "AR conveys true 3D spatial relationships and scale that flat diagrams cannot."
      }
    ]
  }
};

// Pool used for the cross-topic 'Sample Quiz' and for randomised practice.
export const sampleQuiz = (count = 10) => {
  const all = [];
  Object.entries(QUIZZES).forEach(([topicId, set]) => {
    set.questions.forEach((q, i) => all.push({ ...q, topicId, qid: `${topicId}-${i}` }));
  });
  // shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
};

export const quizForTopic = (topicId) => {
  const q = QUIZZES[topicId];
  return q
    ? { title: q.title, questions: q.questions.map((x, i) => ({ ...x, topicId, qid: `${topicId}-${i}` })) }
    : null;
};
