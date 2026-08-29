import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
const industriesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'industries.json'), 'utf-8'));
const locationsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'locations.json'), 'utf-8'));

const industriesOutputDir = path.resolve(__dirname, '../src/pages/industries');
const locationsOutputDir = path.resolve(__dirname, '../src/pages/locations');

if (!fs.existsSync(industriesOutputDir)) fs.mkdirSync(industriesOutputDir, { recursive: true });
if (!fs.existsSync(locationsOutputDir)) fs.mkdirSync(locationsOutputDir, { recursive: true });

function generateHtml(title, description, contentHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | DigiRise India</title>
  <meta name="description" content="${description}">
  <script type="module" src="/src/main.ts"></script>
</head>
<body>
  <dr-header></dr-header>
  
  <main class="page-content">
    ${contentHtml}
  </main>

  <dr-footer></dr-footer>
</body>
</html>`;
}

// Build Industries
for (const ind of industriesData) {
  const content = `
    <dr-hero 
      headline="${ind.name} Digital Marketing Agency" 
      subheadline="${ind.description}" 
      cta-text="Get Your ${ind.name} Growth Audit" 
      cta-link="/audit/index.html">
    </dr-hero>
    <section class="container" style="padding: 4rem 1rem;">
      <h2 style="font-size: var(--text-2xl); color: var(--color-accent); margin-bottom: 2rem;">Why DigiRise for ${ind.name}?</h2>
      <p style="color: var(--color-text-muted); max-width: 800px; line-height: 1.6;">
        We specialize in scaling ${ind.name} businesses using data-driven performance marketing, SEO, and advanced automation. Our strategies are tailor-made for your industry to ensure maximum ROI and sustainable growth.
      </p>
      <div style="margin-top: 3rem;">
         <dr-btn href="/contact/index.html">Talk to an Expert</dr-btn>
      </div>
    </section>
  `;
  const html = generateHtml(`${ind.name} Digital Marketing`, ind.description, content);
  fs.writeFileSync(path.join(industriesOutputDir, `${ind.id}.html`), html);
}
console.log(`✅ Built ${industriesData.length} industry pages.`);

// Build Locations
for (const loc of locationsData) {
  const content = `
    <dr-hero 
      headline="Best Digital Marketing Agency in ${loc.name}" 
      subheadline="${loc.description}" 
      cta-text="Grow Your Business in ${loc.name}" 
      cta-link="/audit/index.html">
    </dr-hero>
    <section class="container" style="padding: 4rem 1rem;">
      <h2 style="font-size: var(--text-2xl); color: var(--color-accent); margin-bottom: 2rem;">Dominating the ${loc.name} Market</h2>
      <p style="color: var(--color-text-muted); max-width: 800px; line-height: 1.6;">
        We help businesses in ${loc.name} establish strong local dominance through hyper-local SEO, targeted Meta Ads, and robust branding. If you want to outrank your competitors in ${loc.name}, you're in the right place.
      </p>
      <div style="margin-top: 3rem;">
         <dr-btn href="/contact/index.html">Contact Our ${loc.name} Team</dr-btn>
      </div>
    </section>
  `;
  const html = generateHtml(`Digital Marketing Agency in ${loc.name}`, loc.description, content);
  fs.writeFileSync(path.join(locationsOutputDir, `${loc.id}.html`), html);
}
console.log(`✅ Built ${locationsData.length} location pages.`);
