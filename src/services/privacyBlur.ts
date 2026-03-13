/**
 * Privacy blur: detects faces and license plates in a canvas and blurs them
 * before the image is sent to the AI or uploaded.
 *
 * Face detection uses the browser-native Shape Detection API (FaceDetector),
 * available in Chrome/Edge. On unsupported browsers the step is skipped silently.
 *
 * License plate detection is approximated via Gemini Vision (reuses the existing
 * API key) to get bounding boxes without adding ML library dependencies.
 */

const BLUR_RADIUS = 20; // px — enough to anonymise without looking broken

/** Pixelate a rectangular region on a canvas (more privacy-safe than blur) */
function pixelateRegion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  blockSize = 12
) {
  // Sample at low res and redraw scaled-up
  const imageData = ctx.getImageData(x, y, w, h);
  const offscreen = document.createElement("canvas");
  offscreen.width = w;
  offscreen.height = h;
  const offCtx = offscreen.getContext("2d")!;
  offCtx.putImageData(imageData, 0, 0);

  ctx.imageSmoothingEnabled = false;
  const cols = Math.ceil(w / blockSize);
  const rows = Math.ceil(h / blockSize);
  ctx.drawImage(offscreen, 0, 0, cols, rows);
  ctx.drawImage(
    offscreen,
    0,
    0,
    cols,
    rows,
    x,
    y,
    w,
    h
  );
  ctx.imageSmoothingEnabled = true;
}

/** Apply a CSS blur to a region using a temporary layer */
function blurRegion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const snippet = ctx.getImageData(x, y, w, h);
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const tCtx = tmp.getContext("2d")!;
  tCtx.putImageData(snippet, 0, 0);

  ctx.save();
  ctx.filter = `blur(${BLUR_RADIUS}px)`;
  ctx.drawImage(tmp, x, y, w, h);
  ctx.restore();
}

interface BoundingBox { x: number; y: number; width: number; height: number }

/** Detect faces using the browser's native FaceDetector (Chrome/Edge) */
async function detectFaces(canvas: HTMLCanvasElement): Promise<BoundingBox[]> {
  if (!("FaceDetector" in window)) return [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any).FaceDetector({ maxDetectedFaces: 10, fastMode: true });
    const faces = await detector.detect(canvas);
    return faces.map((f: { boundingBox: DOMRectReadOnly }) => ({
      x: f.boundingBox.x,
      y: f.boundingBox.y,
      width: f.boundingBox.width,
      height: f.boundingBox.height,
    }));
  } catch {
    return [];
  }
}

/** Ask Gemini to locate license plates as normalised bounding boxes (0–1 range) */
async function detectPlatesWithGemini(
  base64Image: string,
  apiKey: string
): Promise<BoundingBox[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Detect any vehicle license plates in this image.
Respond ONLY with a JSON array (no markdown) of bounding boxes with normalized coordinates (0 to 1):
[{"x":0.1,"y":0.8,"width":0.2,"height":0.05}]
If no plates are found respond with an empty array: []`,
                },
                { inline_data: { mime_type: "image/jpeg", data: base64Image } },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 200 },
        }),
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "[]";
    const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
}

/**
 * Main export: applies privacy blur to faces and license plates on the canvas.
 * Mutates the canvas in place and returns it.
 */
export async function applyPrivacyBlur(canvas: HTMLCanvasElement): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  // Run face detection and plate detection in parallel
  const [faces, plates] = await Promise.all([
    detectFaces(canvas),
    geminiKey
      ? detectPlatesWithGemini(
          canvas.toDataURL("image/jpeg", 0.6).split(",")[1],
          geminiKey
        )
      : Promise.resolve([]),
  ]);

  const w = canvas.width;
  const h = canvas.height;

  for (const face of faces) {
    // Expand bounding box slightly for better coverage
    const padding = face.width * 0.1;
    blurRegion(
      ctx,
      Math.max(0, face.x - padding),
      Math.max(0, face.y - padding),
      Math.min(w, face.width + padding * 2),
      Math.min(h, face.height + padding * 2)
    );
  }

  for (const plate of plates) {
    // Plate coords are normalised 0–1
    pixelateRegion(
      ctx,
      Math.floor(plate.x * w),
      Math.floor(plate.y * h),
      Math.ceil(plate.width * w),
      Math.ceil(plate.height * h)
    );
  }
}
