// ============================================================
// API CONFIGURATION
// ============================================================
const API_BASE = 'http://localhost:3000';

// ============================================================
// CMMC 2.0 CONTROLS DATA — Fetched from server API
// Domains and controls are loaded dynamically; weights are server-only
// ============================================================
let DOMAINS = [];
let CONTROLS = [];
let offlineMode = false;

// ============================================================
// APPLICATION STATE
// ============================================================
let state = {
    targetLevel: 2,
    orgInfo: {},
    responses: {},    // controlId -> 'met' | 'partial' | 'not-met' | 'na'
    notes: {},        // controlId -> string
    currentPage: 'intro'
};

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    loadFromStorage();
    await fetchControls();
    buildDomainNav();
    buildDomainPages();
    setDateDefault();
    restoreOrgInfo();
    showPage(state.currentPage);
    autoSaveSetup();
});

async function fetchControls() {
    try {
        const res = await fetch(`${API_BASE}/api/controls`);
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        DOMAINS = data.domains;
        CONTROLS = data.controls;
        // Cache for offline use
        localStorage.setItem('cmmc_controls_cache', JSON.stringify(data));
        offlineMode = false;
        hideOfflineBanner();
    } catch(e) {
        console.error('Failed to fetch controls from API:', e);
        // Try cached controls
        const cached = localStorage.getItem('cmmc_controls_cache');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                DOMAINS = data.domains;
                CONTROLS = data.controls;
            } catch(parseErr) { /* ignore */ }
        }
        if (CONTROLS.length > 0) {
            offlineMode = true;
            showOfflineBanner();
        } else {
            showToast('Unable to load controls — no API connection and no cached data');
        }
    }
}

function showOfflineBanner() {
    let banner = document.getElementById('offline-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.style.cssText = 'background:#ca8a04;color:white;text-align:center;padding:8px 16px;font-size:13px;font-weight:600;z-index:200;';
        banner.textContent = 'Offline mode — scoring and SSP generation unavailable until connection is restored';
        document.body.insertBefore(banner, document.body.firstChild);
    }
}

function hideOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) banner.remove();
}

function setDateDefault() {
    const d = document.getElementById('assessDate');
    if (!d.value) d.value = new Date().toISOString().split('T')[0];
}

function autoSaveSetup() {
    setInterval(() => saveToStorage(), 30000);
}

// ============================================================
// NAVIGATION
// ============================================================
function buildDomainNav() {
    const list = document.getElementById('domain-nav-list');
    list.innerHTML = '';
    DOMAINS.forEach((d, i) => {
        const controls = CONTROLS.filter(c => c.domain === d.abbr);
        const assessed = controls.filter(c => state.responses[c.id]).length;
        const total = controls.length;
        let iconClass = 'domain';
        if (assessed === total && total > 0) iconClass += ' complete';
        else if (assessed > 0) iconClass += ' partial';

        const item = document.createElement('div');
        item.className = 'nav-item';
        item.setAttribute('data-page', 'domain-' + i);
        item.onclick = () => showPage('domain-' + i);
        item.innerHTML = `
            <div class="nav-icon ${iconClass}" id="nav-icon-${i}">${d.abbr}</div>
            <div class="nav-label">${d.name}<small>NIST ${d.nist}</small></div>
            <div class="nav-count" id="nav-count-${i}">${assessed}/${total}</div>
        `;
        list.appendChild(item);
    });
}

function updateNavIndicators() {
    DOMAINS.forEach((d, i) => {
        const controls = CONTROLS.filter(c => c.domain === d.abbr);
        const assessed = controls.filter(c => state.responses[c.id]).length;
        const total = controls.length;

        const icon = document.getElementById('nav-icon-' + i);
        if (icon) {
            icon.className = 'nav-icon domain';
            if (assessed === total && total > 0) icon.classList.add('complete');
            else if (assessed > 0) icon.classList.add('partial');
        }

        const count = document.getElementById('nav-count-' + i);
        if (count) count.textContent = assessed + '/' + total;
    });
}

function showPage(pageId) {
    // Capture intro form data before navigating away
    if (state.currentPage === 'intro') gatherOrgInfo();
    state.currentPage = pageId;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        document.getElementById('main-content').scrollTop = 0;
    }

    const navItem = document.querySelector(`[data-page="${pageId}"]`);
    if (navItem) navItem.classList.add('active');

    if (pageId === 'results') renderResults();

    // Close mobile nav
    document.getElementById('sidebar').classList.remove('mobile-open');
}

function toggleMobileNav() {
    document.getElementById('sidebar').classList.toggle('mobile-open');
}

