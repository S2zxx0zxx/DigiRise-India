document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const runBtn = document.getElementById('runBtn');
  const term = document.getElementById('terminal');
  const resultBlock = document.getElementById('resultBlock');
  const renderArea = document.getElementById('renderArea');
  const leadBanner = document.getElementById('leadBanner');
  const tabs = document.querySelectorAll('.tab-btn');

  let cache = { mobile: null, desktop: null };
  let currentStrategy = 'mobile';
  let isFetching = false;

  const params = new URLSearchParams(window.location.search);
  if (params.has('url')) urlInput.value = params.get('url');
  if (params.get('autorun') === '1' && urlInput.value) {
    runAuditFull();
  }

  runBtn.addEventListener('click', runAuditFull);
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') runAuditFull();
  });

  tabs.forEach(t => {
    t.addEventListener('click', () => {
      if (isFetching) return;
      tabs.forEach(btn => btn.classList.remove('active'));
      t.classList.add('active');
      currentStrategy = t.dataset.tab;
      if (cache[currentStrategy]) {
        renderData(cache[currentStrategy]);
      } else {
        fetchStrategy(currentStrategy);
      }
    });
  });

  async function runAuditFull() {
    let url = urlInput.value.trim();
    if (!url) return alert('Enter a URL');
    if (!url.startsWith('http')) url = 'https://' + url;
    
    cache = { mobile: null, desktop: null }; // clear cache
    currentStrategy = 'mobile';
    tabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === 'mobile');
    });

    term.classList.add('active');
    resultBlock.classList.remove('active');
    leadBanner.classList.remove('active');
    term.innerHTML = '';
    
    await fetchStrategy('mobile', url);
  }

  async function fetchStrategy(strategy, overrideUrl = null) {
    let url = overrideUrl || urlInput.value.trim();
    if (!url.startsWith('http')) url = 'https://' + url;

    isFetching = true;
    term.classList.add('active');
    if(!cache.mobile && !cache.desktop) resultBlock.classList.remove('active'); // only hide completely on first run
    renderArea.innerHTML = '<div style="text-align:center; padding: 40px; color:var(--accent);">Loading ' + strategy + ' metrics...</div>';
    
    logTerm(`> INIT FULL AUDIT: ${url} [${strategy.toUpperCase()}]`);
    logTerm('> CONNECTING TO GOOGLE PAGESPEED API...');

    try {
      // categories
      const cats = '&category=performance&category=accessibility&category=best-practices&category=seo';
      const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}${cats}&key=AIzaSyDDiTa9i6iZuMzr6d8GRVIoZefVldftkTo`;
      
      const res = await fetch(api);
      if (res.status === 429 || res.status === 500) {
        throw new Error('Google API busy hai — 1 min baad try karo (Error ' + res.status + ')');
      }
      if (!res.ok) throw new Error('API Error ' + res.status);
      const data = await res.json();
      
      logTerm('> PARSING FULL METRICS...');
      
      cache[strategy] = data;
      renderData(data);
      
      setTimeout(() => {
        term.classList.remove('active');
        resultBlock.classList.add('active');
      }, 500);

    } catch(err) {
      renderArea.innerHTML = '';
      logTerm(`<span class="term-err">> ERROR: ${err.message}</span>`);
      const btnHtml = `<button onclick="document.getElementById('runBtn').click()" class="tool-btn btn-primary" style="margin-top:15px">Retry</button>`;
      term.innerHTML += btnHtml;
    } finally {
      isFetching = false;
    }
  }

  function renderData(data) {
    const lh = data.lighthouseResult;
    if(!lh || !lh.categories) return;

    const perf = Math.round((lh.categories.performance?.score || 0) * 100);
    const acc = Math.round((lh.categories.accessibility?.score || 0) * 100);
    const bp = Math.round((lh.categories['best-practices']?.score || 0) * 100);
    const seo = Math.round((lh.categories.seo?.score || 0) * 100);

    // Show Lead CTA if performance < 70
    if (perf < 70) {
      leadBanner.classList.add('active');
    } else {
      leadBanner.classList.remove('active');
    }

    const getScoreClass = (s) => s >= 90 ? 'good' : s >= 50 ? 'warn' : 'poor';

    let html = `
      <div class="score-gauges">
        <div class="gauge">
          <div class="gauge-ring ${getScoreClass(perf)}">${perf}</div>
          <div class="gauge-label">Performance</div>
        </div>
        <div class="gauge">
          <div class="gauge-ring ${getScoreClass(acc)}">${acc}</div>
          <div class="gauge-label">Accessibility</div>
        </div>
        <div class="gauge">
          <div class="gauge-ring ${getScoreClass(bp)}">${bp}</div>
          <div class="gauge-label">Best Practices</div>
        </div>
        <div class="gauge">
          <div class="gauge-ring ${getScoreClass(seo)}">${seo}</div>
          <div class="gauge-label">SEO</div>
        </div>
      </div>
    `;

    // Lab Metrics Grid
    const audits = lh.audits;
    const labMetrics = [
      { id: 'first-contentful-paint', label: 'First Contentful Paint (FCP)' },
      { id: 'largest-contentful-paint', label: 'Largest Contentful Paint (LCP)' },
      { id: 'cumulative-layout-shift', label: 'Cumulative Layout Shift (CLS)' },
      { id: 'total-blocking-time', label: 'Total Blocking Time (TBT)' },
      { id: 'speed-index', label: 'Speed Index' },
      { id: 'interactive', label: 'Time to Interactive (TTI)' }
    ];

    html += `<div class="sect-title">Lab Metrics</div><div class="metrics-grid">`;
    labMetrics.forEach(m => {
      const a = audits[m.id];
      if (a) {
        const valClass = getScoreClass(a.score * 100);
        html += `
          <div class="metric-card">
            <div class="mc-label">${m.label}</div>
            <div class="mc-val ${valClass}">${a.displayValue}</div>
          </div>
        `;
      }
    });
    html += `</div>`;

    // Real User Data (CrUX)
    if (data.loadingExperience && data.loadingExperience.metrics) {
      const crux = data.loadingExperience.metrics;
      html += `<div class="sect-title">Real Users (28 days) — ${data.loadingExperience.overall_category}</div><div class="metrics-grid">`;
      const cruxMap = {
        'FIRST_CONTENTFUL_PAINT_MS': 'FCP',
        'LARGEST_CONTENTFUL_PAINT_MS': 'LCP',
        'CUMULATIVE_LAYOUT_SHIFT_SCORE': 'CLS',
        'INTERACTION_TO_NEXT_PAINT': 'INP'
      };
      Object.keys(cruxMap).forEach(k => {
        if (crux[k]) {
          const val = crux[k];
          let display = val.percentile;
          if (k === 'CUMULATIVE_LAYOUT_SHIFT_SCORE') display = (val.percentile / 100).toFixed(2);
          else if (k === 'FIRST_CONTENTFUL_PAINT_MS' || k === 'LARGEST_CONTENTFUL_PAINT_MS') display = (val.percentile / 1000).toFixed(1) + ' s';
          else if (k === 'INTERACTION_TO_NEXT_PAINT') display = val.percentile + ' ms';

          html += `
            <div class="metric-card">
              <div class="mc-label">${cruxMap[k]}</div>
              <div class="mc-val ${val.category === 'FAST' ? 'good' : val.category === 'AVERAGE' ? 'warn' : 'poor'}">${display}</div>
            </div>
          `;
        }
      });
      html += `</div>`;
    }

    // Diagnostics
    html += `<div class="sect-title">Diagnostics</div><div class="diag-row">`;
    if (audits['total-byte-weight']) html += `<div class="diag-item">Total Size: <span>${audits['total-byte-weight'].displayValue}</span></div>`;
    if (audits['dom-size']) html += `<div class="diag-item">DOM Elements: <span>${audits['dom-size'].displayValue}</span></div>`;
    if (audits['network-requests']) html += `<div class="diag-item">Requests: <span>${audits['network-requests'].details?.items?.length || 0}</span></div>`;
    if (audits['mainthread-work-breakdown']) html += `<div class="diag-item">Main-thread: <span>${audits['mainthread-work-breakdown'].displayValue}</span></div>`;
    html += `</div>`;

    // Opportunities
    const opps = Object.values(audits)
      .filter(a => a.details && a.details.type === 'opportunity' && a.details.overallSavingsMs > 0)
      .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
      .slice(0, 6);

    if (opps.length > 0) {
      html += `<div class="sect-title">Top Opportunities</div><ul class="opp-list">`;
      opps.forEach(o => {
        const d = o.details;
        let savings = [];
        if (d.overallSavingsMs > 0) savings.push((d.overallSavingsMs / 1000).toFixed(1) + 's bachao');
        if (d.overallSavingsBytes > 0) savings.push((d.overallSavingsBytes / 1024).toFixed(0) + ' KB bachao');
        html += `<li class="opp-item"><span>${o.title}</span><span class="opp-savings">${savings.join(' / ')}</span></li>`;
      });
      html += `</ul>`;
    }

    // Screenshot
    if (audits['final-screenshot'] && audits['final-screenshot'].details) {
      const src = audits['final-screenshot'].details.data;
      html = `<div class="thumb-box"><img src="${src}" alt="Final Screenshot"></div>` + html;
    }

    renderArea.innerHTML = html;
  }

  function logTerm(msg) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = msg;
    term.appendChild(div);
  }
});
