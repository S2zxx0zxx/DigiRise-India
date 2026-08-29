class DrBlogHero extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const title = this.getAttribute('title') || 'Blog Post';
    const date = this.getAttribute('date') || '';
    const author = this.getAttribute('author') || 'Satyam Kumar';
    const image = this.getAttribute('image') || '/assets/placeholder-blog.webp';

    this.innerHTML = `
      <header class="blog-post-hero">
        <div class="container">
          <div class="blog-post-meta">
            <span class="blog-post-date">${new Date(date).toLocaleDateString()}</span>
            <span class="blog-post-author">By ${author}</span>
          </div>
          <h1 class="blog-post-title">${title}</h1>
          <div class="blog-post-image">
            <img src="${image}" alt="${title}" loading="eager" />
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('dr-blog-hero', DrBlogHero);

class DrBlogShare extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const url = this.getAttribute('url') || window.location.href;
    const encodedUrl = encodeURIComponent(url);
    
    this.innerHTML = `
      <div class="blog-share">
        <h3>Share this insight</h3>
        <div class="share-buttons">
          <a href="https://twitter.com/intent/tweet?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-icon">𝕏 Twitter</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-icon">in LinkedIn</a>
          <a href="https://wa.me/?text=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-icon">💬 WhatsApp</a>
        </div>
      </div>
    `;
  }
}

customElements.define('dr-blog-share', DrBlogShare);
