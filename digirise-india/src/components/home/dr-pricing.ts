import pricingData from '../../../data/pricing.json';

class DrPricing extends HTMLElement {
  connectedCallback() {
    const pricingHtml = pricingData.map((plan, index) => `
      <div class="card flex flex-col gap-6 animate-on-scroll delay-${(index % 3) * 100} ${plan.popular ? 'popular-plan' : ''}">
        ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
        
        <div>
          <h3 class="text-xl font-bold">${plan.name}</h3>
          <p class="text-sm text-secondary mt-2">${plan.description}</p>
        </div>
        
        <div class="flex items-baseline gap-1">
          <span class="text-4xl font-display font-bold text-white">${plan.price}</span>
          <span class="text-muted text-sm">${plan.period}</span>
        </div>
        
        <ul class="flex flex-col gap-3 grow">
          ${plan.features.map(feature => `
            <li class="flex items-start gap-2 text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><path d="M20 6L9 17l-5-5"></path></svg>
              <span>${feature}</span>
            </li>
          `).join('')}
        </ul>
        
        <a href="#contact" class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} w-full mt-4">${plan.cta}</a>
      </div>
    `).join('');

    this.innerHTML = `
      <section id="packages" class="section" style="background-color: var(--color-bg-secondary);">
        <div class="container flex flex-col gap-12">
          
          <div class="text-center flex flex-col items-center gap-4 animate-on-scroll">
            <span class="badge">Pricing Plans</span>
            <h2>Transparent <span class="text-gradient">Investment</span></h2>
            <p>No hidden fees. Just clear deliverables and predictable growth.</p>
          </div>

          <div class="grid gap-8 md:grid-cols-3" style="max-width: 1000px; margin-inline: auto; align-items: center;">
            ${pricingHtml}
          </div>
          
        </div>
      </section>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .popular-plan {
        border-color: var(--color-accent-gold);
        box-shadow: 0 0 20px var(--color-accent-gold-glow);
        transform: scale(1.05);
        z-index: 10;
        position: relative;
        background-color: var(--color-bg-primary);
      }
      .popular-badge {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-accent-gold);
        color: var(--color-bg-primary);
        padding: 4px 12px;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .w-full { width: 100%; text-align: center; justify-content: center; }
      @media (max-width: 768px) {
        .popular-plan {
          transform: none;
        }
      }
    `;
    this.appendChild(style);
  }
}

customElements.define('dr-pricing', DrPricing);
