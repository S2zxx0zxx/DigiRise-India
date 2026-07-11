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
    
    // Naive parsing
    const extract = (regex, fallback) => {
      const match = q.match(regex);
      return match ? parseFloat(match[1]) : fallback;
    };
    
    const spend = extract(/(?:spend|budget)[\s:=-]*(\d+)/, 0);
    const cpc = extract(/cpc[\s:=-]*(\d+(?:\.\d+)?)/, 0);
    const cvr = extract(/cvr[\s:=-]*(\d+(?:\.\d+)?)/, 0);
    const aov = extract(/aov[\s:=-]*(\d+)/, 0);
    
    if (!spend || !cpc || !cvr || !aov) {
      throw new Error("Missing parameters. Please specify Spend, CPC, CVR, and AOV.");
    }
    
    const clicks = spend / cpc;
    const conversions = clicks * (cvr / 100);
    const revenue = conversions * aov;
    const roas = revenue / spend;
    const cpa = spend / conversions;
    const breakeven = aov;
    
    return { spend, cpc, cvr, aov, clicks, conversions, revenue, roas, cpa, breakeven };
  },
  
  renderResult(container, data, ctx) {
    let roasClass = data.roas >= 3 ? 'color:#4ade80' : data.roas >= 1.5 ? 'color:#f0a825' : 'color:#ff5c5c';
    
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
