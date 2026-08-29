interface Metric {
  label: string;
  value: string;
}

interface CaseStudy {
  slug: string;
  clientName: string;
  industry: string;
  image?: string;
  metrics: Metric[];
}

class DrCaseStudiesList extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `<div class="loading-state">Loading case studies...</div>`;
    
    try {
      const response = await fetch('/data/case-studies.json');
      if (!response.ok) throw new Error('Failed to load case studies');
      
      const { caseStudies } = await response.json();
      
      this.innerHTML = `
        <div class="case-studies-grid">
          ${caseStudies.map((study: CaseStudy) => `
            <article class="case-study-card">
              <a href="/case-studies/${study.slug}.html" class="case-study-link">
                <div class="case-study-image">
                  <img src="${study.image || '/assets/placeholder-casestudy.webp'}" alt="${study.clientName}" loading="lazy" />
                </div>
                <div class="case-study-content">
                  <span class="case-study-industry">${study.industry}</span>
                  <h3 class="case-study-title">${study.clientName}</h3>
                  <div class="case-study-metrics">
                    ${study.metrics.map((metric: Metric) => `
                      <div class="metric">
                        <strong>${metric.value}</strong>
                        <span>${metric.label}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </a>
            </article>
          `).join('')}
        </div>
      `;
    } catch (error) {
      console.error(error);
      this.innerHTML = `<div class="error-state">Error loading case studies. Real data coming soon.</div>`;
    }
  }
}

customElements.define('dr-case-studies-list', DrCaseStudiesList);
