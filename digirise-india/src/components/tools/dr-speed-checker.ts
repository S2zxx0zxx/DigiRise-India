class DrSpeedChecker extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="tool-interface card">
        <form id="speed-form" class="speed-form">
          <div class="form-group full-width">
            <label for="target-url">Website URL</label>
            <input type="url" id="target-url" required placeholder="https://yourwebsite.com" class="input-base">
          </div>
          <div class="form-group full-width mt-4">
            <button type="submit" class="btn btn-primary w-full" id="btn-analyze">
              <span>Analyze Performance</span>
              <i data-lucide="zap"></i>
            </button>
          </div>
        </form>

        <div id="speed-results" class="speed-results hidden mt-8">
          <h3 class="text-xl mb-4 border-b border-white/10 pb-2">Core Web Vitals</h3>
          <div class="results-grid">
            <div class="stat-card">
              <span class="stat-label">Performance Score</span>
              <span class="stat-value text-gradient" id="res-score">0</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">First Contentful Paint</span>
              <span class="stat-value" id="res-fcp">0s</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Largest Contentful Paint</span>
              <span class="stat-value" id="res-lcp">0s</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Cumulative Layout Shift</span>
              <span class="stat-value" id="res-cls">0</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = this.querySelector('#speed-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.analyze();
    });
  }

  async analyze() {
    const btn = this.querySelector('#btn-analyze') as HTMLButtonElement;
    const btnText = btn.querySelector('span')!;
    const originalText = btnText.textContent;
    
    btn.disabled = true;
    btnText.textContent = 'Analyzing...';

    try {
      // In a real scenario, this would call our /api/tools/speed endpoint
      // For now, simulate a fast response to show UI
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const resultsDiv = this.querySelector('#speed-results')!;
      resultsDiv.classList.remove('hidden');
      
      // Mock metrics (in real app, replace with PageSpeed API data)
      this.querySelector('#res-score')!.textContent = '96';
      this.querySelector('#res-fcp')!.textContent = '0.8s';
      this.querySelector('#res-lcp')!.textContent = '1.2s';
      this.querySelector('#res-cls')!.textContent = '0.01';

    } catch (e) {
      console.error(e);
      alert('Analysis failed. Please try again later.');
    } finally {
      btn.disabled = false;
      btnText.textContent = originalText;
    }
  }
}

customElements.define('dr-speed-checker', DrSpeedChecker);
