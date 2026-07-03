const fs = require('fs');
const path = require('path');

const rootDir = 'c:/digiriseindia';

// Helper to get all relevant files
function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file.startsWith('.')) continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.css')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const allFiles = getAllFiles(rootDir);

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // 1. Fix absolute paths in HTML tags (e.g. href="manifest.json" -> href="manifest.json")
    const absoluteReplacements = [
        'manifest.json',
        'favicon.ico',
        'icon-192.png',
        'icon-512.png',
        'og-image.png',
        'llms.txt',
        'llms-full.txt',
        'ai.txt'
    ];

    absoluteReplacements.forEach(asset => {
        // Fix href="/..." and src="/..."
        const regex = new RegExp(`(href|src)="\\/${asset}"`, 'g');
        content = content.replace(regex, `$1="${asset}"`);
    });

    // 2. Fix /assets/ paths to assets/
    content = content.replace(/(href|src)="\/assets\//g, '$1="assets/');
    content = content.replace(/url\(['"]?\/assets\//g, 'url(\'assets/');

    // 3. Fix missing folder for posters (if poster="assets/reels/reel1-poster.jpg" instead of "assets/reels/...")
    content = content.replace(/poster="reel(\d+)-poster\.jpg"/g, 'poster="assets/reels/reel$1-poster.jpg"');
    
    // 4. Fix sw.js specific absolute paths
    if (file.endsWith('sw.js')) {
        content = content.replace(/'\/nextgen.css'/g, "'./nextgen.css'");
        content = content.replace(/'\/nextgen.js'/g, "'./nextgen.js'");
        content = content.replace(/'\/'/g, "'./'");
        content = content.replace(/'\/index.html'/g, "'./index.html'");
        content = content.replace(/'\/manifest.json'/g, "'./manifest.json'");
        content = content.replace(/'\/favicon.ico'/g, "'./favicon.ico'");
        content = content.replace(/'\/icon-192.png'/g, "'./icon-192.png'");
        content = content.replace(/'\/icon-512.png'/g, "'./icon-512.png'");
        content = content.replace(/'\/og-image.png'/g, "'./og-image.png'");
        content = content.replace(/'\/blog\/'/g, "'./blog/'");
        content = content.replace(/'\/blog\/index.html'/g, "'./blog/index.html'");
    }

    // 5. Fix manifest.json start_url
    if (file.endsWith('manifest.json')) {
        content = content.replace(/"start_url": "\/"/g, '"start_url": "."');
        content = content.replace(/"src": "\//g, '"src": "'); // fixes /icon-192.png to icon-192.png
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed paths in: ${file}`);
    }
}

console.log('\n✅ All absolute paths have been converted to relative paths!');
console.log('GitHub Pages should now load all assets perfectly.');
