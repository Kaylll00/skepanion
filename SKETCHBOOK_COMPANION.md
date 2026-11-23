# Sketchbook Companion — Project Spec for an AI Coding Assistant

> Hand this file to your AI coding assistant and say:
> **"Read SKETCHBOOK_COMPANION.md and set up the project, then build milestone 1."**
> Work milestone by milestone. After each one, run the app and verify its acceptance checks before moving on.

---

## 1. What It Is

A local-first PWA for beginner artists. Each drawing has a **timeline of photos**. Every photo you add does two jobs:

| Job | What the user gets |
|---|---|
| **Progress** | Photos are flattened and aligned, then shown as a before/after slider and an exportable GIF. |
| **Palette** | Each photo gets a 5-color palette with plain-language names and approximate mixing hints. The palette-over-time view shows how colors shift across stages. |

Plain-language analogy: it is a **flipbook plus a paint-swatch card** for each drawing. The flipbook shows how the drawing grew, and the swatch card shows which colors you used.

## 2. Goals and Non-Goals

| Goals | Non-Goals (v1) |
|---|---|
| Works fully offline after first load | User accounts or cloud sync |
| No backend, all data in the browser | Auto-detection of paper corners (manual taps first) |
| Installable on a phone home screen | Perfect pigment-mixing accuracy |
| Beginner-friendly, minimal UI | Drawing tools or a canvas editor |

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **SvelteKit** (TypeScript) | Use `adapter-static` so it builds to plain static files |
| PWA | `@vite-pwa/sveltekit` | Manifest and service worker for offline and install |
| Storage | **Dexie** (IndexedDB) | Store image blobs and metadata locally |
| Image work | HTML Canvas, plain TS | No OpenCV in v1 |
| GIF export | `gifenc` | Small and fast |
| Styling | Plain CSS or Tailwind | Mobile-first, large tap targets |
| Native wrap (later) | Capacitor | Only after the PWA works |

## 4. Data Model

```ts
type Drawing = {
  id: string;            // uuid
  title: string;
  createdAt: number;     // ms epoch
  paletteSetId?: string; // the user's paint or pencil set
};

type Stage = {
  id: string;
  drawingId: string;
  createdAt: number;
  originalBlob: Blob;    // untouched photo
  flatBlob: Blob;        // perspective-corrected, fixed output size
  corners: [Pt, Pt, Pt, Pt]; // TL, TR, BR, BL in original-photo pixels
  palette: PaletteColor[];   // 5 entries
  note?: string;
};

type Pt = { x: number; y: number };

type PaletteColor = {
  hex: string;
  lab: [number, number, number];
  share: number;         // 0-1, fraction of pixels
  name: string;          // e.g. "muted teal"
};

type PaletteSet = {
  id: string;
  name: string;          // e.g. "My 24 colored pencils"
  colors: { name: string; hex: string }[];
};
```

## 5. Project Structure

```
src/
  lib/
    db.ts                 # Dexie setup and typed tables
    image/
      flatten.ts          # 4-corner perspective warp -> fixed-size canvas
      homography.ts       # solve 3x3 matrix from 4 point pairs
      resize.ts           # downscale helpers
    color/
      extract.ts          # median-cut palette extraction
      lab.ts              # sRGB <-> LAB conversion
      name.ts             # hex -> plain-language color name
      mix.ts              # approximate mixing suggestions
    export/
      gif.ts              # stages -> GIF via gifenc
    components/
      CornerPicker.svelte
      CompareSlider.svelte
      PaletteStrip.svelte
      Timeline.svelte
  routes/
    +page.svelte          # drawings list
    drawing/[id]/+page.svelte   # timeline for one drawing
    drawing/[id]/add/+page.svelte  # add a stage: capture, corners, review
    palettes/+page.svelte        # manage paint or pencil sets
    monthly/+page.svelte         # first vs latest comparison
```

## 6. Milestones

Do these **in order**. Do not start the next until the acceptance checks pass.

### Milestone 1 — Setup and Storage
- Scaffold SvelteKit (TypeScript, `adapter-static`), add Dexie and `@vite-pwa/sveltekit`.
- Implement `db.ts` with the tables from section 4.
- Drawings list page: create, rename and delete a drawing.

**Acceptance:** Create a drawing, refresh the page, and it is still there. Works with the network turned off after the first load.

