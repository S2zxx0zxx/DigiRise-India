/* ═════════════════════════════════════════════════════════════════════
   DIGIRISE INDIA — NEXT-GEN INTERACTIONS  (nextgen.js)
   Split-text hero · Scrollspy indicator · 3D tilt · Velocity marquee
   Reels cinema · Timeline draw · FAQ search · Section dots · WA widget
   Exit intent · Logo progress ring · Trust logos · Aurora CTA
   100% additive · vanilla JS · zero dependencies
   ═════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH = window.matchMedia('(pointer: coarse)').matches;

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ───────────────────────────────────────────
     1 · NAVBAR: compact-on-scroll + scrollspy
        indicator + logo progress ring
     ─────────────────────────────────────────── */
  function initNavbar() {
    var nav = document.getElementById('mainNav');
    if (!nav) return;

    // compact on scroll
    var lastCompact = false;
    window.addEventListener('scroll', function () {
      var c = window.scrollY > 60;
      if (c !== lastCompact) {
        lastCompact = c;
        nav.classList.toggle('ng-compact', c);
      }
    }, { passive: true });

    // scrollspy sliding indicator
    var linksWrap = nav.querySelector('.nav-links');
    if (linksWrap) {
      var indicator = document.createElement('span');
      indicator.className = 'ng-nav-indicator';
      linksWrap.appendChild(indicator);
      var links = Array.prototype.slice.call(linksWrap.querySelectorAll('a[href^="#"]'));

      function moveTo(el) {
        if (!el) { indicator.style.opacity = '0'; return; }
        var r = el.getBoundingClientRect();
        var pr = linksWrap.getBoundingClientRect();
        indicator.style.opacity = '1';
        indicator.style.left = (r.left - pr.left) + 'px';
        indicator.style.width = r.width + 'px';
      }

      var secIds = links.map(function (a) { return a.getAttribute('href').slice(1); });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var idx = secIds.indexOf(en.target.id);
            if (idx > -1) moveTo(links[idx]);
          }
        });
      }, { rootMargin: '-38% 0px -55% 0px' });
      secIds.forEach(function (id) {
        var s = document.getElementById(id);
        if (s) spy.observe(s);
      });
      links.forEach(function (a) {
        a.addEventListener('mouseenter', function () { moveTo(a); });
      });
    }

    // logo scroll-progress ring (Disabled to fix Bug 3: spinning circle glitch on scroll)
    /*
    var logo = nav.querySelector('.logo, [class*="logo"]');
    if (logo && logo.style) {
      logo.style.position = 'relative';
      var ringWrap = document.createElement('span');
      ringWrap.className = 'ng-logo-ring';
      var R = 20, C = 2 * Math.PI * R;
      ringWrap.innerHTML =
        '<svg width="100%" height="100%" viewBox="0 0 44 44">' +
        '<circle cx="22" cy="22" r="' + R + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg>';
      logo.appendChild(ringWrap);
      var circ = ringWrap.querySelector('circle');
      window.addEventListener('scroll', function () {
        var h = document.documentElement;
        var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
        circ.style.strokeDashoffset = C - C * p;
      }, { passive: true });
    }
    */
  }

  /* ───────────────────────────────────────────
     2 · HERO: split-text + grid floor +
        cursor glow + scroll cue + trust logos
     ─────────────────────────────────────────── */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Split-text word reveal on H1
    var h1 = hero.querySelector('h1');
    if (h1 && !REDUCE) {
      var walk = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
      var textNodes = [];
      while (walk.nextNode()) if (walk.currentNode.nodeValue.trim()) textNodes.push(walk.currentNode);
      var wordIdx = 0;
      textNodes.forEach(function (tn) {
        var frag = document.createDocumentFragment();
        tn.nodeValue.split(/(\s+)/).forEach(function (piece) {
          if (!piece.trim()) { frag.appendChild(document.createTextNode(piece)); return; }
          var s = document.createElement('span');
          s.className = 'ng-word';
          s.style.animationDelay = (wordIdx++ * 70) + 'ms';
          s.textContent = piece;
          frag.appendChild(s);
        });
        tn.parentNode.replaceChild(frag, tn);
      });
    }

    // 3D grid floor
    var floor = document.createElement('div');
    floor.className = 'ng-grid-floor';
    hero.insertBefore(floor, hero.firstChild);

    // Cursor glow (desktop only)
    if (!TOUCH && !REDUCE) {
      var glow = document.createElement('div');
      glow.className = 'ng-cursor-glow';
      hero.appendChild(glow);
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        glow.style.left = (e.clientX - r.left) + 'px';
        glow.style.top = (e.clientY - r.top) + 'px';
      });

      // Aside cards parallax depth
      var cards = hero.querySelectorAll('.aside-card');
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        cards.forEach(function (c, i) {
          var depth = 6 + i * 4;
          c.style.transform = 'translate(' + (-dx * depth) + 'px,' + (-dy * depth) + 'px)';
        });
      });
      hero.addEventListener('pointerleave', function () {
        cards.forEach(function (c) { c.style.transform = ''; });
      });
    }

    // Scroll cue
    var cue = document.createElement('div');
    cue.className = 'ng-scroll-cue';
    cue.innerHTML = '<div class="ng-mouse"></div><span>Scroll karo</span>';
    hero.appendChild(cue);
    window.addEventListener('scroll', function once() {
      if (window.scrollY > 80) { cue.style.opacity = '0'; window.removeEventListener('scroll', once); }
    }, { passive: true });

    // Client trust logos strip (real client assets)
    var logos = ['assets/lal.png', 'assets/kirtilals.png', 'assets/tradescribe.png', 'assets/farmfres.png'];
    var content = hero.querySelector('.hero-content');
    if (content) {
      var strip = document.createElement('div');
      strip.className = 'ng-trust-logos';
      var imgs = logos.map(function (src) {
        return '<img src="' + src + '" alt="DigiRise client logo" loading="lazy" height="30">';
      }).join('');
      strip.innerHTML =
        '<span class="ng-trust-label">Trusted by:</span>' +
        '<div class="ng-trust-track">' + imgs + imgs + '</div>';
      content.appendChild(strip);
    }
  }

  /* ───────────────────────────────────────────
     3 · VELOCITY MARQUEE (scroll-reactive speed)
     ─────────────────────────────────────────── */
  function initVelocityMarquee() {
    if (REDUCE) return;
    var tracks = document.querySelectorAll('.marquee-track');
    if (!tracks.length) return;
    var lastY = window.scrollY, vel = 0, pos = 0, raf;
    window.addEventListener('scroll', function () {
      vel += Math.min(Math.abs(window.scrollY - lastY), 40);
      lastY = window.scrollY;
    }, { passive: true });
    function tick() {
      vel *= 0.92;
      pos -= (0.6 + vel * 0.06);
      tracks.forEach(function (t) {
        var w = t.scrollWidth / 2 || 1;
        var p = pos % w;
        t.style.transform = 'translateX(' + p + 'px)';
        t.style.animation = 'none'; // take over from CSS anim
      });
      raf = requestAnimationFrame(tick);
    }
    tick();
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(raf); else tick();
    });
  }

  /* ───────────────────────────────────────────
     4 · REELS CINEMA: center-active spotlight
     ─────────────────────────────────────────── */
  function initReelsCinema() {
    var sec = document.getElementById('reels-showcase');
    if (!sec) return;
    var cards = sec.querySelectorAll('[class*="reel-card"], .reel');
    if (!cards.length) {
      // fallback: video parents
      cards = sec.querySelectorAll('video');
      cards = Array.prototype.map.call(cards, function (v) { return v.closest('div'); });
    }
    if (!cards.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle('ng-reel-active', en.intersectionRatio > 0.75);
        en.target.classList.toggle('ng-reel-dim', en.intersectionRatio < 0.4 && en.intersectionRatio > 0);
      });
    }, { threshold: [0, 0.4, 0.75, 1] });
    Array.prototype.forEach.call(cards, function (c) { if (c) io.observe(c); });
  }

  /* ───────────────────────────────────────────
     5 · 3D TILT for package + project cards
     ─────────────────────────────────────────── */
  function initTilt() {
    if (TOUCH || REDUCE) return;
    var sel = '#packages .pkg-card, #packages [class*="package-card"], #packages [class*="price-card"], #projects [class*="proj-card"]';
    document.querySelectorAll(sel).forEach(function (card) {
      card.classList.add('ng-tilt');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (dx * 7) + 'deg) rotateX(' + (-dy * 7) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ───────────────────────────────────────────
     6 · TIMELINE: scroll-drawn line fill
     ─────────────────────────────────────────── */
  function initTimelineDraw() {
    var sec = document.getElementById('results-timeline');
    if (!sec) return;
    var line = document.createElement('div');
    line.className = 'ng-timeline-line';
    line.innerHTML = '<div class="ng-line-fill"></div>';
    sec.style.position = 'relative';
    sec.insertBefore(line, sec.firstChild);
    var fill = line.querySelector('.ng-line-fill');
    window.addEventListener('scroll', function () {
      var r = sec.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 0.5)));
      fill.style.setProperty('--fill', (progress * 100) + '%');
      fill.style.height = (progress * 100) + '%';
    }, { passive: true });
  }

  /* ───────────────────────────────────────────
     7 · PROCESS: travelling flow dot
     ─────────────────────────────────────────── */
  function initFlowDot() {
    if (REDUCE) return;
    var sec = document.getElementById('process');
    if (!sec) return;
    var steps = sec.querySelectorAll('[class*="step"]');
    if (steps.length < 2) return;
    var dot = document.createElement('div');
    dot.className = 'ng-flow-dot';
    sec.style.position = 'relative';
    sec.appendChild(dot);
    var idx = 0;
    setInterval(function () {
      var target = steps[idx % steps.length];
      if (!target) return;
      var r = target.getBoundingClientRect();
      var pr = sec.getBoundingClientRect();
      dot.style.opacity = '1';
      dot.style.transition = 'left 0.9s cubic-bezier(0.4,0,0.2,1), top 0.9s cubic-bezier(0.4,0,0.2,1)';
      dot.style.left = (r.left - pr.left + r.width / 2 - 5) + 'px';
      dot.style.top = (r.top - pr.top - 6) + 'px';
      idx++;
    }, 1400);
  }

  /* ───────────────────────────────────────────
     8 · PROJECTS: grid neighbor dim
     ─────────────────────────────────────────── */
  function initProjectsSpotlight() {
    if (TOUCH) return;
    var grids = document.querySelectorAll('#projects [class*="grid"], #projects [class*="proj-list"]');
    grids.forEach(function (g) {
      g.addEventListener('pointerenter', function () { g.classList.add('ng-grid-dim'); });
      g.addEventListener('pointerleave', function () { g.classList.remove('ng-grid-dim'); });
    });
  }

  /* ───────────────────────────────────────────
     9 · FAQ 2.0: live search
     ─────────────────────────────────────────── */
  function initFaqSearch() {
    var faq = document.getElementById('faq');
    var list = document.getElementById('faqList');
    if (!faq || !list) return;

    var box = document.createElement('div');
    box.className = 'ng-faq-search';
    box.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<input type="search" placeholder="FAQ mein search karo… (e.g. pricing, refund)" aria-label="Search FAQs">';
    list.parentNode.insertBefore(box, list);

    var noRes = document.createElement('div');
    noRes.className = 'ng-faq-noresult ng-faq-hidden';
    noRes.innerHTML = 'Kuch nahi mila — <a href="https://wa.me/917439133880" target="_blank" rel="noopener" style="color:var(--gold);font-weight:700;">WhatsApp pe seedha pucho →</a>';
    list.parentNode.insertBefore(noRes, list.nextSibling);

    box.querySelector('input').addEventListener('input', function () {
      var q = this.value.toLowerCase().trim();
      var items = list.children;
      var visible = 0;
      Array.prototype.forEach.call(items, function (item) {
        var match = !q || item.textContent.toLowerCase().indexOf(q) > -1;
        item.classList.toggle('ng-faq-hidden', !match);
        if (match) visible++;
      });
      noRes.classList.toggle('ng-faq-hidden', visible > 0);
    });
  }

  /* ───────────────────────────────────────────
     10 · SECTION DOTS NAV (right edge)
     ─────────────────────────────────────────── */
  function initDotsNav() {
    var sections = [
      ['reels-showcase', 'Our Work'],
      ['roi-calc', 'ROI Calculator'],
      ['packages', 'Packages'],
      ['before-after', 'Real Clients'],
      ['projects', 'Projects'],
      ['faq', 'FAQ'],
      ['blog', 'Blog']
    ].filter(function (s) { return document.getElementById(s[0]); });
    if (sections.length < 3) return;

    var nav = document.createElement('div');
    nav.className = 'ng-dots-nav';
    nav.setAttribute('aria-label', 'Section navigation');
    sections.forEach(function (s) {
      var b = document.createElement('button');
      b.className = 'ng-dot';
      b.type = 'button';
      b.innerHTML = '<span class="ng-dot-label">' + s[1] + '</span>';
      b.addEventListener('click', function () {
        document.getElementById(s[0]).scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
      });
      nav.appendChild(b);
    });
    document.body.appendChild(nav);

    var dots = nav.querySelectorAll('.ng-dot');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var idx = sections.findIndex(function (s) { return s[0] === en.target.id; });
        if (idx > -1 && en.isIntersecting) {
          dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { io.observe(document.getElementById(s[0])); });
  }

  /* ───────────────────────────────────────────
     11 · WHATSAPP WIDGET (preset chips)
     ─────────────────────────────────────────── */
  function initWaWidget() {
    var WA = 'https://wa.me/917439133880?text=';
    var widget = document.createElement('div');
    widget.className = 'ng-wa-widget';
    widget.innerHTML =
      '<div class="ng-wa-panel" id="ngWaPanel">' +
        '<div class="ng-wa-head">' +
          '<div class="ng-wa-avatar">DR</div>' +
          '<div><div class="ng-wa-head-name">DigiRise India</div>' +
          '<div class="ng-wa-head-status">Usually replies in 10 min</div></div>' +
        '</div>' +
        '<div class="ng-wa-body">' +
          '<div class="ng-wa-msg">Namaste! 👋 Business grow karna hai? Ek option choose karo:</div>' +
          '<div class="ng-wa-chips">' +
            '<button class="ng-wa-chip" data-msg="Hi! Free Digital Audit (worth ₹3,499) chahiye mere business ke liye.">🎁 Free Audit chahiye</button>' +
            '<button class="ng-wa-chip" data-msg="Hi! Website banwani hai — pricing bata do please.">💻 Website banwani hai</button>' +
            '<button class="ng-wa-chip" data-msg="Hi! Meta/Google Ads chalwane hain — details do.">📈 Ads chalwane hain</button>' +
            '<button class="ng-wa-chip" data-msg="Hi! DigiRise ke packages ke baare mein baat karni hai.">💬 Kuch aur puchna hai</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="ng-wa-fab" id="ngWaFab" aria-label="Chat on WhatsApp">' +
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '</button>';
    document.body.appendChild(widget);

    var panel = widget.querySelector('#ngWaPanel');
    widget.querySelector('#ngWaFab').addEventListener('click', function () {
      panel.classList.toggle('open');
    });
    widget.querySelectorAll('.ng-wa-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        window.open(WA + encodeURIComponent(chip.getAttribute('data-msg')), '_blank', 'noopener');
        panel.classList.remove('open');
      });
    });
    document.addEventListener('click', function (e) {
      if (!widget.contains(e.target)) panel.classList.remove('open');
    });
  }

  /* ───────────────────────────────────────────
     12 · EXIT INTENT MODAL (desktop, once/session)
     ─────────────────────────────────────────── */
  function initExitIntent() {
    if (TOUCH) return;
    if (sessionStorage.getItem('ngExitShown')) return;

    var overlay = document.createElement('div');
    overlay.className = 'ng-exit-overlay';
    overlay.innerHTML =
      '<div class="ng-exit-modal" role="dialog" aria-modal="true" aria-label="Free audit offer">' +
        '<button class="ng-exit-close" aria-label="Close">✕</button>' +
        '<span class="ng-exit-emoji">👋</span>' +
        '<h3>Ruko! Kuch free le jao</h3>' +
        '<p>Jaane se pehle apna <strong>FREE Digital Audit (worth ₹3,499)</strong> claim kar lo — tumhare business ki website, Google presence aur social media ka full checkup. Bilkul free, no strings.</p>' +
        '<a href="https://wa.me/917439133880?text=Hi!%20Free%20Digital%20Audit%20claim%20karna%20hai%20(exit%20offer)" target="_blank" rel="noopener" class="btn-primary">🎁 Free Audit Claim Karo</a>' +
      '</div>';
    document.body.appendChild(overlay);

    function show() {
      if (sessionStorage.getItem('ngExitShown')) return;
      sessionStorage.setItem('ngExitShown', '1');
      overlay.classList.add('show');
    }
    function hide() { overlay.classList.remove('show'); }

    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 8) show();
    });
    overlay.querySelector('.ng-exit-close').addEventListener('click', hide);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  }

  /* ───────────────────────────────────────────
     13 · CTA AURORA + FOOTER WATERMARK injectors
     ─────────────────────────────────────────── */
  function initDecorations() {
    var cta = document.querySelector('.cta-section');
    if (cta) {
      var a = document.createElement('div');
      a.className = 'ng-aurora';
      cta.insertBefore(a, cta.firstChild);
    }
    var footer = document.querySelector('footer');
    if (footer) {
      var w = document.createElement('div');
      w.className = 'ng-footer-watermark';
      w.setAttribute('aria-hidden', 'true');
      w.textContent = 'DIGIRISE';
      footer.appendChild(w);
    }
  }

  /* ───────────────────────────────────────────
     14 · DIRECTIONAL REVEALS on section headers
     ─────────────────────────────────────────── */
  function initReveals() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('ng-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.ng-reveal, .ng-reveal-left, .ng-reveal-right').forEach(function (el) { io.observe(el); });
  }

  /* ───────────────────────────────────────────
     15 · THEME cross-fade enabler
     ─────────────────────────────────────────── */
  function initThemeFade() {
    document.documentElement.classList.add('ng-theme-fade');
  }

  /* ═══════════════ BOOT ═══════════════ */
  onReady(function () {
    try { initNavbar(); } catch (e) { console.warn('[NG]', e); }
    try { initHero(); } catch (e) { console.warn('[NG]', e); }
    try { initVelocityMarquee(); } catch (e) { console.warn('[NG]', e); }
    try { initReelsCinema(); } catch (e) { console.warn('[NG]', e); }
    try { initTilt(); } catch (e) { console.warn('[NG]', e); }
    try { initTimelineDraw(); } catch (e) { console.warn('[NG]', e); }
    try { initFlowDot(); } catch (e) { console.warn('[NG]', e); }
    try { initProjectsSpotlight(); } catch (e) { console.warn('[NG]', e); }
    try { initFaqSearch(); } catch (e) { console.warn('[NG]', e); }
    try { initDotsNav(); } catch (e) { console.warn('[NG]', e); }
    try { initWaWidget(); } catch (e) { console.warn('[NG]', e); }
    try { initExitIntent(); } catch (e) { console.warn('[NG]', e); }
    try { initDecorations(); } catch (e) { console.warn('[NG]', e); }
    try { initReveals(); } catch (e) { console.warn('[NG]', e); }
    try { initThemeFade(); } catch (e) { console.warn('[NG]', e); }
  });
})();
