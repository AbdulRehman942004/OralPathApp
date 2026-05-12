// 3D models for the AR viewer.
//
// We point at Google's officially-hosted demo .glb files so the viewer works
// out-of-the-box with no asset bundling. To use a real dental model:
//   1. Drop a .glb file into ./assets/  (e.g. tooth.glb)
//   2. Replace the url for the relevant entry below with "./assets/tooth.glb".
//
// Recommended free sources: Sketchfab (filter by 'Downloadable'), NIH 3D Print Exchange.

export const MODELS = [
  {
    id: "tooth",
    title: "Molar Tooth — Cross-section",
    description:
      "Explore enamel, dentin, pulp chamber, and root canals. Use 'View in your space' on Android to project the model into your environment.",
    tags: ["anatomy", "tooth"],
    url: "./assets/mandible-tooth.glb",
    poster: "",
    hotspots: [
      { id: "h1", position: "0 1.5 0", normal: "0 1 0", label: "Crown — enamel covered" },
      { id: "h2", position: "0 0.6 0", normal: "0 0 1", label: "Cervical line (CEJ)" },
      { id: "h3", position: "0 -0.5 0", normal: "0 -1 0", label: "Root apex — common cyst site" }
    ]
  },
  {
    id: "mandible",
    title: "Mandible with Impacted Third Molar",
    description:
      "Demonstrates the most common site for dentigerous cysts and odontogenic keratocysts (posterior mandible / ramus).",
    tags: ["anatomy", "jaw"],
    url: "./assets/mandible-tooth.glb",
    poster: "",
    hotspots: [
      { id: "h1", position: "0.6 0.8 0", normal: "1 0 0", label: "Body of mandible" },
      { id: "h2", position: "0.9 1.2 0", normal: "1 0 0", label: "Ramus — OKC predilection" }
    ]
  },
  {
    id: "ameloblastoma-3d",
    title: "Ameloblastoma — Multilocular Lesion",
    description:
      "Illustrative model showing the multilocular 'soap-bubble' radiolucency of a conventional ameloblastoma in the posterior mandible.",
    tags: ["pathology", "tumor"],
    url: "./assets/mandible-tooth.glb",
    poster: "",
    hotspots: [
      { id: "h1", position: "0 0.5 0", normal: "0 0 1", label: "Soap-bubble locules" },
      { id: "h2", position: "0 -0.2 0", normal: "0 -1 0", label: "Cortical expansion" }
    ]
  }
];

export const getModel = (id) => MODELS.find(m => m.id === id);
