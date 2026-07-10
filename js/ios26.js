/* ═══════════════════════════════════════════════════════════════
   DigiRise 3.0 — Midnight Gold iOS Edition (ios26.js)
   Progressive enhancement engine — upgrades existing DOM.
   Zero libraries. Runs after nextgen.js (defer order preserved).
   FIX-3.0 series — APEX protocol applied.
═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var raf = window.requestAnimationFrame.bind(window);
function $(s,c){return (c||document).querySelector(s);}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}

/* ═════════════ FIX-P1: theme-color + manifest sync ═════════════ */
var THEME_COLORS = { dark:'#080604', light:'#f7f2e9' };
function syncThemeColor(){
  var t = document.documentElement.getAttribute('data-theme') || 'dark';
  var m = $('#metaThemeColor') || $('meta[name="theme-color"]');
  if(m) m.setAttribute('content', THEME_COLORS[t]);
}
syncThemeColor();

/* ═════════════ FIX-314: Theme engine — View Transition reveal ═════════════ */
var origToggle = window.toggleDarkMode;
window.toggleDarkMode = function(ev){
  var btn = $('#dm-toggle');
  var apply = function(){
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var nt = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nt);
    if(btn){ var ico = btn.querySelector('.dm-ico') || btn; ico.textContent = nt==='dark' ? '☀️' : '🌙'; }
    try{ localStorage.setItem('dr_theme', nt); }catch(e){}
    syncThemeColor();
  };
  // circular reveal origin = toggle button position
  if(btn){
    var r = btn.getBoundingClientRect();
    document.documentElement.style.setProperty('--tx', (r.left + r.width/2) + 'px');
    document.documentElement.style.setProperty('--ty', (r.top + r.height/2) + 'px');
    btn.classList.add('switching');
    setTimeout(function(){ btn.classList.remove('switching'); }, 500);
  }
  if(document.startViewTransition && !RM){ document.startViewTransition(apply); }
  else apply();
};
(function(){ // wrap toggle icon for morph
  var btn = $('#dm-toggle');
  if(btn && !btn.querySelector('.dm-ico')){
    var cur = btn.textContent.trim();
    btn.innerHTML = '<span class="dm-ico">'+cur+'</span>';
  }
})();

/* ═════════════ PERF: Single scroll orchestrator ═════════════
   All window.scroll work runs through ONE rAF dispatcher.
   getBoundingClientRect calls are batched in one pass.
════════════════════════════════════════════ */
var _scrollCbs = [];
var _scrollTick = false;
function _onScrollDispatch(){
  _scrollTick = false;
  for(var i=0;i<_scrollCbs.length;i++) _scrollCbs[i]();
}
window.addEventListener('scroll', function(){
  if(!_scrollTick){ _scrollTick=true; raf(_onScrollDispatch); }
}, {passive:true});

/* ═════════════ FIX-302: DYNAMIC ISLAND NAV ═════════════ */
/* FIX-518: skip island morph entirely on Tools Hub pages — the hub uses a
   fixed-position sidebar layout (see tools.css .tool-sidebar/.tool-main)
   that assumes #mainNav is a static 70px topbar. Morphing it into a
   floating centered pill (position:fixed, z-index:9990) broke that
   assumption and caused the nav to visually overlap/collide with the
   sidebar and tool content on all 3 /tools/ pages. */
var nav = $('#mainNav');
var _isToolsHub = document.body.classList.contains('tools-hub-mode');
if(nav && !_isToolsHub){
  nav.classList.add('island');
  var _navLastY = 0;
  _scrollCbs.push(function(){
    var y = window.scrollY;
    if(y > 90 && y > _navLastY + 6) nav.classList.add('collapsed');
    else if(y < _navLastY - 6 || y < 90) nav.classList.remove('collapsed');
    _navLastY = y;
  });
  // run once immediately
  (function(){ var y=window.scrollY; if(y>90) nav.classList.add('collapsed'); })();
}

/* ═════════════ FIX-303: staggered reveals + 3D tilt + gyro ═════════════ */
(function(){
  var targets = $$('.pkg-card, .ind-card, .trust-cell, .reel-card, .proj-hero-card, .aside-card, .rtl-grid > *, .addon-grid > *, .faq-item, .blog-card');
  targets.forEach(function(el,i){ 
    el.classList.add('ios-reveal', 'reveal-hidden'); 
    el.style.setProperty('--stag', ((i%4)*0.06)+'s'); 
  });
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {rootMargin:'0px 0px 15% 0px'});
  targets.forEach(function(el){ io.observe(el); });

  if(RM) return;
  // pointer tilt (desktop) — throttled, transform only
  var tiltEls = $$('.pkg-card, .proj-hero-card, .trust-cell');
  tiltEls.forEach(function(el){
    el.classList.add('tilt3d');
    el.addEventListener('pointermove', function(ev){
      if(ev.pointerType==='touch') return;
      var r = el.getBoundingClientRect();
      var x = (ev.clientX - r.left)/r.width - .5, y = (ev.clientY - r.top)/r.height - .5;
      el.classList.add('tilting');
      el.style.setProperty('--ry', (x*7)+'deg');
      el.style.setProperty('--rx', (-y*7)+'deg');
    });
    el.addEventListener('pointerleave', function(){
      el.classList.remove('tilting');
      el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg');
    });
  });
  // gyroscope tilt (mobile) — device tilt se card tilt
  if('DeviceOrientationEvent' in window && matchMedia('(pointer:coarse)').matches){
    var gyroTargets = $$('.pkg-card.tilt3d, .iphone-frame');
    var pend = false;
    addEventListener('deviceorientation', function(e){
      if(pend || e.beta==null) return; pend = true;
      raf(function(){
        var rx = Math.max(-6, Math.min(6, (e.beta-45)/8));
        var ry = Math.max(-6, Math.min(6, e.gamma/8));
        gyroTargets.forEach(function(el){
          var r = el.getBoundingClientRect();
          if(r.top < innerHeight && r.bottom > 0){
            el.style.setProperty('--rx', rx+'deg'); el.style.setProperty('--ry', ry+'deg');
          }
        });
        pend = false;
      });
    }, {passive:true});
  }
})();

