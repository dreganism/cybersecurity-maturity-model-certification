# CMMC Compliance Tool & Marketing Site

## Project Overview
CMMC (Cybersecurity Maturity Model Certification) compliance self-assessment tool for small DoD defense contractors. Hybrid architecture: server-side IP protection with client-side data privacy.

## Architecture

### Hybrid Client/Server
- **Client** (`client/src/`): UI rendering, form inputs, localStorage persistence, JSON import/export. User data (responses, notes, org info) NEVER leaves the browser.
- **Server** (`server/`): Express.js API holding SPRS weights, scoring algorithm, and SSP template generation. No database, no user data storage, stateless.
- **Original** (`index.html`): Legacy standalone version (kept for reference).

### API Endpoints
- `GET /api/controls` — Returns control definitions WITHOUT weights
- `POST /api/score` — Accepts `{ responses }`, returns computed scores
- `POST /api/ssp` — Accepts `{ responses, orgInfo, notes }`, returns generated SSP text
- `GET /health` — Health check

### Data Privacy Constraint
DoD contractor assessment data (IT configuration, compliance posture) must NEVER touch the server or leave the browser. The API only receives control IDs and their met/not-met status for scoring — no org names, no notes, no identifying data in the score endpoint.

## Key Files

### Client
- `client/src/index.html` — HTML/CSS shell (extracted from original index.html)
- `client/src/app.js` — Client-side JS, fetches controls from API, all UI logic
- `client/build.js` — Build script: obfuscates JS, minifies HTML to `client/dist/`
- `client/package.json` — devDependencies: javascript-obfuscator, html-minifier-terser

### Server
- `server/server.js` — Express API with helmet, cors, rate limiting
- `server/controls.js` — PRIVATE: All 110 controls with SPRS weights (never served raw)
- `server/scoring.js` — SPRS scoring logic
- `server/ssp.js` — SSP document generation
- `server/package.json` — Dependencies: express, cors, helmet, dotenv

### Other
- `index.html` — Original standalone assessment tool (all-in-one)
- `index-2.html` — Marketing/sales landing page
- `images/` — Static assets (logos, illustrations, favicon)

## Development

### Client dev
```bash
cd client && npm install && npm run dev   # copies src -> dist (unobfuscated)
cd client && npm run build                # obfuscates + minifies -> dist
```

### Server dev
```bash
cd server && npm install && npm start     # starts API on port 3000
```

### Environment
- `server/.env`: PORT (default 3000), CORS_ORIGIN (default http://localhost:8080)

## Design Notes
- CSS stays embedded in index.html (no benefit to extracting)
- Client caches `/api/controls` in localStorage for offline/degraded mode
- Offline mode shows a banner and disables scoring/SSP features
- SEO metadata (Open Graph, Twitter Cards, JSON-LD) present in HTML pages
- Responsive design with mobile hamburger menu

## Git
- Single branch: `main`
- Author: David Regan <dpr333@nyu.edu>
