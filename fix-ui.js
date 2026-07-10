const fs = require('fs');

['c:\\digiriseindia\\index.html', 'c:\\digiriseindia\\tools\\index.html', 'c:\\digiriseindia\\tools\\ad-budget-calculator\\index.html', 'c:\\digiriseindia\\tools\\ad-copy-generator\\index.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let t = fs.readFileSync(f, 'utf8');
    if (!t.includes('ui-dropdown.js')) {
      fs.writeFileSync(f, t.replace(/<\/body>/i, '<script src="/js/ui-dropdown.js" defer></script>\n</body>'));
      console.log('Fixed', f);
    }
  }
});