// ============================================================
// BUILD DOMAIN ASSESSMENT PAGES
// ============================================================
function buildDomainPages() {
    const container = document.getElementById('domain-pages-container');
    container.innerHTML = '';

    DOMAINS.forEach((domain, domIdx) => {
        const controls = CONTROLS.filter(c => c.domain === domain.abbr);
        const prevPage = domIdx === 0 ? 'intro' : 'domain-' + (domIdx - 1);
        const nextPage = domIdx === DOMAINS.length - 1 ? 'results' : 'domain-' + (domIdx + 1);

        let html = `<div class="page" id="page-domain-${domIdx}"><div class="domain-page">`;

        // Domain header
        html += `
            <div class="domain-header">
                <div class="domain-header-top">
                    <div class="domain-title">
                        <span class="domain-badge">${domain.abbr}</span>
                        <h2>${domain.name}</h2>
                    </div>
                    <span style="font-size:13px;color:var(--gray-500);">NIST SP 800-171 &sect;${domain.nist} &mdash; ${controls.length} requirement${controls.length!==1?'s':''}</span>
                </div>
                <div class="domain-progress-bar">
                    <div class="domain-progress-fill" id="dprog-fill-${domIdx}" style="width:0%"></div>
                </div>
                <div class="domain-progress-text" id="dprog-text-${domIdx}">0 / ${controls.length} assessed</div>
            </div>
        `;

        // Practice cards
        controls.forEach(ctrl => {
            const resp = state.responses[ctrl.id] || '';
            const cardClass = resp === 'met' ? 'met' : resp === 'partial' ? 'partial' : resp === 'not-met' ? 'not-met' : 'not-assessed';
            const levelClass = ctrl.level === 1 ? 'badge-l1' : 'badge-l2';
            const levelLabel = ctrl.level === 1 ? 'L1' : 'L2';

            html += `
                <div class="practice-card ${cardClass}" id="card-${ctrl.id}">
                    <div class="practice-header">
                        <span class="practice-id">${ctrl.id}</span>
                        <span class="practice-level-badge ${levelClass}">${levelLabel}</span>
                        <span class="practice-text">${ctrl.text}</span>
                    </div>
                    <div class="practice-response">
                        <label>Status:</label>
                        <button class="response-btn ${resp==='met'?'selected-met':''}" onclick="setResponse('${ctrl.id}','met',${domIdx})">Met</button>
                        <button class="response-btn ${resp==='partial'?'selected-partial':''}" onclick="setResponse('${ctrl.id}','partial',${domIdx})">Partially Met</button>
                        <button class="response-btn ${resp==='not-met'?'selected-not-met':''}" onclick="setResponse('${ctrl.id}','not-met',${domIdx})">Not Met</button>
                        <button class="response-btn ${resp==='na'?'selected-na':''}" onclick="setResponse('${ctrl.id}','na',${domIdx})">N/A</button>
                    </div>
                    <div class="practice-notes-toggle">
                        <button onclick="toggleNotes('${ctrl.id}')">+ Add implementation notes</button>
                    </div>
                    <div class="practice-notes" id="notes-${ctrl.id}" ${state.notes[ctrl.id]?'class="visible"':''}>
                        <textarea placeholder="Describe how this control is implemented..." onchange="saveNote('${ctrl.id}',this.value)">${state.notes[ctrl.id]||''}</textarea>
                    </div>
                </div>
            `;
        });

        // Nav arrows
        html += `
            <div class="domain-nav">
                <button class="btn btn-secondary" onclick="showPage('${prevPage}')">&larr; ${domIdx === 0 ? 'Introduction' : DOMAINS[domIdx-1].name}</button>
                <button class="btn btn-primary" onclick="showPage('${nextPage}')">${domIdx === DOMAINS.length-1 ? 'View Results' : DOMAINS[domIdx+1].name} &rarr;</button>
            </div>
        `;

        html += '</div></div>';
        container.insertAdjacentHTML('beforeend', html);
    });
}

// ============================================================
// RESPONSE HANDLING
// ============================================================
function setResponse(controlId, value, domIdx) {
    if (state.responses[controlId] === value) {
        delete state.responses[controlId];
    } else {
        state.responses[controlId] = value;
    }

    updateCardUI(controlId);
    updateDomainProgress(domIdx);
    updateNavIndicators();
    saveToStorage();
}