/* ═════════════ FIX-315: hero aurora + shimmer + ripple ═════════════ */
(function(){
  var hero = $('.hero');
  if(hero && !$('.hero-aurora', hero)){
    var a = document.createElement('div'); a.className='hero-aurora';
    hero.insertBefore(a, hero.firstChild);
  }
  var h1 = $('.hero h1') || $('.hero-title');
  if(h1){
    var gold = h1.querySelector('span');
    if(gold) gold.classList.add('shimmer');
  }
  $$('.btn-primary,.nav-cta,.sheet-cta').forEach(function(b){
    b.classList.add('gold-ripple');
    b.addEventListener('pointerdown', function(ev){
      if(RM) return;
      var r = b.getBoundingClientRect();
      var s = document.createElement('span'); s.className='ripple';
      var d = Math.max(r.width, r.height);
      s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(ev.clientX-r.left-d/2)+'px;top:'+(ev.clientY-r.top-d/2)+'px;';
      b.appendChild(s); setTimeout(function(){ s.remove(); }, 600);
    });
  });
})();

/* ═════════════ FIX-307: client logo/tools marquee ═════════════ */
(function(){
  var grid = $('#trust-badges .trust-grid');
  if(!grid || grid.children.length < 3) return;
  var wrap = document.createElement('div'); wrap.className='marquee-wrap';
  var track = document.createElement('div'); track.className='marquee-track';
  var cells = $$(':scope > *', grid);
  cells.forEach(function(c){ track.appendChild(c); });
  cells.forEach(function(c){ 
    var clone = c.cloneNode(true); 
    clone.classList.remove('reveal-hidden', 'ios-reveal');
    track.appendChild(clone); 
  }); // duplicate for seamless loop
  wrap.appendChild(track);
  grid.parentNode.replaceChild(wrap, grid);
})();

