const fs = require('fs');
const path = require('path');

const rootDir = 'c:/digiriseindia';

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file.startsWith('.')) continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const allFiles = getAllHtmlFiles(rootDir);

let globalCss = '';
let globalJs = '';

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let hasModified = false;
    let extractedCssForThisFile = false;
    let extractedJsForThisFile = false;

    // Extract styles
    // Regex matches <style> ... </style>
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let cssMatch;
    let fileCss = '';
    while ((cssMatch = styleRegex.exec(content)) !== null) {
        fileCss += `/* Extracted from ${path.basename(file)} */\n` + cssMatch[1] + '\n\n';
    }
    
    if (fileCss.trim()) {
        globalCss += fileCss;
        content = content.replace(styleRegex, ''); // Remove the styles from HTML
        hasModified = true;
        extractedCssForThisFile = true;
    }

    // Extract scripts
    // Regex matches <script ...> ... </script>
    const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    content = content.replace(scriptRegex, (match, attrs, body) => {
        // Skip external scripts, JSON-LD schema, or other non-executable blocks
        if (attrs.includes('src=') || attrs.includes('application/ld+json') || attrs.includes('type="application/json"')) {
            return match; 
        }
        if (body.trim() === '') {
            return ''; // remove empty tags
        }
        globalJs += `/* Extracted from ${path.basename(file)} */\n` + body + '\n\n';
        hasModified = true;
        extractedJsForThisFile = true;
        return ''; // remove the script block from HTML
    });

    if (hasModified) {
        // Calculate relative path so that subfolders (like blog/) correctly reference root
        let relativePathToRoot = path.relative(path.dirname(file), rootDir).replace(/\\/g, '/');
        const prefix = relativePathToRoot ? relativePathToRoot + '/' : './';

        const cssLink = `<link rel="stylesheet" href="${prefix}inline-styles.css">`;
        const jsLink = `<script src="${prefix}inline-scripts.js" defer></script>`;

        // Inject the CSS link into <head> if it's not already there
        if (!content.includes('inline-styles.css') && extractedCssForThisFile) {
            content = content.replace('</head>', `    ${cssLink}\n</head>`);
        }
        
        // Inject the JS script tag before </body> if it's not already there
        if (!content.includes('inline-scripts.js') && extractedJsForThisFile) {
            content = content.replace('</body>', `    ${jsLink}\n</body>`);
        }
        
        // Cleanup leftover multiple empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Cleaned up HTML and extracted code from: ${file}`);
    }
}

// Write the aggregated CSS file
if (globalCss.trim()) {
    const cssPath = path.join(rootDir, 'inline-styles.css');
    const existingCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') + '\n' : '';
    fs.writeFileSync(cssPath, existingCss + globalCss.trim());
    console.log(`\n✅ Saved all inline CSS to ${cssPath}`);
}

// Write the aggregated JS file
if (globalJs.trim()) {
    const jsPath = path.join(rootDir, 'inline-scripts.js');
    const existingJs = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') + '\n' : '';
    fs.writeFileSync(jsPath, existingJs + globalJs.trim());
    console.log(`✅ Saved all inline JS to ${jsPath}`);
}

console.log('\nDone! Your HTML files are now clean and modular.');
