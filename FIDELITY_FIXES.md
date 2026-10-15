# Reference fidelity corrections — 15 October 2026

This work continues the existing `codex/reference-3d-redesign` checkout from
`1ef88f4`. The complete reference is in `../reference-portfolio`, upstream
`red1-for-hek/portfolio-website` at `e1491d6d709d4fa6df2ca88277f0c31b5e4f6ea7`.
The previous chat, commit, migration notes, original GLB, source, live reference,
and deployed site were inspected. The live browser serves the 3D build; its
search/crawl representation still contains the legacy static page.

## Causes and implementation

| Issue | Evidence and correction |
| --- | --- |
| White eyes in production | The live console records `connect-src 'self'` blocking GLTFLoader's ImageBitmapLoader requests to embedded `blob:` textures. The deployed GLB's hash matches yesterday's local GLB, including its intact 1024×1024 iris texture. This also loses the textured ground shadow. A named GLTFLoader plugin selects TextureLoader, which decodes through an image element under the existing `img-src blob:` policy. CSP is unchanged. The original skinned eyes, UVs, placement, material and Blink clip are retained, and preparation rejects an undecoded iris texture. |
| Incorrect monitor appearance | The reference's 800×800 `screenlight` image is a generic shaped glow mask. Yesterday's replacement of that image with a 1px placeholder and an opaque terminal canvas destroyed the mask. The original GLB is restored byte for byte. Content now belongs to `Material.028`, the physical screen; its UVs derive from its planar local bounds. The original glow and ground textures are retained. |
| Monitor parts separating during the reveal | The reference scroll code animates only `Material.027`'s mesh position and opacity; the second panel stays transparent. A scene group carries the existing casing, panel and light together. Both casing and panel fade in on the reference's original timing. No new computer, desk, keyboard, mouse, chair, or character geometry is substituted. |
| Bad text wrapping | The inherited splitter flattened `<br>` and inline emphasis, then measured glyphs in a deferred frame after GSAP applied staggered transforms. It could mistake individual words for lines. Splitting now preserves DOM structure and measures synchronously before animation, after fonts load. Existing breaks are represented once. The duplicate About word margin is removed. |
| Career alignment | An added dates paragraph was a third 40%-wide flex child in the original two-column row. Description and date now share the right-hand column. |
| Hero clipping and overlap | The 150%-wide role element and fixed large type did not fit the longer personal role at all widths. It now fits the reference's right column. The services title is aligned within the left text region so the character does not cover it. |
| Navigation and resizing | Navigation now uses document flow offsets, avoiding GSAP's current transforms. Command palette navigation no longer starts two competing scroll operations. The horizontal work gallery recalculates its distance on refresh and switches pinning through matchMedia. Mobile gets the career timeline even though Scene is omitted. Service disclosures handle mouse, touch, and keyboard without leaked listeners. |
| Lighting/startup and cleanup | Scene readiness includes the HDR environment to prevent a late environment load from resetting the lighting. The original 14.5° FOV, camera [0,13.1,24.7], zoom 1.1, light colors/exposure, head tracking, rig clips, scroll camera path, and flicker timing remain. Blink timers and the monitor flicker are disposed on unmount. |

## Scope and intentional differences

The palette remains #c2a4ff / #0b080c / #eae5ec and the font remains Geist.
Yatharth's existing content, seven project/case-study links, resume, contacts,
backend APIs, security headers, routes and deployment configuration are preserved.
Stats are existing verified content, not newly invented claims.

The reference camera sees the back of the monitor during the desktop section.
The new terminal is on the front display, so it deliberately does not show through
the casing. Independent eye tracking is not invented: the reference uses head
tracking, rigged blinks and eyebrow reactions. At <=1024px the existing model
portrait remains the lightweight fallback, replacing the reference author's photo.
No deployment or push is part of these corrections.

## Reproducible checks and evidence

`npm run build` in `frontend` checks TypeScript and bundles production assets.
`mvn test` runs the existing backend/integration suite.

`node verification/serve-production.mjs` serves the production build at
127.0.0.1:4174 with the CSP read from SecurityHeadersFilter.java. Its API responses
are the verified snapshot fixture; this is explicitly separate from Java tests.
Run `node verification/fidelity-check.mjs` for matched screenshots, texture/rig,
camera, hover, pointer tracking, Blink/typing, monitor assembly, all page sections,
disclosures, navigation, command palette, project links and runtime errors at
1440×900, 1920×1080, 390×844 and 820×1180.

`verification/fidelity-audit.mjs reference` captures the live reference at
1440×900; append `remaining` for 1920×1080 and 390×844. The same script accepts
`deployed` to record the production failure. Generated images and JSON reports
are under the ignored `verification/artifacts/fidelity/` directory. Validation
results are recorded after the final pass; failed intermediate reports must not
be represented as passing.

## Final validation

- TypeScript and production build: passed.
- Existing Java suite: 4 tests, 0 failures, 0 errors. Covers public APIs, health,
  resume, case-study/React routes, admin authentication, CSRF and CSP.
- Edge/Chromium production browser pass: passed at 1440×900, 1920×1080,
  390×844 and 820×1180; no JavaScript errors or failed required assets.
- Eyes: original 1024×1024 texture decoded under the unchanged CSP; original
  skinned eyes, pointer tracking, eyebrow hover, Blink and typing verified.
- Monitor: original 800×800 glow atlas decoded; both physical parts and glow
  visible at the services reveal; original scroll camera reaches [0,8.4,75].
- Resizing: desktop → 390px mobile unmounts WebGL; → 1920px desktop remounts
  exactly one scene with decoded eyes. Horizontal gallery moves with scrolling;
  reverse navigation from Contact returns precisely to About at y=1080.
- The old mobile PNG was a mid-blink frame. Its replacement was rendered from
  the original model at Blink time zero and visually checked for visible irises.
- All page sections were captured and visually reviewed. The reference,
  deployed baseline and corrected implementation were captured at the three
  requested viewport sizes. `comparison.html` provides matching views.
- Pillow difference images and numerical diagnostics are recorded. They are
  not a fidelity percentage: content, pointer pose, blink and random flicker
  are not synchronized between sites.

The browser pass uses the verified snapshot API fixture with the actual Spring
CSP; Java integration tests are separate. Safari/Firefox, physical devices,
production database connectivity and deployed behavior after these changes
remain untested. No changes have been pushed or deployed. Compact tracked results
are in `verification/FIDELITY_RESULTS.json`; detailed evidence is in
`verification/artifacts/fidelity/final-report.json` and `resize-report.json`.