/* ═════════════ FIX-305: PRICING 3.0 ═════════════ */
(function(){
  var sec = $('#packages'); if(!sec) return;
  var grid = $('#pkgGrid'); if(!grid) return;

  /* region + billing segmented controls */
  var RATES = { in:{sym:'₹',mult:1,flag:'🇮🇳',label:'India'}, ae:{sym:'AED ',mult:0.045,flag:'🇦🇪',label:'UAE'}, uk:{sym:'£',mult:0.0095,flag:'🇬🇧',label:'UK'} };
  var region='in', billing='one';

  function mkSeg(items, onPick){
    var seg = document.createElement('div'); seg.className='ios-seg';
    var pill = document.createElement('span'); pill.className='seg-pill'; seg.appendChild(pill);
    items.forEach(function(it,i){
      var b = document.createElement('button'); b.type='button'; b.innerHTML = it.html;
      if(i===0) b.classList.add('on');
      b.addEventListener('click', function(){
        $$('button',seg).forEach(function(x){x.classList.remove('on');});
        b.classList.add('on'); movePill(); onPick(it.val);
      });
      seg.appendChild(b);
    });
    function movePill(){
      var on = $('button.on', seg);
      pill.style.left = on.offsetLeft+'px'; pill.style.width = on.offsetWidth+'px';
    }
    raf(function(){ raf(movePill); });
    addEventListener('resize', movePill);
    return seg;
  }
  var segRegion = mkSeg(
    Object.keys(RATES).map(function(k){ return {val:k, html:RATES[k].flag+' '+RATES[k].label}; }),
    function(v){ region=v; repaint(true); }
  );
  var segBill = mkSeg(
    [{val:'one', html:'One-time'},{val:'ret', html:'Retainer <span class="seg-save">SAVE 20%</span>'}],
    function(v){ billing=v; repaint(true); }
  );
  grid.parentNode.insertBefore(segRegion, grid);
  grid.parentNode.insertBefore(segBill, grid);

  function parsePrice(el){
    var m = el.textContent.replace(/[,\s]/g,'').match(/(\d{3,})/);
    return m ? parseInt(m[1],10) : null;
  }
  function fmt(n){
    var r = RATES[region]; var v = Math.round(n * r.mult * (billing==='ret'?0.8:1));
    if(region==='in') return '₹' + v.toLocaleString('en-IN');
    return r.sym + v.toLocaleString('en-GB');
  }
  /* odometer count-up */
  function countUp(el, target){
    if(RM){ el.textContent = fmt(target); return; }
    var t0 = performance.now(), dur = 900;
    (function step(t){
      var p = Math.min(1,(t-t0)/dur); p = 1-Math.pow(1-p,3);
      el.textContent = fmt(Math.round(target*p));
      if(p<1) raf(step);
    })(t0);
  }

  var enhanced = false;
  function enhance(){
    var cards = $$('.pkg-card', grid);
    if(!cards.length) return false;
    cards.forEach(function(card, ci){
      /* find + tag the price node */
      var priceEl = $('.pkg-price', card) || $$('div,span',card).filter(function(e){ return /₹\s?[\d,]{4,}/.test(e.textContent) && e.children.length<3; })[0];
      if(priceEl && !priceEl.dataset.base){
        var base = parsePrice(priceEl);
        if(base){ priceEl.dataset.base = base; priceEl.classList.add('pkg-price-num'); }
      }
      /* popular card upgrade */
      if(/popular|⭐|best/i.test(card.className + card.innerHTML.slice(0,400)) && ci===1) card.classList.add('popular-3');
      /* trust chip */
      if(!$('.pkg-trust-chip', card)){
        var chips = ['✓ Used by LAL Sweets','✓ Used by Kirtilals','✓ Used by TradeScribe','✓ Used by FarmFres'];
        var chip = document.createElement('div'); chip.className='pkg-trust-chip'; chip.textContent = chips[ci%4];
        var cta = $('.pkg-cta, .btn-primary, a[href*="wa.me"]', card);
        if(cta && cta.parentNode) cta.parentNode.insertBefore(chip, cta);
      }
      /* expandable features: hide beyond 5 */
      var feats = $$('.pkg-feat, .pkg-features li, ul li', card);
      if(feats.length > 6 && !$('.pkg-more-btn', card)){
        feats.slice(5).forEach(function(f){ f.classList.add('pkg-feat-hidden'); });
        var mb = document.createElement('button'); mb.type='button'; mb.className='pkg-more-btn';
        mb.textContent = '+ '+(feats.length-5)+' more features';
        mb.addEventListener('click', function(e){
          e.stopPropagation();
          card.classList.toggle('feat-open');
          mb.textContent = card.classList.contains('feat-open') ? '− Show less' : '+ '+(feats.length-5)+' more features';
        });
        feats[5].parentNode.appendChild(mb);
      }
      /* scarcity fill bar animate on view */
      var fill = $('.pkg-slot-fill i', card);
      /* bottom sheet on card tap (not on links/buttons) */
      card.addEventListener('click', function(e){
        if(e.target.closest('a,button')) return;
        openSheet(card);
      });
      /* mini bar tracking */
      card.addEventListener('pointerenter', function(){ updateMiniBar(card); });
    });
    /* price count-up when section enters view */
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          $$('.pkg-price-num', grid).forEach(function(p){ countUp(p, +p.dataset.base); });
          io.disconnect();
        }
      });
    }, {threshold:.15});
    io.observe(grid);
    return true;
  }
  function repaint(animate){
    $$('.pkg-price-num', grid).forEach(function(p){
      animate ? countUp(p, +p.dataset.base) : (p.textContent = fmt(+p.dataset.base));
    });
  }
  /* pkgGrid is rendered by nextgen.js — wait for it */
  var tries = 0, wait = setInterval(function(){
    if(enhance() || ++tries > 40){ clearInterval(wait); enhanced = true; }
  }, 250);

  /* ── iOS bottom sheet ── */
  var bd = document.createElement('div'); bd.className='ios-sheet-backdrop';
  var sh = document.createElement('div'); sh.className='ios-sheet';
  document.body.appendChild(bd); document.body.appendChild(sh);
  function openSheet(card){
    var name = ($('.pkg-name, h3', card)||{}).textContent || 'Package';
    var priceEl = $('.pkg-price-num', card);
    var feats = $$('.pkg-feat, .pkg-features li, ul li', card).map(function(f){ return f.textContent.trim(); }).filter(Boolean);
    sh.innerHTML = '<div class="sheet-grab"></div>'
      + '<h3 class="sheet-title">'+name.trim()+'</h3>'
      + '<div class="sheet-price">'+(priceEl?priceEl.textContent:'')+' <small>'+(billing==='ret'?'/month (retainer −20%)':'one-time')+'</small></div>'
      + feats.slice(0,14).map(function(f){ return '<div class="sheet-feat"><b>✓</b><span>'+f.replace(/^[✓✔︎•\-\s]+/,'')+'</span></div>'; }).join('')
      + '<a class="sheet-cta" target="_blank" rel="noopener" href="mailto:digiriseindia@gmail.com?text='+encodeURIComponent('Hi DigiRise! '+name.trim()+' package ke bare mein baat karni hai.')+'">💬 WhatsApp pe Book Karo →</a>';
    bd.classList.add('open'); sh.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeSheet(){ bd.classList.remove('open'); sh.classList.remove('open'); document.body.style.overflow=''; }
  bd.addEventListener('click', closeSheet);
  /* drag-to-dismiss */
  var sy=null, dy=0;
  sh.addEventListener('touchstart', function(e){ if(sh.scrollTop<=0){ sy=e.touches[0].clientY; } }, {passive:true});
  sh.addEventListener('touchmove', function(e){
    if(sy==null) return; dy = e.touches[0].clientY - sy;
    if(dy>0){ sh.style.transform='translateY('+dy+'px)'; sh.style.transition='none'; }
  }, {passive:true});
  sh.addEventListener('touchend', function(){
    sh.style.transition=''; sh.style.transform='';
    if(dy>110) closeSheet();
    sy=null; dy=0;
  });

  /* ── sticky mini price bar ── */
  var mb = document.createElement('div'); mb.className='pkg-mini-bar';
  mb.innerHTML = '<div><div class="pmb-name">GROWTH</div><div class="pmb-price">₹24,999</div></div><a target="_blank" rel="noopener" href="mailto:digiriseindia@gmail.com?subject=Hi%20DigiRise!%20Package%20book%20karna%20hai.">Book Now →</a>';
  document.body.appendChild(mb);
  function updateMiniBar(card){
    var n = ($('.pkg-name, h3', card)||{}).textContent || '';
    var p = $('.pkg-price-num', card);
    if(n) $('.pmb-name', mb).textContent = n.trim().toUpperCase().slice(0,18);
    if(p) $('.pmb-price', mb).textContent = p.textContent;
    $('a', mb).href = 'mailto:digiriseindia@gmail.com?text='+encodeURIComponent('Hi DigiRise! '+n.trim()+' package book karna hai.');
  }
  var mbIO = new IntersectionObserver(function(es){
    es.forEach(function(e){ mb.classList.toggle('show', e.isIntersecting); });
  }, {threshold:.05});
  mbIO.observe(sec);
})();

/* ═════════════ FIX-308: stats → activity rings ═════════════ */
(function(){
  /* shared gold gradient defs */
  var defs = document.createElementNS('http://www.w3.org/2000/svg','svg');
  defs.setAttribute('width','0'); defs.setAttribute('height','0'); defs.style.position='absolute';
  defs.innerHTML = '<defs><linearGradient id="goldRingGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f5d78a"/><stop offset="100%" stop-color="#ffffff"/></linearGradient><linearGradient id="footWaveGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ffffff" stop-opacity="0"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>';
  document.body.appendChild(defs);
})();

