import { calculateROI } from '../../lib/tools/roi';

class DrRoiCalculator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="tool-interface card">
        <form id="roi-form" class="roi-form grid-cols-2">
          <div class="form-group">
            <label for="ad-spend">Monthly Ad Spend (₹)</label>
            <input type="number" id="ad-spend" min="0" required value="10000" class="input-base">
          </div>
          <div class="form-group">
            <label for="leads">Estimated Leads</label>
            <input type="number" id="leads" min="0" required value="100" class="input-base">
          </div>
          <div class="form-group">
            <label for="closing-rate">Closing Rate (%)</label>
            <input type="number" id="closing-rate" min="0" max="100" required value="10" class="input-base">
          </div>
          <div class="form-group">
            <label for="ltv">Customer Lifetime Value (₹)</label>
            <input type="number" id="ltv" min="0" required value="5000" class="input-base">
          </div>
          <div class="form-group full-width mt-4">
            <button type="submit" class="btn btn-primary w-full">Calculate ROI</button>
          </div>
        </form>

        <div id="roi-results" class="roi-results hidden mt-8">
          <h3 class="text-xl mb-4">Your Projection</h3>
          <div class="results-grid">
            <div class="stat-card">
              <span class="stat-label">Cost Per Lead</span>
              <span class="stat-value" id="res-cpl">₹0</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">New Customers</span>
              <span class="stat-value" id="res-customers">0</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Revenue</span>
              <span class="stat-value" id="res-revenue">₹0</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Net Profit</span>
              <span class="stat-value" id="res-profit" data-color="neutral">₹0</span>
            </div>
            <div class="stat-card full-width bg-surface text-center p-6">
              <span class="stat-label">Return on Ad Spend (ROAS)</span>
              <span class="stat-value text-3xl text-gradient" id="res-roas">0x</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = this.querySelector('#roi-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.calculate();
    });
  }

  calculate() {
    const spend = Number((this.querySelector('#ad-spend') as HTMLInputElement).value);
    const leads = Number((this.querySelector('#leads') as HTMLInputElement).value);
    const closingRate = Number((this.querySelector('#closing-rate') as HTMLInputElement).value);
    const ltv = Number((this.querySelector('#ltv') as HTMLInputElement).value);

    try {
      const result = calculateROI(spend, leads, closingRate, ltv);
      
      this.querySelector('#roi-results')!.classList.remove('hidden');
      this.querySelector('#res-cpl')!.textContent = `₹${result.costPerLead.toFixed(2)}`;
      this.querySelector('#res-customers')!.textContent = result.customers.toString();
      this.querySelector('#res-revenue')!.textContent = `₹${result.revenue.toLocaleString()}`;
      
      const profitEl = this.querySelector('#res-profit') as HTMLElement;
      profitEl.textContent = `₹${result.profit.toLocaleString()}`;
      profitEl.dataset.color = result.isProfitable ? 'success' : 'error';
      
      this.querySelector('#res-roas')!.textContent = `${result.roas}x`;

    } catch (e) {
      console.error(e);
      alert('Please enter valid positive numbers');
    }
  }
}

customElements.define('dr-roi-calculator', DrRoiCalculator);