function updateCardUI(controlId) {
    const card = document.getElementById('card-' + controlId);
    if (!card) return;
    const resp = state.responses[controlId] || '';
    card.className = 'practice-card ' + (resp === 'met' ? 'met' : resp === 'partial' ? 'partial' : resp === 'not-met' ? 'not-met' : 'not-assessed');

    const buttons = card.querySelectorAll('.response-btn');
    const vals = ['met', 'partial', 'not-met', 'na'];
    const classes = ['selected-met', 'selected-partial', 'selected-not-met', 'selected-na'];
    buttons.forEach((btn, i) => {
        btn.className = 'response-btn' + (resp === vals[i] ? ' ' + classes[i] : '');
    });
}

function updateDomainProgress(domIdx) {
    const domain = DOMAINS[domIdx];
    const controls = CONTROLS.filter(c => c.domain === domain.abbr);
    const assessed = controls.filter(c => state.responses[c.id]).length;
    const pct = controls.length > 0 ? Math.round((assessed / controls.length) * 100) : 0;
    const fill = document.getElementById('dprog-fill-' + domIdx);
    const text = document.getElementById('dprog-text-' + domIdx);
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = assessed + ' / ' + controls.length + ' assessed (' + pct + '%)';
}

function toggleNotes(controlId) {
    const el = document.getElementById('notes-' + controlId);
    if (el) el.classList.toggle('visible');
}

function saveNote(controlId, value) {
    if (value.trim()) {
        state.notes[controlId] = value;
    } else {
        delete state.notes[controlId];
    }
    saveToStorage();
}

// ============================================================
// TARGET LEVEL
// ============================================================
function selectLevel(level) {
    state.targetLevel = level;
    document.getElementById('level-opt-1').className = 'level-option' + (level === 1 ? ' selected' : '');
    document.getElementById('level-opt-2').className = 'level-option' + (level === 2 ? ' selected' : '');
    saveToStorage();
}