/* ═════════════ FIX-309: scroll-driven timeline fill ═════════════ */
(function(){
  var g = $('#results-timeline .rtl-grid'); if(!g) return;
  var line = document.createElement('div'); line.className='rtl-line'; line.innerHTML='<i></i>';
  g.insertBefore(line, g.firstChild);
  var bar = $('i', line), _tlActive=false;
  // gate: only update when section is near viewport
  new IntersectionObserver(function(es){ _tlActive=es[0].isIntersecting; },{rootMargin:'200px 0px 200px 0px'}).observe(g);
  _scrollCbs.push(function(){
    if(!_tlActive) return; // PERF: skip when off-screen
    var r = g.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, (innerHeight*0.75 - r.top) / r.height));
    bar.style.setProperty('height', (p*100)+'%');
    line.style.setProperty('--fill', (p*100)+'%');
  });
})();

/* ═════════════ FIX-310: reels center-snap carousel ═════════════ */
(function(){
  var grid = $('.reels-grid'); if(!grid) return;
  var cards = $$('.reel-card', grid); if(!cards.length) return;
  function activate(){
    var mid = grid.getBoundingClientRect().left + grid.clientWidth/2;
    var best=null, bd=1e9;
    cards.forEach(function(c){
      var r = c.getBoundingClientRect();
      var d = Math.abs(r.left + r.width/2 - mid);
      if(d<bd){ bd=d; best=c; }
    });
    cards.forEach(function(c){
      var on = c===best;
      c.classList.toggle('reel-active', on);
      var v = $('video', c);
      if(v){ if(on && !RM){ v.play().catch(function(){}); } else { v.pause(); } }
    });
  }
  var pend=false;
  grid.addEventListener('scroll', function(){ if(!pend){ pend=true; raf(function(){ activate(); pend=false; }); } }, {passive:true});
  /* start centered on first card */
  raf(activate);
  /* only autoplay when section is on screen */
  new IntersectionObserver(function(es){
    es.forEach(function(e){ if(!e.isIntersecting){ cards.forEach(function(c){ var v=$('video',c); if(v) v.pause(); }); } else activate(); });
  }, {threshold:.2}).observe(grid);
})();

/* ═════════════ FIX-311: testimonial swipe stack (reads rendered DOM) ═════════════ */
(function(){
  var tries = 0;
  var wait = setInterval(function(){
    var grid = $('#testiGrid');
    var cards = grid ? $$('.testi-card', grid) : [];
    if(!cards.length){ if(++tries > 40) clearInterval(wait); return; }
    clearInterval(wait);
    var data = cards.map(function(c){
      return {
        quote: ($('.testi-text',c)||{}).textContent || '',
        name: ($('.testi-name',c)||{}).textContent || 'Client',
        role: ($('.testi-biz',c)||{}).textContent || '',
        bg: c.style.getPropertyValue('--tc') || '#ffffff'
      };
    });
    var wrap = document.createElement('div'); wrap.className='tstack-wrap';
    var idx = 0;
    var VER = '<svg class="ig-verified" viewBox="0 0 24 24"><path d="M12 2l2.4 1.6 2.8-.3 1.2 2.5 2.5 1.2-.3 2.8L22 12l-1.6 2.4.3 2.8-2.5 1.2-1.2 2.5-2.8-.3L12 22l-2.4-1.6-2.8.3-1.2-2.5-2.5-1.2.3-2.8L2 12l1.6-2.4-.3-2.8 2.5-1.2 1.2-2.5 2.8.3z" fill="#1d9bf0"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
    function mk(t){
      var el = document.createElement('div'); el.className='tstack-card';
      el.innerHTML = '<div class="tstack-quote">'+t.quote+'</div>'
        + '<div class="tstack-who"><div class="tstack-av" style="background:linear-gradient(135deg,'+t.bg+',#8a5a06);">'+t.name.charAt(0)+'</div>'
        + '<div><div class="tstack-name">'+t.name+' '+VER+'</div><div class="tstack-role">'+t.role+'</div></div></div>';
      return el;
    }
    function render(){
      wrap.innerHTML='';
      for(var i=0;i<data.length;i++){
        var pos = (i - idx + data.length) % data.length;
        var el = mk(data[i]);
        el.setAttribute('data-pos', pos<3 ? pos : 'h');
        wrap.appendChild(el);
        if(pos===0) bindSwipe(el);
      }
    }
    function next(){ idx=(idx+1)%data.length; render(); }
    function bindSwipe(el){
      var sx=null, dx=0;
      el.addEventListener('pointerdown', function(e){ sx=e.clientX; el.setPointerCapture(e.pointerId); el.style.transition='none'; });
      el.addEventListener('pointermove', function(e){
        if(sx==null) return; dx=e.clientX-sx;
        el.style.transform='translateX('+dx+'px) rotate('+(dx/22)+'deg)';
      });
      el.addEventListener('pointerup', function(){
        el.style.transition='';
        if(Math.abs(dx)>90){
          el.classList.add('flyout');
          el.style.transform='translateX('+(dx>0?520:-520)+'px) rotate('+(dx/10)+'deg)';
          setTimeout(next, 260);
        } else el.style.transform='';
        sx=null; dx=0;
      });
    }
    render();
    var hint = document.createElement('div'); hint.className='tstack-hint'; hint.textContent='← Swipe karke aur reviews dekho →';
    grid.style.display='none';
    grid.parentNode.insertBefore(wrap, grid);
    grid.parentNode.insertBefore(hint, grid);
    if(!RM) setInterval(function(){ if(document.visibilityState==='visible' && wrap.matches(':hover')===false) next(); }, 7000);
  }, 250);
})();

