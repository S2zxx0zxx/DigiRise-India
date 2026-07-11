/* DigiRise Speed Checker PRO — full Lighthouse surface (v7.0)
   4 category scores · 6 lab metrics · CrUX real-user data ·
   fix opportunities · diagnostics · mobile/desktop tabs */
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const urlInput = $('urlInput'), runBtn = $('runBtn'),
        term = $('terminal'), resultBlock = $('resultBlock');

  const cache = {};           // {url|strategy : data}
  let currentStrategy = 'mobile';
  let currentUrl = '';

  // Strategy tabs
  document.querySelectorAll('#strategyTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#strategyTabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStrategy = btn.dataset.strategy;
      if (currentUrl) runAudit(true);
    });
  });

  // Auto-run via ?url=&autorun=1
  const params = new URLSearchParams(window.location.search);
  if (params.has('url')) urlInput.value = params.get('url');
  if (params.get('autorun') === '1' && urlInput.value) runAudit();

  runBtn.addEventListener('click', () => runAudit());
  urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') runAudit(); });

  async function runAudit(fromTab) {
    let url = urlInput.value.trim();
    if (!url) return alert('Enter a URL');
    if (!url.startsWith('http')) url = 'https://' + url;
    currentUrl = url;

    const key = url + '|' + currentStrategy;
    term.classList.add('active');
    if (!fromTab) resultBlock.classList.remove('active');
    term.innerHTML = '';
    logTerm(`> INIT ${currentStrategy.toUpperCase()} AUDIT: ${url}`);

    let data = cache[key];
    if (!data) {
      logTerm('> CONNECTING TO GOOGLE LIGHTHOUSE API...');
      logTerm('> Running full audit (perf + a11y + best-practices + seo)…');
      try {
        const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${currentStrategy}` +
                    `&category=performance&category=accessibility&category=best-practices&category=seo`;
        const res = await fetch(api);
        if (!res.ok) throw new Error('API ' + res.status);
        data = await res.json();
        cache[key] = data;
      } catch (err) {
        const msg = /429|500|quota/i.test(err.message)
          ? 'Google API busy hai — 1 min baad try karo.'
          : err.message + ' — check URL is publicly accessible.';
        logTerm(`<span class="term-err">> ERROR: ${msg}</span>`);
        return;
      }
    } else {
      logTerm('> CACHED RESULT LOADED.');
    }

    logTerm('> PARSING FULL REPORT...');
    render(data);
    setTimeout(() => { term.classList.remove('active'); resultBlock.classList.add('active'); }, 700);
  }

  function scoreClass(s) { return s >= 90 ? 'good' : s >= 50 ? 'warn' : 'poor'; }
  function setScore(id, cat) {
    const el = $(id); if (!el) return;
    if (!cat || cat.score == null) { el.textContent = '—'; el.className = 'mc-val'; return; }
    const s = Math.round(cat.score * 100);
    el.textContent = s;
    el.className = 'mc-val ' + scoreClass(s);
  }
  function setAudit(id, audit) {
    const el = $(id); if (!el) return;
    el.textContent = audit ? audit.displayValue || '—' : '—';
    el.className = 'mc-val ' + (audit && audit.score != null ? scoreClass(audit.score * 100) : '');
  }

  function render(data) {
    const lh = data.lighthouseResult || {};
    const cats = lh.categories || {};
    const a = lh.audits || {};

    // Category scores
    setScore('scoreVal', cats.performance);
    setScore('a11yVal', cats.accessibility);
    setScore('bpVal', cats['best-practices']);
    setScore('seoVal', cats.seo);

    // Lab metrics
    setAudit('fcpVal', a['first-contentful-paint']);
    setAudit('lcpVal', a['largest-contentful-paint']);
    setAudit('clsVal', a['cumulative-layout-shift']);
    setAudit('tbtVal', a['total-blocking-time']);
    setAudit('siVal',  a['speed-index']);
    setAudit('ttiVal', a['interactive']);

    // CrUX field data
    const fx = (data.loadingExperience && data.loadingExperience.metrics) || null;
    const crux = $('cruxBlock');
    if (fx && Object.keys(fx).length) {
      const ms = v => v >= 1000 ? (v/1000).toFixed(1)+' s' : v+' ms';
      const put = (id, m, fmt) => { const el=$(id); if(!el) return;
        if (!m) { el.textContent='—'; el.className='mc-val'; return; }
        el.textContent = fmt(m.percentile);
        el.className = 'mc-val ' + (m.category==='FAST'?'good':m.category==='AVERAGE'?'warn':'poor'); };
      put('cruxFcp', fx.FIRST_CONTENTFUL_PAINT_MS, ms);
      put('cruxLcp', fx.LARGEST_CONTENTFUL_PAINT_MS, ms);
      put('cruxInp', fx.INTERACTION_TO_NEXT_PAINT, v => v+' ms');
      put('cruxCls', fx.CUMULATIVE_LAYOUT_SHIFT_SCORE, v => (v/100).toFixed(2));
      crux.style.display = 'block';
      logTerm('> REAL-USER (CrUX) DATA FOUND ✓');
    } else { crux.style.display = 'none'; logTerm('> No CrUX field data for this URL.'); }

    // Opportunities
    const opps = Object.values(a)
      .filter(x => x.details && x.details.type === 'opportunity' && (x.details.overallSavingsMs||0) > 0)
      .sort((x,y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
      .slice(0, 6);
    const oppList = $('oppList'), oppBlock = $('oppBlock');
    if (opps.length) {
      oppList.innerHTML = opps.map(o => {
        const s = o.details.overallSavingsMs;
        const kb = o.details.overallSavingsBytes ? ' · ~' + Math.round(o.details.overallSavingsBytes/1024) + ' KB bachao' : '';
        return `<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:11px 14px;">
          <span style="font-size:12.5px;font-weight:700;color:#fff;">${o.title}</span>
          <span style="font-size:11px;font-weight:800;color:var(--accent,#f0a825);white-space:nowrap;">~${(s/1000).toFixed(1)} s bachao${kb}</span>
        </div>`;
      }).join('');
      oppBlock.style.display = 'block';
    } else oppBlock.style.display = 'none';

    // Diagnostics
    const dg = $('diagRow');
    const w = a['total-byte-weight'], dom = a['dom-size'], req = a['network-requests'], mt = a['mainthread-work-breakdown'];
    $('diagWeight').textContent = w && w.numericValue ? (w.numericValue/1048576).toFixed(1)+' MB' : '—';
    $('diagDom').textContent    = dom && dom.numericValue ? Math.round(dom.numericValue).toLocaleString('en-IN') : '—';
    $('diagReq').textContent    = req && req.details && req.details.items ? req.details.items.length : '—';
    $('diagMain').textContent   = mt ? (mt.displayValue||'—') : '—';
    dg.style.display = 'grid';

    // Lead CTA if perf < 70
    const perf = cats.performance ? Math.round(cats.performance.score*100) : 100;
    $('auditCta').style.display = perf < 70 ? 'block' : 'none';

    logTerm('> REPORT READY ✓');
  }

  function logTerm(msg) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = msg;
    term.appendChild(div);
  }
});