### Milestone 2 — Capture and Flatten
- Add-stage page with a file input (`accept="image/*" capture="environment"`).
- `CornerPicker`: show the photo, let the user drag four handles to the paper corners (order TL, TR, BR, BL), with touch support and a magnifier or zoom for precision.
- `homography.ts` and `flatten.ts`: warp to a fixed output (for example 1200x1600 portrait, or match the paper ratio the user picks: A4, A5, square).
- Save the original, the flat image and the corners to IndexedDB.
- Handle EXIF orientation so phone photos are not rotated.

**Acceptance:** A tilted photo of a sheet of paper becomes a straight, rectangular image. Re-adding a stage to the same drawing produces images of identical size.

### Milestone 3 — Timeline, Slider, GIF
- `Timeline`: stages in chronological order with thumbnails and dates.
- `CompareSlider`: pick any two stages and drag a divider between them.
- `gif.ts`: export all stages as a GIF (frame delay adjustable, default 600 ms, output max 800 px wide) and offer it as a download.

**Acceptance:** With 3 or more stages, the slider works smoothly on a phone and the GIF downloads and plays.

### Milestone 4 — Palette Extraction and Naming
- `extract.ts`: downscale the flat image to about 100 px wide, ignore near-white paper pixels (tune a threshold, and let the user toggle "ignore paper color"), run median-cut or k-means to get 5 colors, and sort by share.
- `name.ts`: convert to HSL or LAB and produce a plain-language name from small lookup tables, for example *lightness word* (light, muted, deep) + *hue word* (teal, warm gray, olive...). Use neutral names for low saturation.
- `PaletteStrip`: show 5 swatches with hex, name and a share bar.
- Compute the palette automatically when a stage is saved.

**Acceptance:** A photo of a colorful drawing yields 5 sensible, distinct swatches. A blank page yields few or no results and the UI handles that gracefully.

### Milestone 5 — Mixing Hints and Palette Sets
- Palettes page: the user creates a set (name plus colors, entered by hex or color picker).
- `mix.ts`: for each extracted color, search for the closest combination of 1 to 3 colors from the user's set in **LAB space**, in simple ratios (for example 2:1, 1:1, 1:2), and show the top suggestion as "about 2 parts A + 1 part B".
- Label clearly as **approximate**. Real pigment mixing is nonlinear.

**Acceptance:** A color that exists in the set returns that color alone. A color between two set colors returns a plausible blend.

### Milestone 6 — Palette Over Time and Monthly View
- On the drawing page, show a row of palette strips per stage, so color drift is visible across the timeline.
- Monthly page: for the chosen month, show the user's first and latest drawing side by side using the slider.

**Acceptance:** Both views render with real data and with empty states.

### Milestone 7 — Polish and Install
- PWA manifest, icons, offline check, install prompt.
- Export and import all data as one JSON file (images as base64) for backup.
- Basic accessibility: labels, contrast, keyboard reachable controls.

**Acceptance:** Installs to a phone home screen, runs offline, backup round-trips without loss.

## 7. Technical Notes

- **Homography:** solve for the 3x3 matrix mapping the four destination corners to the four source corners, then, for each output pixel, sample the source pixel with bilinear interpolation. Use inverse mapping to avoid holes.
- **Memory:** phone photos are large. Downscale before heavy processing, and keep the original blob separately.
- **Color math:** convert sRGB to linear, then XYZ, then LAB (D65). Use CIE76 (Euclidean) distance for v1.
- **Performance:** run extraction and warping in a Web Worker if the UI stutters.
- **Storage limits:** IndexedDB quota is large but not infinite. Show a simple storage-used indicator later.

## 8. Rules for the AI Assistant

1. Read this whole file before writing code.
2. Ask before adding any dependency that is not listed in section 3.
3. Keep functions small and typed. No `any`.
4. Add a short unit test for every pure function in `lib/color` and `lib/image/homography.ts` (use Vitest).
5. After each milestone, run `npm run check` and `npm run build`, then summarize what changed and what to test by hand.
6. Do not build features from the non-goals list.
7. If an instruction here is unclear, pick the simplest option, state the choice, and continue.

## 9. Definition of Done (v1)

- All 7 milestones pass their acceptance checks.
- The app builds to static files and runs offline.
- A user can: create a drawing, add several photos over time, scrub through progress, export a GIF, see palettes with names and mixing hints, and back up their data.

## 10. Stretch Ideas (after v1)

- Auto-detect paper corners with OpenCV.js.
- Palette "drift" chart (average hue and lightness per stage).
- Ghost overlay: show the previous stage faintly in the camera view for consistent framing.
- Capacitor build for Android and iOS.