/* ═════════════ FIX-312/313: FAB idle bounce + back-to-top ring ═════════════ */
(function(){
  var b = document.createElement('button'); b.className='btt-ring'; b.setAttribute('aria-label','Back to top');
  b.innerHTML = '<svg viewBox="0 0 40 40"><circle class="bt-bg" cx="20" cy="20" r="18"/><circle class="bt-fg" cx="20" cy="20" r="18"/></svg><span>↑</span>';
  document.body.appendChild(b);
  var fg = $('.bt-fg', b), C=2*Math.PI*18;
  // join the shared scroll orchestrator — no separate listener
  _scrollCbs.push(function(){
    var h = document.documentElement.scrollHeight - innerHeight;
    var p = h>0 ? scrollY/h : 0;
    fg.style.strokeDashoffset = C*(1-p);
    b.classList.toggle('show', scrollY > innerHeight*1.2);
  });
  b.addEventListener('click', function(){ scrollTo({top:0, behavior: RM?'auto':'smooth'}); });
})();

/* ═════════════ FIX-316: footer wave ═════════════ */
(function(){
  var f = $('footer'); if(!f) return;
  var w = document.createElementNS('http://www.w3.org/2000/svg','svg');
  w.setAttribute('class','footer-wave'); w.setAttribute('viewBox','0 0 1200 40'); w.setAttribute('preserveAspectRatio','none');
  w.innerHTML = '<path d="M0 20 Q 75 0 150 20 T 300 20 T 450 20 T 600 20 T 750 20 T 900 20 T 1050 20 T 1200 20"/>';
  f.insertBefore(w, f.firstChild);
  new IntersectionObserver(function(es,o){ es.forEach(function(e){ if(e.isIntersecting){ w.style.animationPlayState='running'; o.disconnect(); } }); },{threshold:.1}).observe(f);
})();

/* ═════════════ FIX-317: service card flip ═════════════ */
(function(){
  $$('.ind-card').forEach(function(card){
    var name = ($('.inm',card)||{}).textContent||'';
    /* keep the existing showInd click; add long-press flip as bonus on desktop hover */
  });
})();

/* ═══════════════════════════════════════════════════════════════
   PHASE 6 — GAPS CLOSURE (FIX-320 series)
═══════════════════════════════════════════════════════════════ */

/* ── FIX-320: client logo dual-row marquee + tooltips (v3.7: tap-toggle) ── */
(function(){
  var CLIENTS = [
    {name:'LAL Sweets', cat:'Sweets & FMCG', tip:'Social system + Meta Ads creatives'},
    {name:'Kirtilals', cat:'Luxury Jewellery', tip:'3D Blender visuals + ad creatives'},
    {name:'TradeScribe', cat:'B2B / SaaS', tip:'Brand identity + content design'},
    {name:'FarmFres', cat:'Agro & Food', tip:'Product creatives + packaging design'},
    {name:'Murzban', cat:'Lifestyle Brand', tip:'Video edits + social content'},
    {name:'The Liquid Lounge', cat:'Bar & Restaurant', tip:'Web + local presence'},
    {name:'Vidya Mandir Classes', cat:'Institute', tip:'Website + enrollment funnel'},
    {name:'PTJM SVM', cat:'School', tip:'Digital presence + branding'}
  ];
  function chip(c){
    return '<div class="cm-chip">'
      + '<div><div class="cm-name">'+c.name+'</div><div class="cm-cat">'+c.cat+'</div></div>'
      + '<div class="cm-tip">'+c.tip+'</div></div>';
  }
  function row(rev){
    var items = CLIENTS.map(chip).join('');
    return '<div class="cm-row"><div class="cm-track'+(rev?' rev':'')+'">'+items+items+'</div></div>';
  }
  var sec = document.createElement('div');
  sec.className='client-marquee-sec';
  sec.innerHTML = '<div class="cm-title">Real Brands · Real Kaam</div>' + row(false) + row(true);
  var anchor = $('#trust-badges') || $('#industries');
  if(anchor) anchor.parentNode.insertBefore(sec, anchor);

  /* v3.7: Tap-toggle tooltips on mobile (touch devices) */
  sec.addEventListener('touchstart', function(e){
    var chip = e.target.closest('.cm-chip');
    if(!chip) return;
    e.preventDefault();
    var wasOpen = chip.classList.contains('tip-open');
    /* Close all others */
    var all = sec.querySelectorAll('.cm-chip.tip-open');
    for(var i=0;i<all.length;i++) all[i].classList.remove('tip-open');
    if(!wasOpen) chip.classList.add('tip-open');
  }, {passive:false});
})();

/* ── FIX-370: Trust-chip marquee (replaces static trust-badges grid) ── */
(function(){
  var TRUST = [
    {icon:'\u2705', label:'On-Time Delivery', sub:'Guaranteed'},
    {icon:'\uD83D\uDEE0', label:'8 Pro Software', sub:'In-house, zero outsourcing'},
    {icon:'\uD83C\uDF0D', label:'India \u00B7 UAE \u00B7 UK', sub:'3 countries served'},
    {icon:'\uD83E\uDDFE', label:'100% Deliverables', sub:'Ya hum free mein karte rehte hain'},
    {icon:'\uD83D\uDCAC', label:'2-Hour Reply', sub:'10am\u201310pm, WhatsApp pe'},
    {icon:'\uD83C\uDFED', label:'12+ Industries', sub:'Restaurants se Jewellery tak'},
    {icon:'\uD83D\uDD12', label:'No Hidden Fees', sub:'Transparent pricing'},
    {icon:'\uD83D\uDCCA', label:'Weekly Reports', sub:'Har campaign ka hisaab'}
  ];
  function trustChip(t){
    return '<div class="tm-chip"><span class="tm-icon">'+t.icon+'</span><div><div class="tm-label">'+t.label+'</div><div class="tm-sub">'+t.sub+'</div></div></div>';
  }
  var items = TRUST.map(trustChip).join('');
  var trustSec = document.createElement('div');
  trustSec.className = 'trust-marquee-sec';
  trustSec.innerHTML = '<div class="cm-row"><div class="cm-track rev" style="animation-duration:44s;">'+items+items+'</div></div>';
  /* Insert right after the client marquee */
  var clientMarq = document.querySelector('.client-marquee-sec');
  if(clientMarq && clientMarq.nextSibling){
    clientMarq.parentNode.insertBefore(trustSec, clientMarq.nextSibling);
  } else if(clientMarq){
    clientMarq.parentNode.appendChild(trustSec);
  }
  /* Pause on touch */
  trustSec.addEventListener('touchstart', function(){ trustSec.querySelector('.cm-track').style.animationPlayState='paused'; }, {passive:true});
  trustSec.addEventListener('touchend', function(){ trustSec.querySelector('.cm-track').style.animationPlayState=''; }, {passive:true});
})();

