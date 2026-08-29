(function() {
  'use strict';
  
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function toggleMenu() {
    const m = document.getElementById('mobileMenu');
    if (m) m.classList.toggle('active');
  }

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('dr_theme', newTheme);
    
    const sun = document.querySelector('.sun-ico');
    const moon = document.querySelector('.moon-ico');
    if (sun) sun.style.display = newTheme === 'dark' ? 'block' : 'none';
    if (moon) moon.style.display = newTheme === 'dark' ? 'none' : 'block';
  }

  // Init theme
  if(localStorage.getItem('dr_theme') === 'light') {
    toggleTheme();
  }

  onReady(function() {
    // 1. Mobile Menu
    document.querySelectorAll('.hamburger, #mobileMenu a').forEach(function(el) {
      el.addEventListener('click', function(e) {
        toggleMenu();
      });
    });

    // 2. Theme Toggle
    document.querySelectorAll('.fab-theme-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        toggleTheme();
      });
    });

    // 3. Back to Top
    document.querySelectorAll('.fab-center').forEach(function(btn) {
      btn.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      });
    });

    // 4. FAQ Toggle
    document.querySelectorAll('.faq-q').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function(el) {
          el.classList.remove('open');
        });
        if(!isOpen) item.classList.add('open');
      });
    });
  });
})();
