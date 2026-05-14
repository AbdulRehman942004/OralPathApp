// Client-side computer-vision primitives implemented on top of HTML Canvas
// 2D. No external libraries — these are textbook algorithms (grayscale, Sobel
// edges, Otsu / adaptive threshold, histogram) suitable for a dental-imaging
// teaching app. All operations stay on the user's device.

export const loadImage = (fileOrUrl) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => resolve(img);
  img.onerror = reject;
  if (typeof fileOrUrl === "string") {
    img.src = fileOrUrl;
  } else {
    const r = new FileReader();
    r.onload = (e) => { img.src = e.target.result; };
    r.onerror = reject;
    r.readAsDataURL(fileOrUrl);
  }
});

export const imageToCanvas = (img, maxSide = 720) => {
  const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  c.getContext("2d").drawImage(img, 0, 0, w, h);
  return c;
};

export const cloneCanvas = (src) => {
  const c = document.createElement("canvas");
  c.width = src.width; c.height = src.height;
  c.getContext("2d").drawImage(src, 0, 0);
  return c;
};

/** Convert a canvas to a luminance buffer (Uint8ClampedArray length = w*h). */
export const toLuma = (canvas) => {
  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext("2d");
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;
  const out = new Uint8ClampedArray(w * h);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    // Rec. 601 luma — matches most diagnostic imaging viewers
    out[j] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) | 0;
  }
  return { luma: out, w, h };
};

/** Render a luminance buffer back into a fresh canvas (greyscale). */
export const lumaToCanvas = ({ luma, w, h }, colour = null) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0, j = 0; j < luma.length; i += 4, j++) {
    const v = luma[j];
    if (colour) {
      d[i] = (v * colour[0]) | 0;
      d[i + 1] = (v * colour[1]) | 0;
      d[i + 2] = (v * colour[2]) | 0;
    } else {
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
};

/** 256-bin histogram of a luminance buffer. Returns Uint32Array(256). */
export const histogram = (luma) => {
  const h = new Uint32Array(256);
  for (let i = 0; i < luma.length; i++) h[luma[i]]++;
  return h;
};

/** Otsu's method: returns the optimal threshold in [0,255]. */
export const otsuThreshold = (luma) => {
  const hist = histogram(luma);
  const total = luma.length;
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0, wB = 0, wF = 0, maxVar = 0, threshold = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > maxVar) { maxVar = between; threshold = t; }
  }
  return threshold;
};

/** Apply a binary threshold; returns a new luma buffer (0 or 255). */
export const applyThreshold = ({ luma, w, h }, t) => {
  const out = new Uint8ClampedArray(luma.length);
  for (let i = 0; i < luma.length; i++) out[i] = luma[i] >= t ? 255 : 0;
  return { luma: out, w, h };
};

/** Sobel edge magnitude — returns luma buffer scaled to 0..255. */
export const sobel = ({ luma, w, h }) => {
  const out = new Uint8ClampedArray(luma.length);
  const at = (x, y) => luma[y * w + x];
  let maxMag = 1;
  const tmp = new Float32Array(luma.length);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx =
        -at(x - 1, y - 1) + at(x + 1, y - 1)
        - 2 * at(x - 1, y) + 2 * at(x + 1, y)
        - at(x - 1, y + 1) + at(x + 1, y + 1);
      const gy =
        -at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1)
        + at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1);
      const m = Math.sqrt(gx * gx + gy * gy);
      tmp[y * w + x] = m;
      if (m > maxMag) maxMag = m;
    }
  }
  for (let i = 0; i < tmp.length; i++) out[i] = Math.min(255, (tmp[i] / maxMag) * 255) | 0;
  return { luma: out, w, h };
};

/** Render a histogram into a small SVG element. */
export const renderHistogramSVG = (hist, width = 320, height = 110, color = "var(--brand)") => {
  const max = Math.max(...hist);
  if (!max) return `<svg width="${width}" height="${height}"></svg>`;
  const bw = width / 256;
  const bars = Array.from(hist).map((v, i) => {
    const bh = Math.max(1, (v / max) * (height - 2));
    return `<rect x="${(i * bw).toFixed(2)}" y="${height - bh}" width="${bw + 0.5}" height="${bh}" fill="${color}"/>`;
  }).join("");
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${bars}</svg>`;
};

/** Convert a canvas to a data URL — used for previews and downloads. */
export const canvasToDataURL = (canvas, type = "image/png", quality = 0.92) =>
  canvas.toDataURL(type, quality);

/** Convert a canvas to a base64-only string (no data URL prefix). */
export const canvasToBase64 = (canvas) => {
  const url = canvas.toDataURL("image/jpeg", 0.85);
  return url.split(",")[1];
};

/** Quick-and-cheap heuristic features useful for an educational caption. */
export const summariseLuma = ({ luma }) => {
  const hist = histogram(luma);
  const total = luma.length;
  let mean = 0;
  for (let t = 0; t < 256; t++) mean += t * hist[t];
  mean /= total;
  let variance = 0;
  for (let i = 0; i < luma.length; i++) variance += (luma[i] - mean) ** 2;
  variance /= total;
  const std = Math.sqrt(variance);
  const dark = hist.slice(0, 64).reduce((s, v) => s + v, 0) / total;
  const bright = hist.slice(192, 256).reduce((s, v) => s + v, 0) / total;
  return {
    meanLuma: Math.round(mean),
    stdLuma: Math.round(std),
    darkRatio: +(dark * 100).toFixed(1),
    brightRatio: +(bright * 100).toFixed(1),
    contrastClass: std < 30 ? "low" : std < 60 ? "moderate" : "high"
  };
};