/* ── FIX-321: activity rings on stats (Apple Watch style) ── */
(function(){
  var stats = $$('.stat-item');
  if(!stats.length) return;
  var PCT = [1, .98, .75, .9]; /* 200+ brands, 4.9★, 3x ROI, extra */
  stats.forEach(function(st, i){
    var num = $('.num', st); if(!num) return;
    var wrap = document.createElement('div'); wrap.className='stat-ring-wrap';
    wrap.innerHTML = '<svg viewBox="0 0 104 104"><circle class="srw-bg" cx="52" cy="52" r="45"/><circle class="srw-fg" cx="52" cy="52" r="45"/></svg>';
    num.parentNode.insertBefore(wrap, num);
    wrap.appendChild(num);
    st.dataset.ringPct = PCT[i % PCT.length];
  });
  var C = 2*Math.PI*45;
  stats.forEach(function(st){
    new IntersectionObserver(function(es, io){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var fg = $('.srw-fg', e.target);
        if(fg) fg.style.strokeDashoffset = C * (1 - (+e.target.dataset.ringPct || .8));
        io.unobserve(e.target);
      });
    }, {threshold:.4}).observe(st);
  });
})();

/* ── FIX-322: service card flip backs (desktop hover) ── */
(function(){
  var IND = {"restaurant": {"name": "Restaurants & Cafés", "color": "#ef4444", "pain": "Customers don't find you on Google Maps or Swiggy", "svc": ["Google Maps listing & ranking", "Swiggy/Zomato profile optimization", "Instagram food photography strategy"]}, "salon": {"name": "Salons & Spas", "color": "#ec4899", "pain": "Booking slots empty, competitors getting all the clients", "svc": ["Instagram Reels for salon showcases", "Before/after transformation posts", "Google Business with booking link"]}, "gym": {"name": "Gyms & Fitness Studios", "color": "#f97316", "pain": "Member retention poor, can't attract new members consistently", "svc": ["Transformation result posts", "Free trial campaign ads", "Google Maps gym category ranking"]}, "clinic": {"name": "Clinics & Healthcare", "color": "#06b6d4", "pain": "Patients can't find you online, Practo losing you leads", "svc": ["Practo & Justdial profile optimization", "Google Search Ads for symptoms/treatments", "Patient review management"]}, "coaching": {"name": "Coaching & Education", "color": "#8b5cf6", "pain": "Seats empty, students don't know you exist", "svc": ["Lead generation landing pages", "Facebook Ads for student targeting", "YouTube channel setup & strategy"]}, "retail": {"name": "Retail & Local Shops", "color": "#10b981", "pain": "Footfall declining, online competition killing you", "svc": ["Google Shopping Ads setup", "WhatsApp catalog for products", "Instagram product showcases"]}, "ecom": {"name": "E-Commerce & D2C Brands", "color": "#f59e0b", "pain": "Low conversions, high CAC, poor ROAS on ads", "svc": ["Full Shopify/WooCommerce store", "Meta Ads retargeting campaigns", "Google Shopping optimization"]}, "hotel": {"name": "Hotels & Travel", "color": "#0ea5e9", "pain": "Booking.com commission eating profits, direct bookings near zero", "svc": ["Direct booking website with payment", "Google Hotel Ads setup", "TripAdvisor & Google review strategy"]}, "realestate": {"name": "Real Estate & Properties", "color": "#64748b", "pain": "Expensive portals like 99acres eating budget, low quality leads", "svc": ["Property listing landing pages", "Facebook Lead Ads for buyers", "Google Ads for \"flats near me\""]}, "jewellery": {"name": "Jewellery & Luxury", "color": "#d97706", "pain": "Footfall only during festivals, no year-round digital presence", "svc": ["Luxury product photography strategy", "Instagram Reels for jewellery", "Festive season campaigns"]}, "b2b": {"name": "B2B & Professional Services", "color": "#1d4ed8", "pain": "No LinkedIn presence, leads coming only through referrals", "svc": ["LinkedIn company page optimization", "B2B Google Search Ads", "Case study content creation"]}, "fashion": {"name": "Fashion & Clothing Brands", "color": "#7c3aed", "pain": "Instagram looks amateur, brand not standing out", "svc": ["Brand identity & style guide", "Lookbook content strategy", "Shopify fashion store"]}};
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var tries=0, wait=setInterval(function(){
    var cards = $$('.ind-card');
    if(!cards.length){ if(++tries>40) clearInterval(wait); return; }
    clearInterval(wait);
    cards.forEach(function(card){
      var id = (card.id||'').replace('ic-','');
      var d = IND[id]; if(!d) return;
      var inner = document.createElement('div'); inner.className='ifl';
      var front = document.createElement('div'); front.className='ifl-face';
      while(card.firstChild) front.appendChild(card.firstChild);
      var back = document.createElement('div'); back.className='ifl-face ifl-back';
      back.innerHTML = '<div class="ib-pain">😤 '+d.pain+'</div>'
        + d.svc.map(function(s){ return '<div class="ib-svc"><b>✓</b><span>'+s+'</span></div>'; }).join('')
        + '<div class="ib-tap">TAP FOR FULL DETAILS →</div>';
      inner.appendChild(front); inner.appendChild(back);
      card.appendChild(inner);
    });
  }, 250);
})();

