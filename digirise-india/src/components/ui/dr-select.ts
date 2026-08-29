class DrSelect extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || '';
    const label = this.getAttribute('label') || '';
    const required = this.hasAttribute('required') ? 'required' : '';
    
    // Collect options from the light DOM before overwriting
    const options = Array.from(this.querySelectorAll('option')).map(opt => ({
      value: opt.value,
      text: opt.textContent
    }));

    this.innerHTML = `
      <div class="dr-select-container flex flex-col gap-2">
        ${label ? `<label class="font-medium text-sm" for="${name}">${label}</label>` : ''}
        <div class="select-wrapper">
          <select id="${name}" name="${name}" ${required} class="dr-select">
            ${options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
          </select>
          <div class="select-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .select-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }
      .dr-select {
        width: 100%;
        appearance: none;
        background-color: var(--color-bg-elevated);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-3) var(--spacing-4);
        padding-right: var(--spacing-12);
        color: var(--color-text-primary);
        font-size: 1rem;
        transition: all var(--transition-fast);
      }
      .dr-select:focus {
        outline: none;
        border-color: var(--color-accent-gold);
        box-shadow: 0 0 0 2px var(--color-accent-gold-glow);
      }
      .select-icon {
        position: absolute;
        right: var(--spacing-4);
        pointer-events: none;
        color: var(--color-text-secondary);
      }
    `;
    this.appendChild(style);
  }
}

customElements.define('dr-select', DrSelect);