// ============================================================
// RESULTS RENDERING (via server API)
// ============================================================
async function renderResults() {
    if (offlineMode) {
        document.getElementById('sprs-score').textContent = '--';
        document.getElementById('met-count').textContent = '--';
        document.getElementById('partial-count').textContent = '--';
        document.getElementById('not-met-count').textContent = '--';
        showToast('Scoring unavailable in offline mode');
        return;
    }
    try {
        const res = await fetch(`${API_BASE}/api/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: state.responses })
        });
        if (!res.ok) throw new Error(`Score API returned ${res.status}`);
        const result = await res.json();

        document.getElementById('sprs-score').textContent = result.sprs;
        document.getElementById('met-count').textContent = result.met;
        document.getElementById('partial-count').textContent = result.partial;
        document.getElementById('not-met-count').textContent = result.notMet;

        // Level 1 compliance
        const l1Pct = result.l1.total > 0 ? Math.round((result.l1.met / result.l1.total) * 100) : 0;
        document.getElementById('l1-meter').style.width = l1Pct + '%';
        document.getElementById('l1-pct').textContent = result.l1.met + ' / ' + result.l1.total + ' met';
        document.getElementById('l1-status').textContent = result.l1.achieved ? 'Achieved' : 'Not Achieved';
        document.getElementById('l1-status').className = 'level-status ' + (result.l1.achieved ? 'pass' : 'fail');

        // Level 2 compliance
        const l2Pct = result.l2.total > 0 ? Math.round((result.l2.met / result.l2.total) * 100) : 0;
        document.getElementById('l2-meter').style.width = l2Pct + '%';
        document.getElementById('l2-pct').textContent = result.l2.met + ' / ' + result.l2.total + ' met';
        document.getElementById('l2-status').textContent = result.l2.achieved ? 'Achieved' : 'Not Achieved';
        document.getElementById('l2-status').className = 'level-status ' + (result.l2.achieved ? 'pass' : 'fail');

        // Domain bar chart
        const barsDiv = document.getElementById('domain-bars');
        barsDiv.innerHTML = '';
        DOMAINS.forEach(d => {
            const dom = result.domains[d.abbr];
            if (!dom) return;
            const total = dom.total;
            const pct = (v) => total > 0 ? (v / total * 100).toFixed(1) : 0;

            barsDiv.innerHTML += `
                <div class="stacked-bar-row">
                    <div class="bar-label">${d.abbr}</div>
                    <div class="bar-track">
                        ${dom.met > 0 ? `<div class="bar-segment met" style="width:${pct(dom.met)}%">${dom.met}</div>` : ''}
                        ${dom.partial > 0 ? `<div class="bar-segment partial" style="width:${pct(dom.partial)}%">${dom.partial}</div>` : ''}
                        ${dom.notMet > 0 ? `<div class="bar-segment not-met" style="width:${pct(dom.notMet)}%">${dom.notMet}</div>` : ''}
                        ${dom.na > 0 ? `<div class="bar-segment na" style="width:${pct(dom.na)}%">${dom.na}</div>` : ''}
                        ${dom.unassessed > 0 ? `<div class="bar-segment unassessed" style="width:${pct(dom.unassessed)}%">${dom.unassessed}</div>` : ''}
                    </div>
                    <div class="bar-count">${dom.met}/${total}</div>
                </div>
            `;
        });
    } catch(e) {
        console.error('Failed to fetch score:', e);
        document.getElementById('sprs-score').textContent = '--';
        showToast('Scoring unavailable — check API connection');
    }
}

// ============================================================
// PERSISTENCE (localStorage)
// ============================================================
function saveToStorage() {
    gatherOrgInfo();
    localStorage.setItem('cmmc_assessment', JSON.stringify(state));
}

function loadFromStorage() {
    const saved = localStorage.getItem('cmmc_assessment');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
        } catch(e) { /* ignore parse errors */ }
    }
}

function gatherOrgInfo() {
    state.orgInfo = {
        orgName: (document.getElementById('orgName')?.value || ''),
        assessorName: (document.getElementById('assessorName')?.value || ''),
        cageCode: (document.getElementById('cageCode')?.value || ''),
        assessDate: (document.getElementById('assessDate')?.value || ''),
        systemName: (document.getElementById('systemName')?.value || ''),
        systemBoundary: (document.getElementById('systemBoundary')?.value || '')
    };
}

function restoreOrgInfo() {
    const info = state.orgInfo || {};
    if (info.orgName) document.getElementById('orgName').value = info.orgName;
    if (info.assessorName) document.getElementById('assessorName').value = info.assessorName;
    if (info.cageCode) document.getElementById('cageCode').value = info.cageCode;
    if (info.assessDate) document.getElementById('assessDate').value = info.assessDate;
    if (info.systemName) document.getElementById('systemName').value = info.systemName;
    if (info.systemBoundary) document.getElementById('systemBoundary').value = info.systemBoundary;
    if (state.targetLevel) selectLevel(state.targetLevel);

    // Restore domain progress
    DOMAINS.forEach((d, i) => updateDomainProgress(i));
}

// ============================================================
// IMPORT
// ============================================================
function importJSON() {
    document.getElementById('importFileInput').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.responses) state.responses = data.responses;
            if (data.notes) state.notes = data.notes;
            if (data.orgInfo) state.orgInfo = data.orgInfo;
            if (data.targetLevel) state.targetLevel = data.targetLevel;
            // Restore UI first so DOM fields are populated before saveToStorage reads them
            restoreOrgInfo();
            buildDomainPages();
            updateNavIndicators();
            saveToStorage();
            showToast('Assessment imported successfully');
        } catch(err) {
            showToast('Error: Invalid JSON file');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ============================================================
// SSP GENERATION (via server API)
// ============================================================
async function generateSSP() {
    if (offlineMode) {
        showToast('SSP generation unavailable in offline mode');
        return;
    }
    gatherOrgInfo();
    const info = state.orgInfo;

    try {
        const res = await fetch(`${API_BASE}/api/ssp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                responses: state.responses,
                orgInfo: { ...info, targetLevel: state.targetLevel },
                notes: state.notes
            })
        });
        if (!res.ok) throw new Error(`SSP API returned ${res.status}`);
        const result = await res.json();

        const blob = new Blob([result.ssp], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const orgName = (info.orgName || 'SSP').replace(/\s+/g, '_');
        link.download = `SSP_${orgName}_${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('System Security Plan generated');
    } catch(e) {
        console.error('Failed to generate SSP:', e);
        showToast('SSP generation unavailable — check API connection');
    }
}

// ============================================================
// RESET & LOGOUT
// ============================================================
function clearAllData() {
    state = {
        targetLevel: 2,
        orgInfo: {},
        responses: {},
        notes: {},
        currentPage: 'intro'
    };
    localStorage.removeItem('cmmc_assessment');

    // Clear form fields
    ['orgName','assessorName','cageCode','assessDate','systemName','systemBoundary'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    setDateDefault();
    selectLevel(2);

    // Rebuild UI
    buildDomainPages();
    updateNavIndicators();
    DOMAINS.forEach((d, i) => updateDomainProgress(i));
    showPage('intro');
}

function resetAssessment() {
    if (!confirm('This will permanently delete all assessment data, responses, and notes.\n\nAre you sure you want to reset?')) return;
    clearAllData();
    showToast('Assessment data cleared');
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
