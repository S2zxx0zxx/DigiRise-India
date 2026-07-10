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

const htmlFiles = walkSync('c:/digiriseindia').filter(f => f.endsWith('.html'));

const correctThemes = `:root{
  --gold:#b87b0a; --gold-mid:#d4920c; --gold-light:#f0a825;
  --gold-pale:rgba(184, 123, 10, 0.08); --gold-pale2:rgba(184, 123, 10, 0.14);
  --bg:#f7f2e9; --bg2:#efe8db; --bg3:#e7ddcc;
  --card:#fdfaf4; --white:#ffffff;
  --shadow:rgba(26, 26, 26, 0.08);
  --border:rgba(0, 0, 0, 0.08); --border2:rgba(0,0,0,0.05); --divider:rgba(0,0,0,0.07);
  --text:#1a1409; --text2:#3c3020; --muted:#6f5d42; --muted2:#907d5f;
  --green:#16803c; --blue:#1d4ed8; --red:#b91c1c;
  --hard-border:#1a1a1a; --hard-shadow:rgba(26,26,26,0.35); --hard-border-hover:#000;
  --mesh1:rgba(0,0,0,0.03); --mesh2:rgba(0,0,0,0.02); --mesh3:rgba(184,80,10,0.12);
}
[data-theme="dark"]{
  --gold:#f2f2f2; --gold-mid:#ffffff; --gold-light:#ffffff;
  --gold-pale:rgba(255, 255, 255,0.08); --gold-pale2:rgba(255, 255, 255,0.16);
  --bg:#050505; --bg2:#0d0d0d; --bg3:#161616;
  --card:#101010; --white:#101010;
  --shadow:rgba(0,0,0,0.5);
  --border:rgba(255, 255, 255,0.06); --border2:rgba(255,255,255,0.03); --divider:rgba(255,255,255,0.06);
  --text:#ffffff; --text2:#e6e6e6; --muted:#a3a3a3; --muted2:#7a7a7a;
  --green:#22c55e; --blue:#60a5fa; --red:#f87171;
  --hard-border:#333333; --hard-shadow:rgba(0,0,0,0.45); --hard-border-hover:#ffffff;
  --mesh1:rgba(255, 255, 255,0.08); --mesh2:rgba(200, 200, 200,0.05); --mesh3:rgba(255,255,255,0.08);
}`;

let count = 0;
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;

  // Replace \r\n with \n
  content = content.replace(/\\r\\n/g, '\\n');

  content = content.replace(/:root\s*\{[\s\S]*?\[data-theme="dark"\]\s*\{[\s\S]*?\}(?=\s*\*\{margin:0)/, correctThemes);

  // Restore .addon-card.featured styles
  content = content.replace(/\.addon-card\.featured\{grid-column:1\/-1;display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;background:linear-gradient\(135deg,#161616 0%,#1c1c1c 100%\);border-color:#ffffff;box-shadow:4px 4px 0 #ffffff;\}/, 
    '.addon-card.featured{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;background:linear-gradient(135deg,#161616 0%,#1c1c1c 100%);border-color:var(--gold);box-shadow:4px 4px 0 var(--gold);}');
  
  // Restore .addon-card.featured .addon-btn
  content = content.replace(/\.addon-card\.featured \.addon-btn\{background:linear-gradient\(135deg,#ffffff,#c9c9c9\);color:#0a0a0a;border-color:#161616;\}/,
    '.addon-card.featured .addon-btn{background:linear-gradient(135deg,var(--gold-mid),var(--gold));color:var(--bg);border-color:var(--card);}');

  // Restore .addon-card.featured::before
  content = content.replace(/\.addon-card\.featured::before\{background:linear-gradient\(90deg,#ffffff,#c9c9c9,#ffffff\);\}/,
    '.addon-card.featured::before{background:linear-gradient(90deg,var(--gold-light),var(--gold-mid),var(--gold));}');

  if(content !== orig) {
    fs.writeFileSync(file, content);
    count++;
  }
});
console.log('Fixed themes in ' + count + ' files');
