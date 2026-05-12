// Curated reading content for Odontogenic Oral Pathology.
// Content is summarised from standard oral pathology textbooks (Shafer's, Neville)
// and used here for educational purposes only.

export const TOPICS = [
  {
    id: "intro",
    title: "Introduction to Odontogenic Oral Pathology",
    summary: "Overview of odontogenic tissues, classification of cysts and tumors, and clinical relevance.",
    tags: ["foundation"],
    body: [
      "Odontogenic oral pathology is the branch of pathology concerned with diseases that arise from tooth-forming (odontogenic) tissues. These tissues — enamel organ, dental papilla, dental follicle, and rests of Malassez — can give rise to a wide spectrum of cysts and tumors located primarily in the jaws.",
      "Lesions are broadly classified into developmental odontogenic cysts (e.g., dentigerous cyst, odontogenic keratocyst), inflammatory cysts (radicular and residual cysts), benign odontogenic tumors (ameloblastoma, odontoma, calcifying epithelial odontogenic tumor), and the rare malignant odontogenic tumors.",
      "Accurate diagnosis requires correlation of clinical presentation, radiographic features, and histopathology. Modern imaging modalities such as Cone Beam CT and digital periapical imaging have become indispensable in localising and characterising these lesions.",
      "The clinical importance lies in early identification — many lesions are asymptomatic until significant bone destruction occurs, which can complicate management and prognosis."
    ]
  },
  {
    id: "dentigerous-cyst",
    title: "Dentigerous Cyst",
    summary: "Most common developmental odontogenic cyst, associated with the crown of an unerupted tooth.",
    tags: ["cyst", "developmental"],
    body: [
      "A dentigerous cyst (follicular cyst) is a developmental odontogenic cyst that forms around the crown of an unerupted or impacted tooth, most often the mandibular third molar, followed by maxillary canines and maxillary third molars.",
      "Pathogenesis: Fluid accumulates between the reduced enamel epithelium and the crown of the unerupted tooth after complete enamel formation. The cyst enlarges by osmotic gradient and proliferation of the reduced enamel epithelium.",
      "Radiographically, it appears as a well-defined unilocular radiolucency attached at the cement-enamel junction of the involved tooth. Three radiographic variants are described: central, lateral, and circumferential.",
      "Histologically, the cyst is lined by a thin, non-keratinised stratified squamous epithelium 2–4 cells thick, with a fibrous connective tissue wall. Inflammation may induce hyperplasia and keratinisation.",
      "Treatment is enucleation with extraction of the involved tooth, or marsupialisation for large lesions in young patients. Recurrence is rare but malignant transformation to ameloblastoma, squamous cell carcinoma, or mucoepidermoid carcinoma has been reported."
    ]
  },
  {
    id: "okc",
    title: "Odontogenic Keratocyst (OKC)",
    summary: "Aggressive developmental cyst with characteristic histology and high recurrence rate.",
    tags: ["cyst", "developmental", "aggressive"],
    body: [
      "The odontogenic keratocyst (OKC) is a developmental cyst arising from the dental lamina or its remnants. It is notable for its aggressive clinical behaviour and high recurrence rate, and was briefly reclassified as keratocystic odontogenic tumor before being returned to the cyst category in the 2017 WHO classification.",
      "Most OKCs occur in the posterior mandible and ramus. They typically present as a well-defined, often multilocular radiolucency. Patients may be asymptomatic or report pain, swelling, or paresthesia.",
      "Histopathology shows a uniform parakeratinised stratified squamous epithelial lining 6–8 cells thick, with a palisaded basal cell layer and a corrugated luminal surface. Daughter (satellite) cysts may be present in the wall.",
      "Multiple OKCs are a feature of nevoid basal cell carcinoma syndrome (Gorlin syndrome) — bilateral OKCs in a young patient mandate screening for the syndrome.",
      "Treatment ranges from enucleation with peripheral ostectomy or Carnoy's solution to marginal resection for recurrent or large lesions. Recurrence rates of 25–60% have been reported in the literature."
    ]
  },
  {
    id: "ameloblastoma",
    title: "Ameloblastoma",
    summary: "Most common clinically significant odontogenic tumor — benign but locally aggressive.",
    tags: ["tumor", "benign", "aggressive"],
    body: [
      "Ameloblastoma is a benign but locally aggressive odontogenic epithelial tumor. It represents around 1% of all oral tumors and approximately 10% of all odontogenic tumors. The majority arise in the posterior mandible.",
      "Three main clinical variants are recognised: conventional (solid/multicystic) ameloblastoma, unicystic ameloblastoma, and peripheral ameloblastoma. The 2017 WHO classification removed the term 'solid/multicystic' but the histologic patterns remain clinically important.",
      "Radiographically the conventional type often shows a multilocular 'soap-bubble' or 'honeycomb' radiolucency with cortical expansion, root resorption, and tooth displacement.",
      "Histologic patterns include follicular, plexiform, acanthomatous, granular cell, desmoplastic, and basal cell variants. The follicular and plexiform patterns are the most common.",
      "Treatment of conventional ameloblastoma is resection with adequate margins (1–1.5 cm) because of high recurrence rates after simple enucleation. Unicystic ameloblastoma may be treated more conservatively depending on the histologic subtype."
    ]
  },
  {
    id: "odontoma",
    title: "Odontoma",
    summary: "Most common odontogenic tumor — a hamartomatous malformation of dental tissues.",
    tags: ["tumor", "benign", "hamartoma"],
    body: [
      "Odontoma is the most commonly diagnosed odontogenic tumor and is considered by many to be a developmental hamartoma rather than a true neoplasm. It is composed of well-differentiated enamel, dentin, cementum, and pulp tissue.",
      "Two clinical forms exist: compound odontoma (multiple tooth-like structures, more common in the anterior maxilla) and complex odontoma (a disorganised mass of dental tissues, more common in the posterior mandible).",
      "Most odontomas are asymptomatic and are detected on routine radiographs in the second decade of life, frequently associated with an unerupted tooth.",
      "Treatment is conservative surgical enucleation. Recurrence is exceptionally rare and the prognosis is excellent."
    ]
  },
  {
    id: "radicular-cyst",
    title: "Radicular (Periapical) Cyst",
    summary: "Most common inflammatory odontogenic cyst, arising at the apex of a non-vital tooth.",
    tags: ["cyst", "inflammatory"],
    body: [
      "The radicular cyst is the most common odontogenic cyst, comprising more than half of all jaw cysts. It develops at the apex of a non-vital tooth from epithelial rests of Malassez stimulated by chronic periapical inflammation.",
      "Clinically the involved tooth is non-vital. The cyst is usually asymptomatic until it enlarges and produces a slow-growing swelling. Long-standing lesions may cause root resorption of adjacent teeth.",
      "Radiographs show a well-defined round or oval radiolucency at the apex of the involved tooth, with loss of the lamina dura.",
      "Histology demonstrates a non-keratinised stratified squamous epithelial lining with an inflamed fibrous connective tissue wall. Cholesterol clefts and Rushton bodies may be seen.",
      "Treatment is endodontic therapy or extraction with curettage. A residual cyst may persist if the cyst is not curetted at the time of tooth removal."
    ]
  },
  {
    id: "ceot",
    title: "Calcifying Epithelial Odontogenic Tumor (Pindborg)",
    summary: "Rare benign tumor with characteristic amyloid-like material and calcifications.",
    tags: ["tumor", "benign", "rare"],
    body: [
      "The calcifying epithelial odontogenic tumor (CEOT), or Pindborg tumor, is a rare benign locally invasive odontogenic neoplasm. It accounts for approximately 1% of all odontogenic tumors and most commonly arises in the posterior mandible.",
      "Radiographs show a mixed radiolucent–radiopaque lesion, often associated with the crown of an impacted tooth, with so-called 'driven snow' calcifications.",
      "Histopathology shows sheets of polyhedral epithelial cells with prominent intercellular bridges, pleomorphism, and an amyloid-like material that calcifies to form characteristic Liesegang ring calcifications. Despite the histologic atypia, the tumor behaves benignly.",
      "Treatment is conservative resection with clear margins. Long-term follow-up is required because of the locally invasive behaviour and reported recurrence rates of around 15%."
    ]
  },
  {
    id: "ar-anatomy",
    title: "AR Anatomy: Tooth, Jaw, and Surrounding Structures",
    summary: "Use the 3D viewer to explore enamel, dentin, pulp, periodontal ligament, and the jaw bones.",
    tags: ["AR", "anatomy"],
    body: [
      "The Augmented Reality module allows exploration of normal and pathological anatomy. Rotate, pinch-zoom and orbit the model to study the relationship between the tooth, the alveolar bone, and the periodontal ligament.",
      "On supported Android devices, tap 'View in your space' to project the model into your real environment using ARCore. This provides a sense of true scale and helps in understanding spatial relationships that are difficult to perceive from textbook illustrations.",
      "Each labeled hotspot opens an information card describing the structure or pathology, the typical radiographic appearance, and the differential diagnoses to consider during clinical evaluation."
    ]
  }
];

export const getTopic = (id) => TOPICS.find(t => t.id === id);