/* ── FIX-323: process steps light-up + progress ── */
(function(){
  var track = $('#stepsTrack'); if(!track) return;
  var cards = $$('.scard', track); if(!cards.length) return;
  var prog = document.createElement('div'); prog.className='steps-progress'; prog.innerHTML='<i></i>';
  track.parentNode.appendChild(prog);
  var bar = $('i', prog), lit = 0;
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        var idx = +e.target.dataset.index || cards.indexOf(e.target);
        setTimeout(function(){ e.target.classList.add('lit'); }, idx*180);
        lit = Math.max(lit, idx+1);
        bar.style.width = (lit/cards.length*100)+'%';
      }
    });
  }, {threshold:.5});
  cards.forEach(function(c){ io.observe(c); });
  /* horizontal scroll bhi update kare */
  track.addEventListener('scroll', function(){
    var p = track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth);
    bar.style.width = Math.max(lit/cards.length, p)*100 + '%';
  }, {passive:true});
})();

/* ── FIX-324: reel sound toggle (functional) ── */
(function(){
  $$('.reel-sound-btn').forEach(function(btn){
    btn.innerHTML = '🔇 <span>Sound On</span>';
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var v = $('video', btn.closest('.reel-card')); if(!v) return;
      v.muted = !v.muted;
      if(!v.muted && v.paused) v.play().catch(function(){});
      btn.innerHTML = v.muted ? '🔇 <span>Sound On</span>' : '🔊 <span>Mute</span>';
      /* baaki sab mute */
      if(!v.muted) $$('.reel-video').forEach(function(o){ if(o!==v){ o.muted = true; } });
      $$('.reel-sound-btn').forEach(function(o){ if(o!==btn) o.innerHTML='🔇 <span>Sound On</span>'; });
    });
  });
})();

/* ── FIX-325: radial FAB menu ── */
(function(){
  var scrim = document.createElement('div'); scrim.className='fab-scrim';
  var cluster = document.createElement('div'); cluster.className='fab-cluster';
  var ACTIONS = [
    {ico:'💬', lbl:'WhatsApp', bg:'#25d366', href:'mailto:digiriseindia@gmail.com?subject=Hi%20DigiRise!%20Baat%20karni%20hai!'},
    {ico:'📞', lbl:'Call Now', bg:'linear-gradient(145deg,#ffffff,#b3b3b3)', href:'mailto:digiriseindia@gmail.com'},
    {ico:'📸', lbl:'Instagram', bg:'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', href:'https://www.instagram.com/digiriseindia/'},
    {ico:'🎁', lbl:'Free Audit ₹3,499', bg:'linear-gradient(145deg,#1d4ed8,#3b82f6)', href:'#audit'}
  ];
  cluster.innerHTML = ACTIONS.map(function(a){
    return '<a class="fab-item" href="'+a.href+'"'+(a.href.charAt(0)==='#'?'':' target="_blank" rel="noopener"')+'>'
      + '<span class="fi-lbl">'+a.lbl+'</span>'
      + '<span class="fi-ico" style="background:'+a.bg+'">'+a.ico+'</span></a>';
  }).join('') + '<button class="fab-main" aria-label="Contact menu" aria-expanded="false">＋</button>';
  document.body.appendChild(scrim);
  document.body.appendChild(cluster);
  var main = $('.fab-main', cluster);
  function setOpen(on){
    cluster.classList.toggle('open', on);
    scrim.classList.toggle('open', on);
    main.setAttribute('aria-expanded', on);
    main.textContent = on ? '×' : '＋';
  }
  main.addEventListener('click', function(){ setOpen(!cluster.classList.contains('open')); });
  scrim.addEventListener('click', function(){ setOpen(false); });
  $$('.fab-item', cluster).forEach(function(a){ a.addEventListener('click', function(){ setOpen(false); }); });
  /* idle bounce moves to main FAB */
  if(!RM){
    var idle;
    function resetIdle(){
      clearTimeout(idle);
      idle = setTimeout(function(){
        main.classList.add('fab-idle-bounce');
        setTimeout(function(){ main.classList.remove('fab-idle-bounce'); }, 1000);
      }, 10000);
    }
    ['scroll','pointerdown','keydown'].forEach(function(ev){ addEventListener(ev, resetIdle, {passive:true}); });
    resetIdle();
  }
})();

/* ── FIX-326: iOS sun↔moon switch ── */
(function(){
  var btn = $('#dm-toggle'); if(!btn) return;
  btn.classList.add('ios-switch');
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = '<span class="sw-stars">✦ ✧</span><span class="sw-rays">☀︎</span>'
    + '<span class="sw-knob"><span class="sw-ico dm-ico">'+(isDark?'🌙':'☀️')+'</span></span>';
  btn.setAttribute('role','switch');
  btn.setAttribute('aria-checked', isDark);
  btn.setAttribute('aria-label','Dark mode switch');
  /* keep ios26 theme handler; sync knob icon after each toggle */
  btn.addEventListener('click', function(){
    setTimeout(function(){
      var d = document.documentElement.getAttribute('data-theme') === 'dark';
      var ico = $('.dm-ico', btn); if(ico) ico.textContent = d ? '🌙' : '☀️';
      btn.setAttribute('aria-checked', d);
    }, 80);
  });
})();

