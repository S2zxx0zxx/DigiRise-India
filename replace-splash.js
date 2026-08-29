const fs = require('node:fs');
const path = require('node:path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat?.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}
const files = walk('c:/digiriseindia');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /<script>\s*\/\/\s*Hide splash[^]*?<\/script>/;
    if (regex.test(content)) {
        content = content.replace(regex, '<script src="/js/splash.js"></script>');
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
    }
});
