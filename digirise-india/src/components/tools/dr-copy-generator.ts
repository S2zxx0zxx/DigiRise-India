class DrCopyGenerator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="tool-interface card">
        <form id="copy-form" class="copy-form">
          <div class="form-group full-width">
            <label for="product-name">Product/Service Name</label>
            <input type="text" id="product-name" required placeholder="e.g., DigiRise SEO Services" class="input-base">
          </div>
          <div class="form-group full-width">
            <label for="target-audience">Target Audience</label>
            <input type="text" id="target-audience" required placeholder="e.g., Local gym owners" class="input-base">
          </div>
          <div class="form-group full-width">
            <label for="key-benefit">Key Benefit / Offer</label>
            <textarea id="key-benefit" required placeholder="e.g., Rank #1 on Google Maps in 30 days or your money back" class="input-base" rows="3"></textarea>
          </div>
          <div class="form-group full-width mt-4">
            <button type="submit" class="btn btn-primary w-full" id="btn-generate">
              <span>Generate Copy</span>
              <i data-lucide="sparkles"></i>
            </button>
          </div>
        </form>

        <div id="copy-results" class="copy-results hidden mt-8">
          <h3 class="text-xl mb-4 border-b border-white/10 pb-2">Generated Ad Copies</h3>
          <div id="results-container" class="space-y-4">
            <!-- Results injected here -->
          </div>
        </div>
      </div>
    `;

    const form = this.querySelector('#copy-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generate();
    });
  }

  async generate() {
    const btn = this.querySelector('#btn-generate') as HTMLButtonElement;
    const btnText = btn.querySelector('span')!;
    const originalText = btnText.textContent;
    
    btn.disabled = true;
    btnText.textContent = 'Generating...';

    const payload = {
      productName: (this.querySelector('#product-name') as HTMLInputElement).value,
      targetAudience: (this.querySelector('#target-audience') as HTMLInputElement).value,
      keyBenefit: (this.querySelector('#key-benefit') as HTMLInputElement).value,
    };

    try {
      const response = await fetch('/api/tools/copy-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      
      const resultsDiv = this.querySelector('#copy-results')!;
      const container = this.querySelector('#results-container')!;
      
      resultsDiv.classList.remove('hidden');
      
      container.innerHTML = data.copies.map((copy: string) => `
        <div class="copy-card bg-surface p-4 rounded-md border border-white/5 relative group">
          <p class="whitespace-pre-wrap font-sans text-sm">${copy}</p>
          <button class="absolute top-2 right-2 p-2 bg-background/80 rounded opacity-0 group-hover:opacity-100 transition-opacity btn-copy" data-text="${encodeURIComponent(copy)}">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
        </div>
      `).join('');

      // @ts-ignore
      if (window.lucide) window.lucide.createIcons();
      
      container.querySelectorAll('.btn-copy').forEach(button => {
        button.addEventListener('click', (e) => {
          const text = decodeURIComponent((e.currentTarget as HTMLButtonElement).dataset.text!);
          navigator.clipboard.writeText(text);
          const icon = (e.currentTarget as HTMLButtonElement).querySelector('i');
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
      });

    } catch (e) {
      console.error(e);
      alert('Failed to generate copy. Please try again later.');
    } finally {
      btn.disabled = false;
      btnText.textContent = originalText;
    }
  }
}

customElements.define('dr-copy-generator', DrCopyGenerator);
