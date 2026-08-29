class DrMetaTagGenerator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="tool-interface card">
        <form id="meta-form" class="meta-form">
          <div class="form-group full-width">
            <label for="page-title">Page Title</label>
            <input type="text" id="page-title" required placeholder="e.g., Best Digital Marketing Agency in India" class="input-base">
            <div class="char-count text-sm text-text-muted mt-1"><span id="title-count">0</span> / 60 characters</div>
          </div>
          <div class="form-group full-width">
            <label for="page-description">Page Description</label>
            <textarea id="page-description" required placeholder="e.g., We help local businesses scale..." class="input-base" rows="3"></textarea>
            <div class="char-count text-sm text-text-muted mt-1"><span id="desc-count">0</span> / 160 characters</div>
          </div>
          <div class="form-group full-width">
            <label for="page-url">Page URL</label>
            <input type="url" id="page-url" placeholder="https://example.com" class="input-base">
          </div>
          <div class="form-group full-width">
            <label for="page-image">Social Image URL</label>
            <input type="url" id="page-image" placeholder="https://example.com/og-image.jpg" class="input-base">
          </div>
          <div class="form-group full-width mt-4">
            <button type="submit" class="btn btn-primary w-full" id="btn-generate">Generate Meta Tags</button>
          </div>
        </form>

        <div id="meta-results" class="meta-results hidden mt-8">
          <h3 class="text-xl mb-4 border-b border-white/10 pb-2">Your HTML Meta Tags</h3>
          <div class="relative group">
            <pre class="bg-background/50 p-4 rounded-md overflow-x-auto text-sm text-white/80 border border-white/5"><code id="code-output"></code></pre>
            <button class="absolute top-2 right-2 p-2 bg-background/80 rounded opacity-0 group-hover:opacity-100 transition-opacity btn-copy">
              <i data-lucide="copy" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    const titleInput = this.querySelector('#page-title') as HTMLInputElement;
    const descInput = this.querySelector('#page-description') as HTMLTextAreaElement;
    
    titleInput.addEventListener('input', () => {
      const count = titleInput.value.length;
      const counter = this.querySelector('#title-count')!;
      counter.textContent = count.toString();
      counter.parentElement!.style.color = count > 60 ? 'var(--color-error)' : 'var(--color-text-muted)';
    });

    descInput.addEventListener('input', () => {
      const count = descInput.value.length;
      const counter = this.querySelector('#desc-count')!;
      counter.textContent = count.toString();
      counter.parentElement!.style.color = count > 160 ? 'var(--color-error)' : 'var(--color-text-muted)';
    });

    const form = this.querySelector('#meta-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generate();
    });
    
    const copyBtn = this.querySelector('.btn-copy') as HTMLButtonElement;
    copyBtn.addEventListener('click', () => {
      const text = this.querySelector('#code-output')!.textContent || '';
      navigator.clipboard.writeText(text);
      const icon = copyBtn.querySelector('i');
      if (icon) {
        icon.dataset.lucide = 'check';
        // @ts-ignore
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          icon.dataset.lucide = 'copy';
          // @ts-ignore
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      }
    });
  }

  generate() {
    const title = (this.querySelector('#page-title') as HTMLInputElement).value;
    const desc = (this.querySelector('#page-description') as HTMLTextAreaElement).value;
    const url = (this.querySelector('#page-url') as HTMLInputElement).value || 'https://example.com';
    const image = (this.querySelector('#page-image') as HTMLInputElement).value || 'https://example.com/image.jpg';

    const tags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${desc}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${image}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${desc}" />
<meta property="twitter:image" content="${image}" />`;

    this.querySelector('#code-output')!.textContent = tags;
    this.querySelector('#meta-results')!.classList.remove('hidden');
  }
}

customElements.define('dr-meta-tag-generator', DrMetaTagGenerator);
