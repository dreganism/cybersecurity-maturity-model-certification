// ============================================================
// CMMC 2.0 Scoring Engine — Server-side only
// ============================================================

const { CONTROLS, DOMAINS } = require('./controls');

const VALID_RESPONSES = new Set(['met', 'partial', 'not-met', 'na']);

/**
 * Calculate the SPRS score and per-domain breakdown from assessment responses.
 *
 * @param {Object} responses - Map of controlId to 'met'|'partial'|'not-met'|'na'
 * @returns {Object} Scoring result
 */
function calculateScore(responses) {
    if (!responses || typeof responses !== 'object') {
        responses = {};
    }

    let sprsDeduction = 0;
    let met = 0;
    let partial = 0;
    let notMet = 0;
    let na = 0;
    let unassessed = 0;

    // Level breakdowns
    const l1 = { met: 0, total: 0, achieved: false };
    const l2 = { met: 0, total: 0, achieved: false };

    // Domain breakdowns — initialise each domain
    const domains = {};
    DOMAINS.forEach(d => {
        domains[d.abbr] = { met: 0, partial: 0, notMet: 0, na: 0, unassessed: 0, total: 0 };
    });

    CONTROLS.forEach(c => {
        const r = responses[c.id];
        const dom = domains[c.domain];

        // Domain total
        dom.total++;

        // Level totals
        if (c.level === 1) l1.total++;
        else l2.total++;

        if (r === 'met') {
            met++;
            dom.met++;
            if (c.level === 1) l1.met++;
            else l2.met++;
        } else if (r === 'partial') {
            partial++;
            dom.partial++;
            sprsDeduction += c.weight;
        } else if (r === 'not-met') {
            notMet++;
            dom.notMet++;
            sprsDeduction += c.weight;
        } else if (r === 'na') {
            na++;
            dom.na++;
            if (c.level === 1) l1.met++;
            else l2.met++;
        } else {
            // Not assessed — counts as not met for SPRS
            unassessed++;
            dom.unassessed++;
            sprsDeduction += c.weight;
        }
    });

    l1.achieved = l1.met === l1.total;
    l2.achieved = l2.met === l2.total;

    return {
        sprs: 110 - sprsDeduction,
        totalControls: CONTROLS.length,
        met,
        partial,
        notMet,
        na,
        unassessed,
        l1,
        l2,
        domains
    };
}

module.exports = { calculateScore };
