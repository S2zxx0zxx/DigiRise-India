// tools/js/engines/roi.js
window.DigiRiseEngines = window.DigiRiseEngines || {};
window.DigiRiseEngines['roi-calculator'] = {
  id: 'roi-calculator',
  name: 'ROI Calc',
  icon: '📈',
  
  renderInput(container, ctx) {
    container.innerHTML = `
      <div style="color:var(--muted); font-size:14px; margin-bottom:12px;">Format your prompt like: "Spend 50000, CPC 15, CVR 2%, AOV 1500"</div>
    `;
  },
  
  async run(inputs, ctx) {
    const q = inputs.q.toLowerCase();
    
    // Naive parsing -> strict numeric extraction
    const extract = (regex, fallback) => {
      const match = q.match(regex);
      return match ? parseFloat(match[1]) : fallback;
    };
    
    let spend = extract(/(?:spend|budget)[\s:=-]*(\d+)/, 0);
    let cpc = extract(/cpc[\s:=-]*(\d+(?:\.\d+)?)/, 0);
    let cvr = extract(/cvr[\s:=-]*(\d+(?:\.\d+)?)/, 0);
    let aov = extract(/aov[\s:=-]*(\d+)/, 0);
    
    if (!spend || !cpc || !cvr || !aov) {
      throw new Error("Missing parameters. Please specify Spend, CPC, CVR, and AOV (e.g. 'Spend 50000, CPC 15, CVR 2%, AOV 1500').");
    }
    
    // Mathematical constraints to prevent impossible scenarios
    spend = Math.max(100, spend); // Minimum spend 100
    cpc = Math.max(1, cpc); // Floor CPC at 1 (avoid infinity clicks)
    cvr = Math.min(100, Math.max(0.1, cvr)); // Cap CVR between 0.1% and 100%
    aov = Math.max(1, aov); // Floor AOV to 1
    
    const clicks = spend / cpc;
    const conversions = clicks * (cvr / 100);
    const revenue = conversions * aov;
    const roas = revenue / spend;
    const cpa = conversions > 0 ? (spend / conversions) : 0;
    const breakeven = aov; // Breakeven CPA = AOV
    
    return { spend, cpc, cvr, aov, clicks, conversions, revenue, roas, cpa, breakeven };
  },
  
  renderResult(container, data, ctx) {
    let roasClass = 'color:#ff5c5c';
    if (data.roas >= 3) {
      roasClass = 'color:#4ade80';
    } else if (data.roas >= 1.5) {
      roasClass = 'color:#f0a825';
    }
    
    let html = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; text-align:center;">
          <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">ROAS</div>
          <div style="font-size:24px; font-weight:700; ${roasClass}">${data.roas.toFixed(2)}x</div>
        </div>
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; text-align:center;">
          <div style="font-size:11px; color:var(--muted); text-transform:uppercase;">Revenue</div>
          <div style="font-size:24px; font-weight:700; color:#fff">₹${Math.floor(data.revenue).toLocaleString()}</div>
        </div>
      </div>
      <div style="font-size:13px; color:#aaa; text-align:center; background:rgba(255,255,255,0.02); padding:10px; border-radius:8px;">
        CPA: ₹${Math.floor(data.cpa).toLocaleString()} &nbsp;&bull;&nbsp; Break-even CPA: ₹${Math.floor(data.breakeven).toLocaleString()}
      </div>
    `;
    
    if (ctx.isVerbose) {
      const margin = (data.revenue - data.spend) / data.revenue * 100;
      html += `
        <div style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.05); border-left:3px solid var(--accent); font-size:13px;">
          <strong>Analysis:</strong> You are spending ₹${data.spend} to make ₹${Math.floor(data.revenue)}. Your gross margin (ad spend only) is ${margin.toFixed(1)}%. ${data.roas < 1.5 ? 'Warning: You are close to or losing money.' : 'Healthy return profile.'}
        </div>
      `;
    }
    
    container.innerHTML = html;
  }
};
