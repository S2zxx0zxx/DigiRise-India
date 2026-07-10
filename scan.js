const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    let dirPath = path.join(dir, file);
    if (fs.statSync(dirPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.gemini') {
        filelist = walkSync(dirPath, filelist);
      }
    } else {
      filelist.push(dirPath);
    }
  });
  return filelist;
}

const htmlFiles = walkSync('c:/digiriseindia').filter(f => f.endsWith('.html'));
const cssFiles = walkSync('c:/digiriseindia/css').filter(f => f.endsWith('.css'));
const jsFiles = walkSync('c:/digiriseindia/js').filter(f => f.endsWith('.js'));

console.log(`Scanning ${htmlFiles.length} HTML files, ${cssFiles.length} CSS files, ${jsFiles.length} JS files...\\n`);

let issues = [];

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let relativePath = path.relative('c:/digiriseindia', file);
  
  // Check for proper theme injection
  if (!content.includes(':root{')) {
    issues.push(`[Theme Issue] ${relativePath}: Missing :root theme block`);
  }
  if (!content.includes('[data-theme="dark"]{')) {
    issues.push(`[Theme Issue] ${relativePath}: Missing [data-theme="dark"] block`);
  }
  
  // Check for apple-touch-icon
  if (!content.includes('apple-touch-icon')) {
    issues.push(`[Meta Issue] ${relativePath}: Missing apple-touch-icon`);
  }
  
  // Check for basic structure
  if (!content.includes('<html') || !content.includes('<head>') || !content.includes('<body>')) {
    issues.push(`[Structure Issue] ${relativePath}: Missing basic HTML tags`);
  }
});

if (issues.length === 0) {
  console.log('✅ ALL CLEAR: No structural or theme injection issues found across the codebase.');
} else {
  console.log('⚠️ ISSUES FOUND:');
  issues.forEach(i => console.log(i));
}
