interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  category?: string;
  image?: string;
}

class DrBlogList extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `<div class="loading-state">Loading latest insights...</div>`;
    
    try {
      const response = await fetch('/data/blog-posts.json');
      if (!response.ok) throw new Error('Failed to load blog posts');
      
      const { posts } = await response.json();
      
      if (posts.length === 0) {
        this.innerHTML = `<div class="empty-state">No posts published yet. Check back soon!</div>`;
        return;
      }

      this.innerHTML = `
        <div class="blog-grid">
          ${posts.map((post: BlogPost) => `
            <article class="blog-card">
              <a href="/blog/${post.slug}.html" class="blog-card-link">
                <div class="blog-card-image">
                  <img src="${post.image || '/assets/placeholder-blog.webp'}" alt="${post.title}" loading="lazy" />
                </div>
                <div class="blog-card-content">
                  <span class="blog-category">${post.category || 'Digital Marketing'}</span>
                  <h3 class="blog-title">${post.title}</h3>
                  <p class="blog-excerpt">${post.description}</p>
                  <div class="blog-meta">
                    <span class="blog-date">${new Date(post.date).toLocaleDateString()}</span>
                    <span class="blog-author">${post.author || 'Satyam Kumar'}</span>
                  </div>
                </div>
              </a>
            </article>
          `).join('')}
        </div>
      `;
    } catch (error) {
      this.innerHTML = `<div class="error-state">Error loading posts. Please try again later.</div>`;
      console.error(error);
    }
  }
}

customElements.define('dr-blog-list', DrBlogList);
