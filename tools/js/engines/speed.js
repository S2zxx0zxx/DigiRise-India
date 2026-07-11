// tools/js/engines/speed.js
window.DigiRiseEngines = window.DigiRiseEngines || {};
window.DigiRiseEngines['website-speed-checker'] = {
  id: 'website-speed-checker',
  name: 'Speed Checker',
  icon: '⚡',
  
  renderInput(container, ctx) {
    container.innerHTML = `
      <div style="color:var(--muted); font-size:14px; margin-bottom:12px;">Enter a URL to audit its Core Web Vitals, performance, and SEO.</div>
      <div style="display:flex; gap:10px; margin-bottom:10px;">
        <input type="url" id="eng-speed-url" class="cmd-input" placeholder="https://example.com" style="flex:1;">
        <button id="eng-speed-btn" class="cmd-submit" style="width:auto; padding:0 20px; border-radius:22px;">Audit</button>
      </div>
      <div id="eng-speed-strategy" style="display:flex; gap:10px; font-size:12px;">
        <label><input type="radio" name="eng-speed-strat" value="mobile" checked> Mobile</label>
        <label><input type="radio" name="eng-speed-strat" value="desktop"> Desktop</label>
      </div>
    `;
    
    // Auto-fill from command if any
    const inputEl = container.querySelector('#eng-speed-url');
    // We bind a local click handler to just trigger the workbench's command flow
    container.querySelector('#eng-speed-btn').addEventListener('click', () => {
      const url = inputEl.value;
      if (url) {
        // Trigger a fake submit on the workbench
        const wbInput = document.getElementById('cmdInput');
        if (wbInput) {
           wbInput.value = url;
           document.getElementById('cmdSubmit').click();
        }
      }
    });
  },
  
  async run(inputs, ctx) {
    let url = inputs.q.trim();
    if (!url) throw new Error("Enter a URL");
    if (!url.startsWith('http')) url = 'https://' + url;
    
    // In workbench, the strategy might be hard to read from the input card since it's already rendered.
    // Let's just use the context mode to decide.
    // Standard = Mobile only. Pro = Desktop. Kill = Both?
    // Let's default to mobile for simplicity unless ctx says otherwise.
    let strategy = 'mobile';
    
    const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=seo`;
    const res = await fetch(api);
    if (!res.ok) throw new Error('Google API Error ' + res.status);
    return await res.json();
  },
  
  renderResult(container, data, ctx) {
    const lh = data.lighthouseResult || {};
    const cats = lh.categories || {};
    const a = lh.audits || {};
    
    const sPerf = cats.performance ? Math.round(cats.performance.score * 100) : '—';
    const sSeo = cats.seo ? Math.round(cats.seo.score * 100) : '—';
    const sA11y = cats.accessibility ? Math.round(cats.accessibility.score * 100) : '—';
    
    const scoreClass = (s) => s >= 90 ? 'color:#4ade80' : s >= 50 ? 'color:#f0a825' : 'color:#ff5c5c';
    
    let html = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(120px, 1fr)); gap:15px; margin-bottom:20px;">
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; text-align:center;">
          <div style="font-size:12px; color:var(--muted);">Performance</div>
          <div style="font-size:28px; font-weight:700; ${scoreClass(sPerf)}">${sPerf}</div>
        </div>
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; text-align:center;">
          <div style="font-size:12px; color:var(--muted);">SEO</div>
          <div style="font-size:28px; font-weight:700; ${scoreClass(sSeo)}">${sSeo}</div>
        </div>
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; text-align:center;">
          <div style="font-size:12px; color:var(--muted);">Accessibility</div>
          <div style="font-size:28px; font-weight:700; ${scoreClass(sA11y)}">${sA11y}</div>
        </div>
      </div>
    `;
    
    // Verbose Agent output
    if (ctx.isVerbose) {
      const opps = Object.values(a)
        .filter(x => x.details && x.details.type === 'opportunity' && x.details.overallSavingsMs > 0)
        .sort((x,y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
        .slice(0, 5);
        
      if (opps.length) {
        html += `<div style="margin-bottom:10px; font-size:14px; font-weight:600;">Optimization Opportunities:</div>`;
        html += `<div style="display:flex; flex-direction:column; gap:8px;">`;
        opps.forEach(o => {
          html += `<div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:8px; display:flex; justify-content:space-between; font-size:13px;">
            <span>${o.title}</span> <span style="color:var(--accent)">-${(o.details.overallSavingsMs/1000).toFixed(1)}s</span>
          </div>`;
        });
        html += `</div>`;
      }
    }
    
    container.innerHTML = html;
  }
};