/* ── FIX-327: compare mode morph ── */
(function(){
  var grid = $('#pkgGrid'); if(!grid) return;
  var cmpWrap = $('.cmp-wrap'); if(!cmpWrap) return;
  var btn = document.createElement('button');
  btn.className='cmp-mode-btn'; btn.type='button';
  btn.innerHTML = '🆚 <span>Compare Mode — sab packages side-by-side</span>';
  grid.parentNode.insertBefore(btn, grid.nextSibling);
  var on = false;
  btn.addEventListener('click', function(){
    on = !on;
    grid.classList.toggle('cmp-hidden', on);
    btn.innerHTML = on ? '🃏 <span>Cards Mode — wapas cards dekho</span>' : '🆚 <span>Compare Mode — sab packages side-by-side</span>';
    if(on){
      cmpWrap.classList.remove('cmp-highlight'); void cmpWrap.offsetWidth;
      cmpWrap.classList.add('cmp-highlight');
      setTimeout(function(){ cmpWrap.scrollIntoView({behavior: RM?'auto':'smooth', block:'start'}); }, 120);
    } else {
      grid.scrollIntoView({behavior: RM?'auto':'smooth', block:'start'});
    }
  });
})();

/* ── FIX-328: magnetic hero CTA ── */
(function(){
  if(RM || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  $$('.hero .btn-primary, .hero .nav-cta').forEach(function(b){
    b.classList.add('magnetic');
    b.addEventListener('pointermove', function(e){
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width/2) * 0.28;
      var y = (e.clientY - r.top - r.height/2) * 0.28;
      b.classList.add('magnet-on');
      b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    b.addEventListener('pointerleave', function(){
      b.classList.remove('magnet-on');
      b.style.transform = '';
    });
  });
})();

/* ── FIX-329: real trust chips + scarcity bar animate ── */
(function(){
  var CHIP_MAP = {
    'STARTER': '✓ Trusted by <b>FarmFres</b>',
    'GROWTH': '✓ Used by <b>LAL Sweets</b>',
    'AUTHORITY': '✓ Used by <b>Kirtilals</b>',
    'SCALE': '✓ Used by <b>TradeScribe</b>'
  };
  var tries=0, wait=setInterval(function(){
    var cards = $$('#pkgGrid .pkg-card');
    if(!cards.length){ if(++tries>40) clearInterval(wait); return; }
    clearInterval(wait);
    cards.forEach(function(card){
      var tier = ($('.pkg-tier', card)||{}).textContent || '';
      tier = tier.trim().toUpperCase();
      var chip = $('.pkg-trust-chip', card);
      if(chip && CHIP_MAP[tier]) chip.innerHTML = CHIP_MAP[tier];
      /* scarcity fill animate from 0 */
      var fill = $('.pkg-slot-fill', card);
      if(fill){
        var target = fill.style.width;
        fill.style.width = '0%';
        fill.style.transition = 'width 1.2s cubic-bezier(0.32,0.72,0,1) .3s';
        new IntersectionObserver(function(es, io){
          es.forEach(function(e){
            if(e.isIntersecting){ fill.style.width = target; io.disconnect(); }
          });
        }, {threshold:.3}).observe(card);
      }
    });
  }, 250);
})();

/* ── FIX-330: reel Grid/Carousel toggle (real switch, no fakery) ── */
(function(){
  var wrap = $('#reelViewToggle'); var grid = $('.reels-grid');
  if(!wrap || !grid) return;
  $$('.rvt-btn', wrap).forEach(function(btn){
    btn.addEventListener('click', function(){
      $$('.rvt-btn', wrap).forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var mode = btn.dataset.mode;
      grid.classList.toggle('grid-mode', mode==='grid');
      if(mode==='grid'){
        $$('.reel-video', grid).forEach(function(v){ v.pause(); });
      } else {
        raf(function(){ grid.dispatchEvent(new Event('scroll')); });
      }
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   PERF — Off-screen animation gate
   Uses ONE shared IntersectionObserver per section to pause/resume
   expensive infinite CSS animations when section is not in viewport.
   Adds will-change dynamically (on enter) and removes it (on leave)
   to avoid permanent GPU layer allocation.
═══════════════════════════════════════════════════════════════ */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Map: section-selector → array of element selectors to gate
  var SECTIONS = [
    {
      section: '.hero',
      targets: ['.hero-aurora', '.hero-mascot', '.iphone-screen img', '.hero-scroll-cue svg', '.hero h1 .shimmer, .hero-title .shimmer', '.hero h1 .acc']
    },
    {
      section: '#packages',
      targets: ['.pkg-card.popular-3', '.pkg-card.popular-3::before', '.pkg-badge', '.pkg-price-num']
    },
    {
      section: '.client-marquee-sec',
      targets: ['.cm-track']
    },
    {
      section: '.trust-marquee-sec',
      targets: ['.trust-marquee-sec .cm-track']
    },
    {
      section: '#trust-badges .marquee-wrap, #trust-badges',
      targets: ['.marquee-track', '.is-dot']
    },
    {
      section: '.hero-service-strip',
      targets: ['.hss-track']
    }
  ];

  SECTIONS.forEach(function(cfg){
    var sec = document.querySelector(cfg.section);
    if(!sec) return;

    function getEls(){
      var els = [];
      cfg.targets.forEach(function(sel){
        // Filter out pseudo-element selectors — can't query those
        if(sel.indexOf('::') !== -1) return;
        var found = document.querySelectorAll(sel);
        for(var i=0;i<found.length;i++) els.push(found[i]);
      });
      return els;
    }

    new IntersectionObserver(function(entries){
      var visible = entries[0].isIntersecting;
      getEls().forEach(function(el){
        el.style.animationPlayState = visible ? '' : 'paused';
        if(visible){
          el.style.willChange = 'transform'; // set on enter
        } else {
          el.style.willChange = 'auto'; // release GPU layer on leave
        }
      });
    }, {
      rootMargin: '100px 0px 100px 0px', // 100px lookahead/lookback
      threshold: 0
    }).observe(sec);
  });
})();

})();
