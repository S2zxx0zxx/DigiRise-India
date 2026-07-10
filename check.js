const fs=require('fs');
const c=fs.readFileSync('c:/digiriseindia/index.html','utf8');
const lt=c.match(/\[data-theme="light"\]\{([\s\S]*?)\}/);
const dt=c.match(/\[data-theme="dark"\]\{([\s\S]*?)\}/);
console.log('LIGHT:', lt[1]);
console.log('DARK:', dt[1]);
