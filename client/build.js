#!/usr/bin/env node

// ============================================================
// CMMC Client Build Script
// Obfuscates JS and minifies HTML for production deployment
// ============================================================

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { minify } = require('html-minifier-terser');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

async function build() {
    console.log('Building client for production...\n');

    // Ensure dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // 1. Obfuscate app.js
    console.log('  Obfuscating app.js...');
    const jsSource = fs.readFileSync(path.join(SRC_DIR, 'app.js'), 'utf8');
    const obfuscated = JavaScriptObfuscator.obfuscate(jsSource, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.5,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.2,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,  // Keep global function names for onclick handlers
        selfDefending: false,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    });
    const obfuscatedJS = obfuscated.getObfuscatedCode();
    fs.writeFileSync(path.join(DIST_DIR, 'app.min.js'), obfuscatedJS);
    console.log(`    Source: ${(jsSource.length / 1024).toFixed(1)} KB -> Obfuscated: ${(obfuscatedJS.length / 1024).toFixed(1)} KB`);

    // 2. Minify index.html (update script reference to minified version)
    console.log('  Minifying index.html...');
    let htmlSource = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf8');
    // Point to the obfuscated JS file
    htmlSource = htmlSource.replace('src="app.js"', 'src="app.min.js"');

    const minifiedHTML = await minify(htmlSource, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true
    });
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), minifiedHTML);
    console.log(`    Source: ${(htmlSource.length / 1024).toFixed(1)} KB -> Minified: ${(minifiedHTML.length / 1024).toFixed(1)} KB`);

    console.log('\nBuild complete! Output in client/dist/');
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
