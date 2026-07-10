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

let changedCount = 0;

walkDir('c:\\digiriseindia', (filePath) => {
  if (filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;

    let protectedBlocks = [];
    
    // Protect :root blocks
    content = content.replace(/(?:\:root)[^{}]*\{[^}]*\}/g, (match) => {
      let id = `___PROTECTED_${protectedBlocks.length}___`;
      protectedBlocks.push(match);
      return id;
    });

    // Protect [data-theme="light"] blocks
    content = content.replace(/(?:[^{}]*\[data-theme="light"\][^{}]*)\{[^}]*\}/g, (match) => {
      let id = `___PROTECTED_${protectedBlocks.length}___`;
      protectedBlocks.push(match);
      return id;
    });

    // Replace Gold RGB values
    content = content.replace(/240\s*,\s*168\s*,\s*37/g, '255, 255, 255');
    content = content.replace(/184\s*,\s*123\s*,\s*10/g, '255, 255, 255');
    content = content.replace(/224\s*,\s*157\s*,\s*32/g, '255, 255, 255');
    content = content.replace(/255\s*,\s*190\s*,\s*61/g, '255, 255, 255');

    // Replace Gold Hex values
    content = content.replace(/#ffffff/gi, '#ffffff');
    content = content.replace(/#e5e5e5/gi, '#e5e5e5');
    content = content.replace(/#f5f5f5/gi, '#f5f5f5');
    content = content.replace(/#b3b3b3/gi, '#b3b3b3');
    content = content.replace(/#cccccc/gi, '#cccccc');
    content = content.replace(/#999999/gi, '#999999');

    // Restore protected blocks
    protectedBlocks.forEach((block, index) => {
      content = content.replace(`___PROTECTED_${index}___`, block);
    });

    if (content !== orig) {
      fs.writeFileSync(filePath, content);
      changedCount++;
    }
  }
});
console.log(`HTML Purge complete. Changed ${changedCount} files.`);
