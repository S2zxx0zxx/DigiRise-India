import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.resolve(__dirname, '../content/blog');
const OUTPUT_DIR = path.resolve(__dirname, '../src/pages/blog');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Build blog pages
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
const posts = [];

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const { data, content } = matter(fileContent);
  const htmlContent = marked(content);
  
  const slug = file.replace('.md', '');
  
  // Create full HTML template
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title} | DigiRise India</title>
  <meta name="description" content="${data.description}">
  <script type="module" src="/src/main.ts"></script>
  <!-- SEO tags go here -->
</head>
<body>
  <dr-header></dr-header>
  
  <main class="blog-post">
    <dr-blog-hero 
      title="${data.title}" 
      date="${data.date}" 
      author="${data.author}" 
      image="${data.image}"
    ></dr-blog-hero>
    
    <article class="prose">
      ${htmlContent}
    </article>
    
    <dr-blog-share url="https://digiriseindia.tech/blog/${slug}.html"></dr-blog-share>
  </main>

  <dr-footer></dr-footer>
</body>
</html>`;

  const outputPath = path.join(OUTPUT_DIR, `${slug}.html`);
  fs.writeFileSync(outputPath, fullHtml);
  
  posts.push({
    slug,
    ...data
  });
}

// Write the blog-posts.json registry
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
fs.writeFileSync(
  path.join(dataDir, 'blog-posts.json'), 
  JSON.stringify({ lastUpdated: new Date().toISOString(), posts }, null, 2)
);

console.log(`✅ Built ${posts.length} blog posts.`);
