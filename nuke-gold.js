const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (f === 'node_modules' || f === '.git' || f === '.gemini') return;
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;

walkDir('c:\\digiriseindia', (filePath) => {
  if (filePath.endsWith('.html') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;

    // Fast global string replacements (no complex regex to prevent backtracking)
    // Hex codes (case insensitive)
    content = content.replace(/#ffffff/gi, '#ffffff');
    content = content.replace(/#e5e5e5/gi, '#e5e5e5');
    content = content.replace(/#f5f5f5/gi, '#f5f5f5');
    content = content.replace(/#b3b3b3/gi, '#b3b3b3');
    content = content.replace(/#cccccc/gi, '#cccccc');
    content = content.replace(/#999999/gi, '#999999');

    // RGB components
    content = content.replace(/240,\s*168,\s*37/g, '255, 255, 255');
    content = content.replace(/184,\s*123,\s*10/g, '255, 255, 255');
    content = content.replace(/224,\s*157,\s*32/g, '255, 255, 255');
    content = content.replace(/255,\s*190,\s*61/g, '255, 255, 255');
    
    // Also without spaces just in case
    content = content.replace(/255, 255, 255/g, '255,255,255');
    content = content.replace(/255, 255, 255/g, '255,255,255');
    content = content.replace(/255, 255, 255/g, '255,255,255');
    content = content.replace(/255, 255, 255/g, '255,255,255');

    // Restore Light Mode base variables so the site isn't totally broken in Light Mode
    // We only restore the variable DEFINITIONS.
    // In CSS:
    content = content.replace(/--gold:\s*#ffffff;/g, '--gold: #b3b3b3;');
    content = content.replace(/--gold-mid:\s*#cccccc;/g, '--gold-mid: #ffffff;');
    content = content.replace(/--gold-light:\s*#ffffff;/g, '--gold-light: #ffffff;');
    content = content.replace(/--gold-deep:\s*#999999;/g, '--gold-deep: #8a5c06;');
    content = content.replace(/--gold-pale:\s*rgba\(255,\s*255,\s*255,\s*0\.08\);/g, '--gold-pale: rgba(255, 255, 255, 0.08);');
    content = content.replace(/--gold-pale2:\s*rgba\(255,\s*255,\s*255,\s*0\.14\);/g, '--gold-pale2: rgba(255, 255, 255, 0.16);');
    
    // In HTML inline CSS:
    content = content.replace(/--gold:#f2f2f2;/g, '--gold:#f2f2f2;');
    content = content.replace(/--gold-mid: #ffffff;/g, '--gold-mid: #ffffff;');
    content = content.replace(/--gold-light: #ffffff;/g, '--gold-light: #ffffff;');
    content = content.replace(/--gold-pale:rgba\(255,255,255,0\.08\);/g, '--gold-pale: rgba(255, 255, 255, 0.08);');
    content = content.replace(/--gold-pale2:rgba\(255,255,255,0\.13\);/g, '--gold-pale2:rgba(255, 255, 255,0.13);');
    
    // Specifically for dark mode overrides, we WANT them to be white!
    // But since the regex above restored all `--gold: #ffffff`, we need to force dark mode back to white if it's inside `[data-theme="dark"]`.
    // Actually, earlier we did this via CSS, and we can just let it be. But wait, if I restore --gold: #b3b3b3 globally where it was #ffffff, I might ruin my Dark Mode changes from v5.8!
    // Let's NOT restore them. Let the user have pure Matte Glowy White everywhere if that's what it takes to nuke the gold.
    // The user said "gold kahii v nghi rehna chaiye".
    
    if (content !== orig) {
      fs.writeFileSync(filePath, content);
      count++;
    }
  }
});

console.log(`Nuked gold from ${count} files.`);
