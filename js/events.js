(function() {
  'use strict';
  
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  
  onReady(function() {
    // 1. Mobile Menu
    document.querySelectorAll('.hamburger, #mobileMenu a').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if(typeof toggleMenu === 'function') toggleMenu();
      });
    });

    // 2. Dark Mode
    const dmToggle = document.getElementById('dm-toggle');
    if (dmToggle) {
      dmToggle.addEventListener('click', function(e) {
        if(typeof toggleDarkMode === 'function') toggleDarkMode();
      });
    }

    // 3. Sticky CTA
    document.querySelectorAll('.sticky-cta-btn, .sticky-cta-close').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if(typeof hideStickyForever === 'function') hideStickyForever();
      });
    });

    // 4. Project Filters
    document.querySelectorAll('.pf-btn[data-filter]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        if(typeof filterProjV2 === 'function') filterProjV2(btn.getAttribute('data-filter'), btn);
      });
    });

    // 5. AI Tabs
    document.querySelectorAll('.ai-tab[data-ai]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        if(typeof switchAI === 'function') switchAI(btn.getAttribute('data-ai'), btn);
      });
    });

    // 6. AI Run Buttons
    const btnAnalyzer = document.getElementById('btnRunBizAnalyzer');
    if(btnAnalyzer) btnAnalyzer.addEventListener('click', function() { if(typeof runBizAnalyzer === 'function') runBizAnalyzer(); });
    
    const btnAdCopy = document.getElementById('btnRunAdCopy');
    if(btnAdCopy) btnAdCopy.addEventListener('click', function() { if(typeof runAdCopy === 'function') runAdCopy(); });
    
    const btnCalendar = document.getElementById('btnRunCalendar');
    if(btnCalendar) btnCalendar.addEventListener('click', function() { if(typeof runCalendar === 'function') runCalendar(); });

    // 7. Back to Top
    const backTop = document.getElementById('backTop');
    if(backTop) {
      backTop.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      });
    }

    // 8. Quiz Restart
    document.querySelectorAll('.quiz-restart').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if(typeof restartQuiz === 'function') restartQuiz();
      });
    });
  });
})();
