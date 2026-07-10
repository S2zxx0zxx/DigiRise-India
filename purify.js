const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'css/redesign.css'),
  path.join(__dirname, 'css/nextgen.css'),
  path.join(__dirname, 'css/ios26.css')
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Protect light mode blocks
  let protectedBlocks = [];
  const regex = /(?:[^{}]*\[data-theme="light"\][^{}]*)\{[^}]*\}/g;
  
  content = content.replace(regex, (match) => {
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

  fs.writeFileSync(file, content);
});

console.log("Purge complete.");
