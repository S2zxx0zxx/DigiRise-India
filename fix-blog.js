const fs = require('fs');
const path = require('path');

const blogDir = 'c:\\digiriseindia\\blog';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
files.push('category/meta-ads/index.html');
files.push('category/local-seo/index.html');
files.push('category/agency-capabilities/index.html');

for (const file of files) {
  const filePath = path.join(blogDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix relative CSS paths
    content = content.replace(/href="\.\.\/css\//g, 'href="/css/');
    content = content.replace(/href="\.\.\/\.\.\/\.\.\/css\//g, 'href="/css/');
    
    // Fix relative JS paths (in category pages)
    content = content.replace(/src="\.\.\/\.\.\/\.\.\/js\//g, 'src="/js/');

    // Append JS scripts to blog pages if missing
    if (!content.includes('src="/js/nextgen.js"')) {
      const scripts = `
<script src="/js/nextgen.js" defer></script>
<script src="/js/ios26.js" defer></script>
<script src="/js/pwa.js" defer></script>
</body>`;
      content = content.replace(/<\/body>/i, scripts);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
  }
}
