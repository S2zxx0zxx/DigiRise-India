// tools/js/engines/budget.js
window.DigiRiseEngines = window.DigiRiseEngines || {};
window.DigiRiseEngines['ad-budget-calculator'] = {
  id: 'ad-budget-calculator',
  name: 'Ad Budget Calc',
  icon: '💰',
  
  renderInput(container, ctx) {
    container.innerHTML = `
      <div style="color:var(--muted); font-size:14px; margin-bottom:12px;">Enter your budget amount. The tool will auto-detect context from your prompt or use defaults.</div>
      <div style="font-size:12px; color:#888;">Example: "10000 budget for business lead generation"</div>
    `;
  },
  
  async run(inputs, ctx) {
    // Extract numbers from the query
    const match = inputs.q.match(/\d+(?:,\d+)*(?:\.\d+)?/);
    let budget = match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    
    if (!budget || budget <= 0) throw new Error("Could not detect a valid budget amount in your command.");
    budget = Math.max(500, budget); // Enforce minimum budget of 500 INR
    
    // Fetch benchmarks
    let benchmarks;
    try {
      const res = await fetch('/tools/data/benchmarks.json');
      benchmarks = await res.json();
    } catch(e) {
      console.warn("Failed to fetch benchmarks, using fallback data:", e);
      // Fallback deterministic data if fetch fails
      benchmarks = {
        industries: [{ name: "Food & Sweets", cpc_range: [8, 15], cvr_range: [3.0, 5.5] }],
        goals: { "Leads": { cpc_multiplier: 1.5, cvr_multiplier: 1.0 } }
      };
    }
    
    // Auto-detect industry from query
    let indData = benchmarks.industries[0];
    const qLower = inputs.q.toLowerCase();
    for (let ind of benchmarks.industries) {
      if (qLower.includes(ind.name.toLowerCase().split(' ')[0])) {
        indData = ind; break;
      }
    }

    // Auto-detect goal
    let goalData = benchmarks.goals["Leads"] || { cpc_multiplier: 1.0, cvr_multiplier: 1.0 };
    if (qLower.includes("sales") || qLower.includes("ecom")) {
      goalData = benchmarks.goals["Sales"] || goalData;
    } else if (qLower.includes("awareness") || qLower.includes("reach")) {
      goalData = benchmarks.goals["Awareness"] || goalData;
    }
    
    let avgCpc = (indData.cpc_range[0] + indData.cpc_range[1]) / 2;
    let avgCvr = (indData.cvr_range[0] + indData.cvr_range[1]) / 2;
    
    // Apply multipliers
    avgCpc *= goalData.cpc_multiplier;
    avgCvr *= goalData.cvr_multiplier;

    // Strict mathematical bounds
    avgCpc = Math.max(1, avgCpc);
    avgCvr = Math.min(100, Math.max(0.1, avgCvr));
    
    const clicks = Math.floor(budget / avgCpc);
    const conversions = Math.floor(clicks * (avgCvr / 100));
    const cpa = conversions > 0 ? (budget / conversions) : 0;
    
    return { budget, clicks, conversions, avgCpc, cpa };
  },
  
  renderResult(container, data, ctx) {
    let html = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; text-align:center;">
          <div style="font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:1px;">Est. Clicks</div>
          <div style="font-size:24px; font-weight:700;">${data.clicks.toLocaleString()}</div>
        </div>
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; text-align:center;">
          <div style="font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:1px;">Est. Conversions</div>
          <div style="font-size:24px; font-weight:700; color:var(--accent)">${data.conversions.toLocaleString()}</div>
        </div>
      </div>
      <div style="font-size:13px; color:#aaa; text-align:center;">
        Avg CPC: ₹${data.avgCpc.toFixed(2)} &nbsp;&bull;&nbsp; Target CPA: ₹${data.cpa > 0 ? data.cpa.toFixed(0) : 'N/A'}
      </div>
    `;
    
    if (ctx.isVerbose) {
      html += `
        <div style="margin-top:15px; padding:12px; background:rgba(240,168,37,0.1); border:1px solid rgba(240,168,37,0.3); border-radius:8px; font-size:13px; color:#eee;">
          <strong>Agent Tip:</strong> To improve these numbers, focus on increasing your landing page conversion rate. A 1% increase in CVR could yield ${Math.floor(data.clicks * ((3+1)/100)) - data.conversions} more conversions for the same ₹${data.budget} spend.
        </div>
      `;
    }
    
    container.innerHTML = html;
  }
};
