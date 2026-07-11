document.addEventListener('DOMContentLoaded', async () => {
  const industryInput = document.getElementById('industryInput');
  const cityInput = document.getElementById('cityInput');
  const offerInput = document.getElementById('offerInput');
  const toneSelect = document.getElementById('toneSelect');
  const runBtn = document.getElementById('runBtn');
  
  const term = document.getElementById('terminal');
  const resultBlock = document.getElementById('resultBlock');
  const copyList = document.getElementById('copyList');

  let patterns = null;

  try {
    const res = await fetch('/tools/data/copy-patterns.json');
    patterns = await res.json();
  } catch(e) {
    console.error('Failed to load copy patterns', e);
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has('brief')) {
    industryInput.value = params.get('brief');
  }
  if (params.has('mode')) {
    const validModes = ["professional", "hinglish-casual", "urgent"];
    const mode = params.get('mode').toLowerCase();
    if (validModes.includes(mode)) {
      const opt = toneSelect.querySelector(`option[value="${mode}" i]`);
      if (opt) toneSelect.value = opt.value;
      else if (mode === 'hinglish-casual') toneSelect.value = 'Hinglish-casual';
      else if (mode === 'urgent') toneSelect.value = 'Urgent';
      else toneSelect.value = 'Professional';
    }
  }
  
  if (params.get('autorun') === '1' && industryInput.value) {
    setTimeout(runGen, 500);
  }

  runBtn.addEventListener('click', runGen);
  [industryInput, cityInput, offerInput].forEach(el => {
    el.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') runGen();
    });
  });

  function runGen() {
    const industry = industryInput.value.trim() || 'business';
    const city = cityInput.value.trim() || 'your city';
    const offer = offerInput.value.trim() || 'exclusive offer';
    const tone = toneSelect.value;

    if (!patterns) return alert('Data loading, try again in a moment');

    term.classList.add('active');
    resultBlock.classList.remove('active');
    term.innerHTML = '';
    copyList.innerHTML = '';

    logTerm(`> INIT AD COPY GENERATION...`);
    logTerm(`> TONE: ${tone} | LOC: ${city}`);
    
    setTimeout(() => {
      const selectedPatterns = patterns[tone] || patterns['Professional'];
      
      const shuffled = [...selectedPatterns].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      selected.forEach(p => {
        let text = p.replace(/{industry}/g, industry)
                    .replace(/{city}/g, city)
                    .replace(/{offer}/g, offer);
        
        const card = document.createElement('div');
        card.className = 'metric-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `<div class="mc-val" style="font-size: 16px; font-weight: normal; font-family: 'Plus Jakarta Sans', sans-serif;">${text}</div>`;
        card.title = "Click to copy";
        card.addEventListener('click', () => {
          navigator.clipboard.writeText(text);
          const original = card.innerHTML;
          card.innerHTML = `<div class="mc-val good" style="font-size: 16px;">Copied to clipboard!</div>`;
          setTimeout(() => { card.innerHTML = original; }, 1500);
        });
        copyList.appendChild(card);
      });

      logTerm('> COMPILING TEMPLATES...');

      setTimeout(() => {
        term.classList.remove('active');
        resultBlock.classList.add('active');
      }, 400);
    }, 600);
  }

  function logTerm(msg) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = msg;
    term.appendChild(div);
  }
});
