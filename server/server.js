// ============================================================
// CMMC 2.0 Assessment API — Express Server
// ============================================================

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { DOMAINS, CONTROLS } = require('./controls');
const { calculateScore } = require('./scoring');
const { generateSSP } = require('./ssp');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

// ── Middleware ──────────────────────────────────────────────

app.use(helmet());

app.use(cors({ origin: CORS_ORIGIN }));

app.use(express.json({ limit: '100kb' }));

// ── Rate Limiting (in-memory, per IP) ──────────────────────

const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_MAX = 100;
const rateLimitMap = new Map();

// Periodically clean up expired entries (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap) {
        if (now - entry.windowStart > RATE_WINDOW_MS) {
            rateLimitMap.delete(ip);
        }
    }
}, 5 * 60 * 1000);

function rateLimiter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    let entry = rateLimitMap.get(ip);

    if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
        entry = { windowStart: now, count: 1 };
        rateLimitMap.set(ip, entry);
        return next();
    }

    entry.count++;

    if (entry.count > RATE_MAX) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    next();
}

app.use(rateLimiter);

// ── Request Logging ────────────────────────────────────────
// Log ONLY method, path, status code, and response time.
// NEVER log request bodies.

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// ── Validation Helpers ─────────────────────────────────────

const VALID_STATUSES = new Set(['met', 'partial', 'not-met', 'na']);
const CONTROL_IDS = new Set(CONTROLS.map(c => c.id));

function validateResponses(responses) {
    if (!responses || typeof responses !== 'object' || Array.isArray(responses)) {
        return 'responses must be a non-null object';
    }
    for (const [id, status] of Object.entries(responses)) {
        if (!CONTROL_IDS.has(id)) {
            return `Unknown control ID: ${id}`;
        }
        if (!VALID_STATUSES.has(status)) {
            return `Invalid status "${status}" for control ${id}. Must be met|partial|not-met|na`;
        }
    }
    return null;
}

// ── Routes ─────────────────────────────────────────────────

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// GET /api/controls — return domains and controls with weight STRIPPED
app.get('/api/controls', (_req, res) => {
    const strippedControls = CONTROLS.map(({ weight, ...rest }) => rest);
    res.json({ domains: DOMAINS, controls: strippedControls });
});

// POST /api/score — validate input, compute score, return result
app.post('/api/score', (req, res) => {
    const { responses } = req.body;

    const err = validateResponses(responses);
    if (err) {
        return res.status(400).json({ error: err });
    }

    const result = calculateScore(responses);
    res.json(result);
});

// POST /api/ssp — validate input, generate SSP, return text
app.post('/api/ssp', (req, res) => {
    const { responses, orgInfo, notes } = req.body;

    const err = validateResponses(responses || {});
    if (err) {
        return res.status(400).json({ error: err });
    }

    if (orgInfo && (typeof orgInfo !== 'object' || Array.isArray(orgInfo))) {
        return res.status(400).json({ error: 'orgInfo must be an object' });
    }

    if (notes && (typeof notes !== 'object' || Array.isArray(notes))) {
        return res.status(400).json({ error: 'notes must be an object' });
    }

    const ssp = generateSSP(responses || {}, orgInfo || {}, notes || {});
    res.json({ ssp });
});

// ── 404 fallback ───────────────────────────────────────────

app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// ── Start Server ───────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`CMMC Assessment API listening on port ${PORT}`);
    console.log(`CORS origin: ${CORS_ORIGIN}`);
});

module.exports = app;
