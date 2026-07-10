const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    let dirPath = path.join(dir, file);
    if(fs.statSync(dirPath).isDirectory()) {
      if(file !== 'node_modules' && file !== '.git' && file !== '.gemini') {
        filelist = walkSync(dirPath, filelist);
      }
    } else {
      filelist.push(dirPath);
    }
  });
  return filelist;
};

// 1. Fix CSS
const cssFiles = walkSync('c:/digiriseindia').filter(f => f.endsWith('.css'));
cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;

  // Fix backdrop-filter ordering
  content = content.replace(/(backdrop-filter:[^;]+;\s*)(-webkit-backdrop-filter:[^;]+;)/g, '$2\n  $1');

  // Find standalone backdrop-filter and prepend -webkit-backdrop-filter
  content = content.replace(/(?<!-webkit-)(backdrop-filter:\s*([^;]+);)/g, (match, p1, p2) => {
    return `-webkit-backdrop-filter: ${p2}; ${p1}`;
  });

  if (content !== orig) {
    fs.writeFileSync(file, content);
  }
});

// 2. Fix HTML
const htmlFiles = walkSync('c:/digiriseindia').filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;

  // Add title to select elements if missing
  content = content.replace(/<select([^>]*?)>/g, (match, attrs) => {
    if (!attrs.includes('title=')) {
      return `<select${attrs} title="Select an option">`;
    }
    return match;
  });

  // Add apple-touch-icon to head if missing
  if (content.includes('<head>') && !content.includes('apple-touch-icon')) {
    content = content.replace(/<head>/, '<head>\n  <link rel="apple-touch-icon" href="https://digiriseindia.tech/apple-touch-icon.png">');
  }

  // Remove theme-color if present to fix the warning (optional, some browsers ignore it anyway, but user complained)
  // User complained: "'meta[name=theme-color]' is not supported by Firefox, Firefox for Android, Opera."
  // Actually, we can just leave theme-color or remove it. Let's just leave it since it's a minor warning, or remove it:
  // content = content.replace(/<meta name="theme-color"[^>]*>/g, '');

  if (content !== orig) {
    fs.writeFileSync(file, content);
  }
});

console.log('Linter fixes applied.');
