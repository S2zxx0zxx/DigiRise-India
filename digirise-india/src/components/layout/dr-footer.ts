import siteConfig from '../../../data/site-config.json';

class DrFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer style="background-color: var(--color-bg-secondary); border-top: 1px solid var(--color-border); padding-block: var(--spacing-16);">
        <div class="container grid gap-8 md:grid-cols-4">
          
          <!-- Brand -->
          <div class="flex flex-col gap-4">
            <span class="font-bold text-xl text-gradient">${siteConfig.name}</span>
            <p class="text-sm">${siteConfig.description}</p>
            <p class="text-sm text-muted">Kolkata, India</p>
          </div>

          <!-- Links -->
          <div class="flex flex-col gap-4">
            <h3 class="font-semibold text-lg text-white">Services</h3>
            <ul class="flex flex-col gap-2 text-sm text-secondary">
              <li><a href="/#services" class="hover-gold">Meta Ads</a></li>
              <li><a href="/#services" class="hover-gold">Web Design</a></li>
              <li><a href="/#services" class="hover-gold">SEO</a></li>
              <li><a href="/#services" class="hover-gold">AI Automation</a></li>
            </ul>
          </div>

          <!-- Resources -->
          <div class="flex flex-col gap-4">
            <h3 class="font-semibold text-lg text-white">Resources</h3>
            <ul class="flex flex-col gap-2 text-sm text-secondary">
              <li><a href="/blog" class="hover-gold">Blog</a></li>
              <li><a href="/case-studies" class="hover-gold">Case Studies</a></li>
              <li><a href="/tools" class="hover-gold">Free Tools</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="flex flex-col gap-4">
            <h3 class="font-semibold text-lg text-white">Contact</h3>
            <ul class="flex flex-col gap-2 text-sm text-secondary">
              <li><a href="mailto:${siteConfig.contact.email}" class="hover-gold">${siteConfig.contact.email}</a></li>
              <li>
                <div class="flex gap-4 mt-2">
                  <a href="${siteConfig.socials.linkedin}" target="_blank" rel="noopener noreferrer" class="hover-gold" aria-label="LinkedIn">LinkedIn</a>
                  <a href="${siteConfig.socials.instagram}" target="_blank" rel="noopener noreferrer" class="hover-gold" aria-label="Instagram">Instagram</a>
                </div>
              </li>
            </ul>
          </div>

        </div>
        <div class="container" style="margin-top: var(--spacing-12); padding-top: var(--spacing-6); border-top: 1px solid var(--color-border); text-align: center;">
          <p class="text-sm text-muted">© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</p>
        </div>
      </footer>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .text-muted { color: var(--color-text-muted); }
      .text-secondary { color: var(--color-text-secondary); }
      .text-white { color: var(--color-text-primary); }
      .hover-gold { transition: color var(--transition-fast); }
      .hover-gold:hover { color: var(--color-accent-gold); }
    `;
    this.appendChild(style);
  }
}

customElements.define('dr-footer', DrFooter);
