import siteConfig from '../../../data/site-config.json';

class DrHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="glass" style="position: sticky; top: 0; z-index: var(--z-header); padding-block: var(--spacing-4);">
        <div class="container flex items-center justify-between">
          <a href="/" class="flex items-center gap-2" aria-label="DigiRise India Home">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span class="font-bold text-xl text-gradient">DigiRise India</span>
          </a>
          
          <nav class="flex gap-6 items-center" aria-label="Main navigation">
            <ul class="flex gap-6" style="display: none;" id="desktop-nav">
              <li><a href="/#services" class="font-medium hover-gold">Services</a></li>
              <li><a href="/#packages" class="font-medium hover-gold">Packages</a></li>
              <li><a href="/case-studies" class="font-medium hover-gold">Work</a></li>
              <li><a href="/blog" class="font-medium hover-gold">Blog</a></li>
            </ul>
            <a href="/audit" class="btn btn-primary">Get Free Audit</a>
            
            <button id="mobile-menu-btn" class="btn-secondary" aria-label="Toggle menu" style="padding: 0.5rem; display: block;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18"></path>
              </svg>
            </button>
          </nav>
        </div>
      </header>
    `;

    // Basic styling for the header links that isn't in utility classes
    const style = document.createElement('style');
    style.textContent = `
      .hover-gold { transition: color var(--transition-fast); }
      .hover-gold:hover { color: var(--color-accent-gold); }
      @media (min-width: 768px) {
        #desktop-nav { display: flex !important; }
        #mobile-menu-btn { display: none !important; }
      }
    `;
    this.appendChild(style);
  }
}

customElements.define('dr-header', DrHeader);
