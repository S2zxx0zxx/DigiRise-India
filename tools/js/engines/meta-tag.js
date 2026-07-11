// tools/js/engines/meta-tag.js
window.DigiRiseEngines = window.DigiRiseEngines || {};
window.DigiRiseEngines['meta-tag-analyzer'] = {
  id: 'meta-tag-analyzer',
  name: 'Meta Tag Analyzer',
  icon: '🔍',
  
  renderInput(container, ctx) {
    container.innerHTML = `
      <div style="color:var(--muted); font-size:14px; margin-bottom:12px;">Enter a URL to analyze its SEO Meta Tags.</div>
      <div style="font-size:12px; color:#888; margin-bottom:10px;">Note: Some sites block direct checks (CORS). If it fails, try pasting HTML.</div>
    `;
  },
  
  async run(inputs, ctx) {
    let q = inputs.q.trim();
    if (!q) throw new Error("Enter a URL or HTML snippet.");
    
    let htmlStr = q;
    let url = "";
    
    // If it looks like a URL, fetch it
    if (q.startsWith('http') || q.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ix)) {
      url = q.startsWith('http') ? q : 'https://' + q;
      try {
        const res = await fetch(url);
        htmlStr = await res.text();
      } catch(e) {
        throw new Error("Could not fetch URL due to CORS or network error. Please paste the HTML source code instead.");
      }
    }
    
    // Parse HTML string using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, "text/html");
    
    const title = doc.title || '';
    const getMeta = (name) => {
      const tag = doc.querySelector(`meta[name="${name}" i], meta[property="${name}" i]`);
      return tag ? tag.getAttribute('content') : '';
    };
    
    return {
      title,
      description: getMeta('description'),
      ogTitle: getMeta('og:title'),
      ogDescription: getMeta('og:description'),
      ogImage: getMeta('og:image'),
      url
    };
  },
  
  renderResult(container, data, ctx) {
    const titleLen = data.title.length;
    const descLen = data.description.length;
    
    const titleOk = titleLen >= 50 && titleLen <= 60;
    const descOk = descLen >= 150 && descLen <= 160;
    
    const statusChip = (ok, len, target) => `
      <span style="font-size:11px; padding:2px 6px; border-radius:4px; background:${ok ? 'rgba(74,222,128,0.2)' : 'rgba(255,92,92,0.2)'}; color:${ok ? '#4ade80' : '#ff5c5c'}">
        ${len} chars (Target: ${target})
      </span>
    `;
    
    let html = `
      <div style="display:flex; flex-direction:column; gap:15px;">
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px;">
          <div style="font-size:12px; color:var(--muted); margin-bottom:5px; display:flex; justify-content:space-between;">
            <span>Title Tag</span> ${statusChip(titleOk, titleLen, '50-60')}
          </div>
          <div style="font-size:16px; font-weight:600;">${data.title || 'Missing'}</div>
        </div>
        
        <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px;">
          <div style="font-size:12px; color:var(--muted); margin-bottom:5px; display:flex; justify-content:space-between;">
            <span>Meta Description</span> ${statusChip(descOk, descLen, '150-160')}
          </div>
          <div style="font-size:14px; line-height:1.5;">${data.description || 'Missing'}</div>
        </div>
        
        <div style="background:rgba(255,255,255,0.02); padding:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.05);">
          <div style="font-size:12px; color:var(--muted); margin-bottom:10px;">Google SERP Preview</div>
          <div style="font-family: Arial, sans-serif;">
            <div style="font-size:14px; color:#bdc1c6; margin-bottom:2px;">${data.url || 'example.com'}</div>
            <div style="font-size:20px; color:#8ab4f8; margin-bottom:3px; cursor:pointer; text-decoration:none;">${data.title || 'Page Title'}</div>
            <div style="font-size:14px; color:#bdc1c6; line-height:1.58;">${data.description || 'Provide a meta description to help search engines understand your page...'}</div>
          </div>
        </div>
      </div>
    `;
    
    if (ctx.isVerbose && data.ogImage) {
      html += `
        <div style="margin-top:15px; background:rgba(255,255,255,0.02); padding:15px; border-radius:12px;">
          <div style="font-size:12px; color:var(--muted); margin-bottom:5px;">Open Graph Image</div>
          <img src="${data.ogImage}" style="max-width:100%; border-radius:8px;" onerror="this.style.display='none'">
        </div>
      `;
    }
    
    container.innerHTML = html;
  }
};
