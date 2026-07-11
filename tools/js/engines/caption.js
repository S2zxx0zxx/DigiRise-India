// tools/js/engines/caption.js
window.DigiRiseEngines = window.DigiRiseEngines || {};
window.DigiRiseEngines['caption-length'] = {
  id: 'caption-length',
  name: 'Caption Check',
  icon: '✍️',
  
  renderInput(container, ctx) {
    container.innerHTML = `
      <div style="color:var(--muted); font-size:14px; margin-bottom:12px;">Paste your caption text below to check its length against social limits.</div>
    `;
  },
  
  async run(inputs, ctx) {
    const text = inputs.q;
    if (!text.trim()) throw new Error("Please enter some text.");
    
    const len = text.length;
    const words = text.trim().split(/\s+/).length;
    
    const platforms = [
      { name: 'Instagram', max: 2200, ideal: 150 },
      { name: 'X (Twitter)', max: 280, ideal: 100 },
      { name: 'LinkedIn', max: 3000, ideal: 200 },
      { name: 'Facebook', max: 63206, ideal: 120 }
    ];
    
    return { len, words, platforms };
  },
  
  renderResult(container, data, ctx) {
    let html = `
      <div style="margin-bottom:15px; font-size:14px;">
        <strong>Length:</strong> ${data.len} chars &nbsp;&bull;&nbsp; <strong>Words:</strong> ${data.words}
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
    `;
    
    data.platforms.forEach(p => {
      const remaining = p.max - data.len;
      const ok = remaining >= 0;
      const isIdeal = data.len <= p.ideal && data.len >= (p.ideal * 0.3); // Rough ideal range
      
      let badge = ok ? `<span style="color:#4ade80">Pass (${remaining} left)</span>` : `<span style="color:#ff5c5c">Fail (${Math.abs(remaining)} over)</span>`;
      
      html += `
        <div style="background:rgba(255,255,255,0.05); border-left:4px solid ${ok ? '#4ade80' : '#ff5c5c'}; padding:12px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700;">${p.name}</div>
            <div style="font-size:11px; color:var(--muted);">Max: ${p.max}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:14px; font-weight:600;">${badge}</div>
            ${ctx.isVerbose && isIdeal ? `<div style="font-size:11px; color:var(--accent); margin-top:4px;">✨ Ideal Length</div>` : ''}
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
    
    container.innerHTML = html;
  }
};
