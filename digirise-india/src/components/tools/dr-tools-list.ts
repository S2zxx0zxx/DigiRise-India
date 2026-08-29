interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  badge?: string;
}

class DrToolsList extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `<div class="loading-state">Loading tools...</div>`;
    
    try {
      const response = await fetch('/data/tools-registry.json');
      if (!response.ok) throw new Error('Failed to load tools registry');
      
      const { tools } = await response.json();
      
      this.innerHTML = `
        <div class="tools-grid">
          ${tools.map((tool: Tool) => `
            <a href="${tool.path}" class="tool-card">
              <div class="tool-icon">
                <i data-lucide="${tool.icon}"></i>
                ${tool.badge ? `<span class="tool-badge">${tool.badge}</span>` : ''}
              </div>
              <h3 class="tool-title">${tool.name}</h3>
              <p class="tool-desc">${tool.description}</p>
            </a>
          `).join('')}
        </div>
      `;
      
      // Initialize icons if Lucide is loaded globally
      // @ts-ignore
      if (window.lucide) window.lucide.createIcons();

    } catch (error) {
      console.error(error);
      this.innerHTML = `<div class="error-state">Error loading tools. Please try again later.</div>`;
    }
  }
}

customElements.define('dr-tools-list', DrToolsList);
