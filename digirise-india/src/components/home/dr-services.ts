import servicesData from '../../../data/services.json';

class DrServices extends HTMLElement {
  connectedCallback() {
    const servicesHtml = servicesData.map((service, index) => `
      <div class="card animate-on-scroll delay-${(index % 3) * 100} flex flex-col gap-4">
        <div class="icon-wrapper">
          <!-- Mapping icon names to SVG (Using basic inline SVGs for the icons defined in data) -->
          ${this.getIconSvg(service.icon)}
        </div>
        <h3 class="text-xl font-bold">${service.title}</h3>
        <p class="text-sm">${service.description}</p>
        <ul class="flex flex-col gap-2 mt-auto pt-4 border-t border-muted">
          ${service.details.map(detail => `
            <li class="flex items-center gap-2 text-sm text-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>
              ${detail}
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');

    this.innerHTML = `
      <section id="services" class="section" style="background-color: var(--color-bg-primary);">
        <div class="container flex flex-col gap-12">
          
          <div class="text-center flex flex-col items-center gap-4 animate-on-scroll">
            <span class="badge">Our Services</span>
            <h2>How We Drive <span class="text-gradient">Growth</span></h2>
            <p>End-to-end digital marketing solutions tailored for ROI.</p>
          </div>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            ${servicesHtml}
          </div>
          
        </div>
      </section>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-lg);
        background: rgba(240, 168, 37, 0.1);
        color: var(--color-accent-gold);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .border-t { border-top: 1px solid var(--color-border); }
    `;
    this.appendChild(style);
  }

  getIconSvg(name: string) {
    const icons: Record<string, string> = {
      'target': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
      'monitor-smartphone': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
      'search': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
      'bot': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>'
    };
    return icons[name] || icons['target'];
  }
}

customElements.define('dr-services', DrServices);
