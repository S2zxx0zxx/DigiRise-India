// tools/js/engines/copy.js
window.DigiRiseEngines = window.DigiRiseEngines || {};
window.DigiRiseEngines['ad-copy-generator'] = {
  id: 'ad-copy-generator',
  name: 'Ad Copy Gen',
  icon: '📝',
  
  renderInput(container, ctx) {
    container.innerHTML = `
      <div style="color:var(--muted); font-size:14px; margin-bottom:12px;">Tell me what to write an ad for.</div>
      <div style="font-size:12px; color:#888;">Example: "Write a casual ad for a dentist in Mumbai offering free checkup"</div>
    `;
  },
  
  async run(inputs, ctx) {
    const q = inputs.q.toLowerCase();
    
    // Dummy parsing
    let industry = "business";
    if (q.includes('dentist') || q.includes('dental')) industry = 'dental clinic';
    else if (q.includes('gym') || q.includes('fitness')) industry = 'fitness center';
    else if (q.includes('real estate') || q.includes('property')) industry = 'real estate project';
    
    let tone = "Professional";
    if (q.includes('casual') || q.includes('hinglish')) tone = "Hinglish-casual";
    if (q.includes('urgent') || q.includes('sale')) tone = "Urgent";
    
    let city = "your city";
    if (q.includes('mumbai')) city = "Mumbai";
    if (q.includes('delhi')) city = "Delhi";
    
    let offer = "exclusive offer";
    if (q.includes('free checkup')) offer = "Free Checkup";
    if (q.includes('% off')) offer = q.match(/(\d+% off)/)[1];
    
    // Fetch patterns
    let patterns;
    try {
      const res = await fetch('/tools/data/copy-patterns.json');
      patterns = await res.json();
    } catch(e) {
      patterns = {
        "Professional": ["Experience the best {industry} in {city}. Get our {offer} today!"],
        "Hinglish-casual": ["Bhai {city} mein {industry} dhoondh rahe ho? Yeh {offer} miss mat karna!"],
        "Urgent": ["Limited time {offer}! Best {industry} in {city}. Book now!"]
      };
    }
    
    const selectedPatterns = patterns[tone] || patterns['Professional'];
    
    let numVariants = 1; // Standard
    if (ctx.mode === 'pro') numVariants = 3;
    if (ctx.mode === 'max') numVariants = 6;
    if (ctx.mode === 'kill') numVariants = 10;
    
    const shuffled = [...selectedPatterns].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numVariants);
    
    const generated = selected.map(p => {
      return p.replace(/{industry}/gi, industry)
              .replace(/{city}/gi, city)
              .replace(/{offer}/gi, offer);
    });
    
    return { generated, tone };
  },
  
  renderResult(container, data, ctx) {
    let html = `<div style="margin-bottom:10px; color:var(--muted); font-size:12px;">Tone: ${data.tone} | Generated: ${data.generated.length}</div>`;
    
    html += `<div style="display:flex; flex-direction:column; gap:10px;">`;
    data.generated.forEach((copy, idx) => {
      html += `
        <div class="copy-card" onclick="navigator.clipboard.writeText(this.innerText); alert('Copied!')" style="background:rgba(255,255,255,0.04); padding:15px; border-radius:12px; cursor:pointer; font-size:14px; line-height:1.5;">
          ${copy}
        </div>
      `;
    });
    html += `</div>`;
    
    if (ctx.isVerbose) {
      html += `<div style="margin-top:10px; font-size:12px; color:var(--accent);">Pro Tip: A/B test at least 3 variants simultaneously to find the winner.</div>`;
    }
    
    container.innerHTML = html;
  }
};
