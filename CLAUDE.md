# CMMC Compliance Tool & Marketing Site

## Project Overview
Static HTML/CSS/JavaScript web application for CMMC (Cybersecurity Maturity Model Certification) compliance self-assessment, targeting small defense contractors needing DoD NIST 800-171 compliance.

## Architecture
- **No frameworks or build tools** — pure vanilla HTML5, CSS3, and ES6+ JavaScript
- **No package manager** — completely self-contained, no external dependencies
- **Client-side only** — no backend; uses browser localStorage for persistence
- **Static hosting** — served via standard HTTP/HTTPS web server

## Key Files
- `index.html` — Full CMMC 2.0 self-assessment tool modeled after DOE C2M2 design: two-panel layout with left sidebar domain navigation, per-practice response selection (Met/Partially Met/Not Met/N/A), SPRS score calculation, stacked bar chart results dashboard, JSON import/export, and SSP document generation. Contains all 110 NIST 800-171 Rev 2 controls with SPRS weights.
- `index-2.html` — Marketing/sales landing page with hero, features, pricing, and CTAs
- `images/` — Static assets (logos, illustrations, favicon)

## Development Guidelines
- All styles are embedded in `<style>` tags within each HTML file
- All JavaScript is embedded in `<script>` tags within each HTML file
- SEO metadata (Open Graph, Twitter Cards, JSON-LD structured data) is present in both pages
- Responsive design with mobile hamburger menu navigation
- No external CDN dependencies — keep everything self-contained

## Git
- Single branch: `main`
- Author: David Regan <dpr333@nyu.edu>
