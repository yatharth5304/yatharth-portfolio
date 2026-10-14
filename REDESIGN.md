# Reference 3D frontend migration

This local implementation is on `codex/reference-3d-redesign`. Nothing has been
pushed, merged, or deployed. Baseline: `03330d65feaf2547358106763ad226d0fa600511`.
Reference source: `red1-for-hek/portfolio-website`, commit
`e1491d6d709d4fa6df2ca88277f0c31b5e4f6ea7` (MIT).

## Architecture

`frontend/` retains the reference React, Three.js, GSAP, Lenis, CSS, loader,
camera, lights, section timelines, horizontal work gallery, hover effects and
navigation. The unchanged theme is #c2a4ff / #0b080c / #eae5ec with Geist.
Geist fonts and technology icons are bundled locally with their notices.

The Java application and PostgreSQL content remain the backend. The frontend
reads the existing `/api/projects`, `/api/experiences`, `/api/skills`, `/api/stats`
and `/api/principles` endpoints independently and uses a verified public-content
snapshot on timeout or unavailable/empty responses. `/api/health` powers the
footer indicator. This checkout has no `/api/config` implementation; personal
identity and contact data from the existing static page are in `frontend/src/config.ts`.
The original project case studies, admin authentication/CSRF/CRUD, rate limits,
resume PDF and health endpoint remain. No database schema is changed.

Only `/myworks` forwards to React, so no broad SPA fallback masks API errors or
consumes protected/backend routes. CSP allows embedded GLB image blob URLs while
retaining `connect-src 'self'` and the existing admin security configuration.

## Character

The original reference character is restored without changes to its hair, face,
skin, clothing, mesh data, 68-joint rig or 11 animation clips. Its meshes, nodes,
materials, accessors, skins, clips and non-screen binary buffers were compared
against the reference GLB and are identical. GLTFLoader's original sanitized bone
names and the original animation bindings are retained and validated at load time.
No retargeting or replacement rig is involved.

Only the separate monitor scene prop has its personal screenshot removed and
replaced with an authored backend terminal. Original photos, author project
screenshots, author links, analytics, encryption helper/key and author-specific
chat/chess binaries are absent. The reference's CTA is adapted to the verified
resume and LinkedIn links.

Desktop uses the full original WebGL character. At <=1024px the mobile fallback
is a still render of the same original model; no character pose or clip is edited
to produce it. This follows the reference's lightweight mobile approach without
reusing the original developer's personal photograph. The original tablet loader
deadlock is fixed. Load failures show a retry message rather than silently replacing
the desktop experience.

## Local development and build

From `frontend/`: `npm ci`, then `npm run dev` (127.0.0.1:5173). API and resume
requests proxy to a locally running Spring application on port 8080.

From the repository root: `mvn -Pfrontend package` after installing frontend
dependencies. The profile builds React and copies `frontend/dist/` into the JAR's
static resources without overwriting the tracked legacy frontend. Plain `mvn test`
still tests Java independently. Windows automatically selects `npm.cmd`.

Docker has an isolated Node frontend build stage followed by the original Java
build/runtime stages. Docker publication/deployment has not been run.

For an H2 preview without production credentials:
`mvn -Pfrontend "-Dexec.skip=true" "-Dspring-boot.run.useTestClasspath=true" "-Dspring-boot.run.profiles=local" spring-boot:run`
after `npm run build`. H2 has no production content; the frontend uses its verified
snapshot. The existing local profile's admin/admin credentials are development only.

## Verification

`mvn test` includes backend API, resume, React route, health, admin-auth and CSRF
checks against H2. `npm run build` runs TypeScript and the production Vite build.

From `verification/`: `npm ci`, then set `PORTFOLIO_PREVIEW_URL` to the local site
and run `node verify.mjs`. The script uses installed Microsoft Edge, exercises
pointer tracking, eyebrow reactions, intro/blink/typing/keyboard clips, camera
and monitor scroll changes, command-palette keyboard navigation, all seven project
links, tablet/mobile layout and axe accessibility. It renders the mobile portrait
and writes screenshots/report to ignored `verification/artifacts/`, including
matching live-reference desktop/mobile screenshots. Compare those images visually;
personal content differs while the original character remains unchanged.

`THIRD_PARTY_NOTICES.md` and `frontend/public/licenses/` contain attribution and
distribution notices. Project SVGs are authored engineering-overview illustrations,
not fabricated screenshots of applications. Two placeholder GitHub URLs in live
records are omitted; no repository links or achievements are invented.


## Accessibility findings

Desktop automated WCAG AA checks passed. Tablet/mobile scans flagged the reference's
faint resume control, and the logo overlay on small screens, for contrast. Their styling remains
unchanged to honor the explicit instruction not to change colors or contrast. Keyboard
navigation, focus, scrolling, link names, responsive bounds and runtime errors are
checked separately. Evidence is in `verification/artifacts/report.json`.

The reference GLB has no Draco-compressed primitives; unused encrypted/Draco loaders and decoder assets are omitted. All mesh data, bones and animation channels remain in the sanitized GLB.

Compatible dependency updates reduced the npm audit from 30 findings to 3. The remaining
findings concern the Vite/esbuild development toolchain and require a major build-tool
upgrade; no forced upgrade was applied to the reference baseline. Three.js 0.168.0, GSAP
3.12.7, Lenis 1.3.15 and React/React DOM 18.3.1 remain unchanged. Local preview binds to
127.0.0.1. See the recorded npm audit in `verification/artifacts/npm-audit.json`.

Final validation: integrated clean Maven/React build passed; four Java tests passed; real Spring/H2 browser verification passed with no JavaScript errors. Live reference desktop and mobile hero screenshots were captured after the desktop loader finished. See `verification/RESULTS.json` for the compact tracked results and known accessibility/build-tool findings.

The existing case-study pages keep their original content and paths, use the same Geist/palette, and return to `/myworks` so their old `#projects` links do not break after migration.
