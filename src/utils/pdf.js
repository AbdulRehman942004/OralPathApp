// Extract plain text from an uploaded PDF using pdf.js loaded from a CDN.
// We import lazily so the main bundle stays small.

let pdfLib = null;

const loadPdfJs = async () => {
  if (pdfLib) return pdfLib;
  const mod = await import(
    /* @vite-ignore */ "https://esm.sh/pdfjs-dist@4.4.168/build/pdf.min.mjs"
  );
  mod.GlobalWorkerOptions.workerSrc =
    "https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";
  pdfLib = mod;
  return mod;
};

export const extractPdfText = async (file) => {
  const pdfjs = await loadPdfJs();
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const chunks = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    chunks.push(content.items.map((it) => it.str).join(" "));
  }
  return chunks.join("\n\n");
};
