document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const runBtn = document.getElementById('runBtn');
  const term = document.getElementById('terminal');
  const resultBlock = document.getElementById('resultBlock');

  const scoreVal = document.getElementById('scoreVal');
  const fcpVal = document.getElementById('fcpVal');
  const lcpVal = document.getElementById('lcpVal');
  const clsVal = document.getElementById('clsVal');

  // Check auto-run
  const params = new URLSearchParams(window.location.search);
  if (params.has('url')) urlInput.value = params.get('url');
  if (params.get('autorun') === '1' && urlInput.value) {
    runAudit();
  }

  runBtn.addEventListener('click', runAudit);
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') runAudit();
  });

  async function runAudit() {
    let url = urlInput.value.trim();
    if (!url) return alert('Enter a URL');
    if (!url.startsWith('http')) url = 'https://' + url;
    
    term.classList.add('active');
    resultBlock.classList.remove('active');
    term.innerHTML = '';
    
    logTerm(`> INIT SPEED AUDIT: ${url}`);
    logTerm('> CONNECTING TO GOOGLE PAGESPEED API...');
    
    try {
      const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;
      
      const res = await fetch(api);
      if (!res.ok) throw new Error('API Error ' + res.status);
      const data = await res.json();
      
      logTerm('> PARSING METRICS...');
      
      const lh = data.lighthouseResult;
      const score = Math.round(lh.categories.performance.score * 100);
      const fcp = lh.audits['first-contentful-paint'].displayValue;
      const lcp = lh.audits['largest-contentful-paint'].displayValue;
      const cls = lh.audits['cumulative-layout-shift'].displayValue;
      
      scoreVal.textContent = score;
      fcpVal.textContent = fcp;
      lcpVal.textContent = lcp;
      clsVal.textContent = cls;
      
      scoreVal.className = 'mc-val ' + (score >= 90 ? 'good' : score >= 50 ? 'warn' : 'poor');
      
      setTimeout(() => {
        term.classList.remove('active');
        resultBlock.classList.add('active');
      }, 800);
      
    } catch(err) {
      logTerm(`<span class="term-err">> ERROR: ${err.message}</span>`);
      logTerm(`<span class="term-err">> Check if the URL is accessible publicly.</span>`);
    }
  }

  function logTerm(msg) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = msg;
    term.appendChild(div);
  }
});
