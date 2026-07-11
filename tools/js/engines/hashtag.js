// tools/js/engines/hashtag.js
window.DigiRiseEngines = window.DigiRiseEngines || {};
window.DigiRiseEngines['hashtag-generator'] = {
  id: 'hashtag-generator',
  name: 'Hashtags',
  icon: '#️⃣',
  
  renderInput(container, ctx) {
    container.innerHTML = `
      <div style="color:var(--muted); font-size:14px; margin-bottom:12px;">Enter your niche (e.g., fashion, tech, real estate).</div>
    `;
  },
  
  async run(inputs, ctx) {
    const q = inputs.q.toLowerCase();
    
    let db;
    try {
      const res = await fetch('/tools/data/hashtags.json');
      db = await res.json();
    } catch(e) {
      db = {
        "fashion": ["#ootd", "#fashionblogger", "#style", "#fashionista", "#instafashion", "#streetstyle", "#vintage", "#outfit"],
        "tech": ["#tech", "#technology", "#coding", "#developer", "#programming", "#innovation", "#software", "#ai"],
        "real estate": ["#realestate", "#realtor", "#property", "#home", "#investment", "#architecture", "#forsale", "#luxuryrealestate"]
      };
    }
    
    // Find closest match
    let matchedNiche = Object.keys(db).find(k => q.includes(k));
    if (!matchedNiche) {
      // Return generic if no match
      matchedNiche = "generic";
      db["generic"] = ["#trending", "#viral", "#foryou", "#explorepage", "#instagood", "#marketing", "#business", "#growth"];
    }
    
    let count = 5; // 2026 IG best practice
    if (ctx.mode === 'pro') count = 15;
    if (ctx.mode === 'max') count = 30;
    
    const pool = db[matchedNiche];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    
    return { niche: matchedNiche, tags: selected };
  },
  
  renderResult(container, data, ctx) {
    const text = data.tags.join(" ");
    
    let html = `
      <div style="font-size:12px; color:var(--muted); margin-bottom:10px;">Found ${data.tags.length} tags for "${data.niche}"</div>
      <div class="copy-card" onclick="navigator.clipboard.writeText(this.innerText); alert('Copied!')" style="background:rgba(255,255,255,0.04); padding:15px; border-radius:12px; cursor:pointer; font-size:14px; line-height:1.6; color:var(--accent);">
        ${text}
      </div>
    `;
    
    if (ctx.isVerbose) {
      html += `<div style="margin-top:10px; font-size:12px; color:#aaa;">Best practice: Instagram algorithms in 2026 prefer exactly 3-5 highly relevant hashtags over spamming 30. Use Pro/Max mode if you are optimizing for TikTok or X instead.</div>`;
    }
    
    container.innerHTML = html;
  }
};
