// 3D anatomical models for the AR viewer.

export const MODELS = [
  {
    id: "tooth",
    title: "Maxillary Dentition — Full Arch Anatomy",
    description:
      "Explore the complete upper dental arch. Examine crown morphology, root anatomy, and alveolar bone support across incisors, canines, premolars, and molars.",
    tags: ["anatomy", "maxilla"],
    url: "./assets/Maxillary_teeth_w_base_NIH3D.glb",
    poster: "",
    hotspots: [
      { id: "h1", position: "0 1.2 0.3",  normal: "0 1 0",  label: "Central incisor — enamel crown" },
      { id: "h2", position: "1.0 0.8 0",  normal: "1 0 0",  label: "Maxillary molar — three roots" },
      { id: "h3", position: "0 -0.8 0",   normal: "0 -1 0", label: "Alveolar bone — tooth sockets" },
      { id: "h4", position: "0.5 1.0 0",  normal: "0 1 0",  label: "Premolar — bicuspid morphology" }
    ]
  },
  {
    id: "mandible",
    title: "Mandibular Dentition — Third Molar Region",
    description:
      "Lower dental arch with focus on the posterior third molar region — the predilection site for dentigerous cysts, odontogenic keratocysts, and ameloblastoma.",
    tags: ["anatomy", "mandible"],
    url: "./assets/Mandibular_teeth_w_base_NIH3D.glb",
    poster: "",
    hotspots: [
      { id: "h1", position: "0 0.5 0.3",   normal: "0 1 0",   label: "Mandibular body" },
      { id: "h2", position: "1.3 0.6 0",   normal: "1 0 0",   label: "Third molar — impaction site" },
      { id: "h3", position: "0.7 -0.5 0",  normal: "0 -1 0",  label: "Inferior alveolar canal" },
      { id: "h4", position: "-0.8 0.2 0",  normal: "-1 0 0",  label: "Mental foramen" }
    ]
  },
  {
    id: "ameloblastoma-3d",
    title: "Ameloblastoma — Posterior Mandible",
    description:
      "Posterior mandible illustrating the classic site of conventional ameloblastoma. Correlate with the multilocular 'soap-bubble' radiolucency pattern and cortical expansion seen on OPG radiographs.",
    tags: ["pathology", "tumor"],
    url: "./assets/mandibular_teeth_w_base-custom.glb",
    poster: "",
    hotspots: [
      { id: "h1", position: "1.2 0.6 0",  normal: "1 0 0",  label: "Multilocular expansion zone" },
      { id: "h2", position: "1.0 -0.3 0", normal: "1 0 0",  label: "Cortical plate thinning" },
      { id: "h3", position: "0.9 0.8 0",  normal: "0 1 0",  label: "Root resorption — knife-edge pattern" }
    ]
  }
];

export const getModel = (id) => MODELS.find(m => m.id === id);
