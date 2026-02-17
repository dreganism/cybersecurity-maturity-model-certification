// ============================================================
// SSP (System Security Plan) Generator — Server-side
// Mirrors the client-side generateSSP() output format.
// ============================================================

const { CONTROLS, DOMAINS } = require('./controls');

/**
 * Generate a plain-text System Security Plan document.
 *
 * @param {Object} responses - Map of controlId to 'met'|'partial'|'not-met'|'na'
 * @param {Object} orgInfo   - Organization metadata
 * @param {Object} notes     - Map of controlId to implementation note string
 * @returns {string} The SSP document as plain text
 */
function generateSSP(responses, orgInfo, notes) {
    if (!responses || typeof responses !== 'object') responses = {};
    if (!orgInfo || typeof orgInfo !== 'object') orgInfo = {};
    if (!notes || typeof notes !== 'object') notes = {};

    const targetLevel = orgInfo.targetLevel || 2;

    let doc = '';
    doc += '='.repeat(72) + '\n';
    doc += '         SYSTEM SECURITY PLAN (SSP)\n';
    doc += '         CMMC 2.0 Self-Assessment\n';
    doc += '='.repeat(72) + '\n\n';
    doc += `Organization:    ${orgInfo.orgName || 'Not Provided'}\n`;
    doc += `CAGE Code:       ${orgInfo.cageCode || 'Not Provided'}\n`;
    doc += `Assessor:        ${orgInfo.assessorName || 'Not Provided'}\n`;
    doc += `Assessment Date: ${orgInfo.assessDate || 'Not Provided'}\n`;
    doc += `System Name:     ${orgInfo.systemName || 'Not Provided'}\n`;
    doc += `Target Level:    CMMC Level ${targetLevel}\n`;
    doc += `Generated:       ${new Date().toLocaleString()}\n\n`;

    doc += '-'.repeat(72) + '\n';
    doc += 'SYSTEM ENVIRONMENT & BOUNDARY\n';
    doc += '-'.repeat(72) + '\n';
    doc += (orgInfo.systemBoundary || 'Not Provided') + '\n\n';

    // SPRS Score
    let sprsDeduction = 0;
    CONTROLS.forEach(c => {
        const r = responses[c.id];
        if (r !== 'met' && r !== 'na') sprsDeduction += c.weight;
    });
    const sprs = 110 - sprsDeduction;
    doc += '-'.repeat(72) + '\n';
    doc += `SPRS SCORE: ${sprs} / 110\n`;
    doc += '-'.repeat(72) + '\n\n';

    // Controls by domain
    DOMAINS.forEach(domain => {
        const controls = CONTROLS.filter(c => c.domain === domain.abbr);
        doc += '\n' + '='.repeat(72) + '\n';
        doc += `${domain.abbr} — ${domain.name.toUpperCase()} (${controls.length} requirements)\n`;
        doc += '='.repeat(72) + '\n\n';

        controls.forEach(c => {
            const r = responses[c.id];
            let status;
            if (r === 'met') status = '[ MET          ]';
            else if (r === 'partial') status = '[ PARTIALLY MET ]';
            else if (r === 'not-met') status = '[ NOT MET       ]';
            else if (r === 'na') status = '[ N/A           ]';
            else status = '[ NOT ASSESSED  ]';

            const lvl = c.level === 1 ? 'L1' : 'L2';
            doc += `${status} [${lvl}] ${c.id}\n`;
            doc += `  ${c.text}\n`;
            if (notes[c.id]) {
                doc += `  Implementation Notes: ${notes[c.id]}\n`;
            }
            doc += '\n';
        });
    });

    doc += '\n' + '='.repeat(72) + '\n';
    doc += 'END OF SYSTEM SECURITY PLAN\n';
    doc += '='.repeat(72) + '\n';

    return doc;
}

module.exports = { generateSSP };
