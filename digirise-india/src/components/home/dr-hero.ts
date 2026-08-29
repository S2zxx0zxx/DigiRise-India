class DrHero extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="section flex items-center justify-center" style="min-height: 80vh; position: relative; overflow: hidden;">
        <!-- Background elements -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; background: radial-gradient(circle, var(--color-accent-gold-glow) 0%, transparent 70%); z-index: -1; filter: blur(60px); pointer-events: none;"></div>
        
        <div class="container text-center flex flex-col items-center gap-6 z-10 animate-fade-in">
          <span class="badge animate-slide-up">Premium Digital Growth Partner</span>
          
          <h1 class="animate-slide-up delay-100" style="max-width: 20ch; margin-inline: auto;">
            Scale Your Business With <span class="text-gradient">Performance Marketing</span>
          </h1>
          
          <p class="text-lg animate-slide-up delay-200" style="max-width: 60ch; margin-inline: auto;">
            We build high-converting websites and run data-driven Meta Ads to turn clicks into predictable revenue for Indian businesses.
          </p>
          
          <div class="flex gap-4 mt-4 animate-slide-up delay-300">
            <a href="/audit" class="btn btn-primary btn-lg">Get Your Free Audit</a>
            <a href="#services" class="btn btn-secondary btn-lg">Explore Services</a>
          </div>
          
          <!-- Trust indicators -->
          <div class="mt-12 pt-8 flex gap-8 justify-center items-center opacity-70 animate-slide-up delay-300" style="border-top: 1px solid var(--color-border); width: 100%; max-width: 600px; flex-wrap: wrap;">
            <div class="flex flex-col items-center">
              <span class="font-bold text-xl text-white">25+</span>
              <span class="text-xs text-muted uppercase tracking-wider">Clients</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-bold text-xl text-white">₹1M+</span>
              <span class="text-xs text-muted uppercase tracking-wider">Ad Spend Managed</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-bold text-xl text-white">10k+</span>
              <span class="text-xs text-muted uppercase tracking-wider">Leads Generated</span>
            </div>
          </div>
        </div>
      </section>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .btn-lg {
        padding: var(--spacing-4) var(--spacing-8);
        font-size: 1.125rem;
      }
      .tracking-wider { letter-spacing: 0.05em; }
    `;
    this.appendChild(style);
  }
}

customElements.define('dr-hero', DrHero);
