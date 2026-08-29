import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const OUTPUT_DIR = path.resolve(__dirname, '../public/meta');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const blogPostsPath = path.join(DATA_DIR, 'blog-posts.json');
if (!fs.existsSync(blogPostsPath)) {
  console.error('❌ blog-posts.json not found. Run build-blog.js first.');
  process.exit(1);
}

const { posts } = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));
const siteUrl = 'https://digiriseindia.tech';

let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>DigiRise India Blog</title>
  <link>${siteUrl}/blog/</link>
  <description>Digital Marketing & Business Growth Guides</description>
  <language>en-in</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;

for (const post of posts) {
  rss += `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${siteUrl}/blog/${post.slug}.html</link>
    <description><![CDATA[${post.description}]]></description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <category>${post.category}</category>
  </item>`;
}

rss += `
</channel>
</rss>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.xml'), rss);
console.log('✅ Built RSS feed at /meta/feed.xml');
