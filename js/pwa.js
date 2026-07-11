// DigiRise India — PWA Logic (v1)

(function(){
  'use strict';
  
  // 1. Detect Standalone Mode & add class for CSS hooks
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (isStandalone) {
    document.documentElement.classList.add('pwa-standalone');
    
    // Request persistent storage if standalone
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(granted => {
        if (granted) console.log('[PWA] Storage persisted');
      });
    }
  }

  // 2. Install Prompt Logic
  let deferredPrompt = null;
  const installCardId = 'pwa-install-card';
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67+ from automatically showing the prompt
    e.preventDefault();
    deferredPrompt = e;
    checkInstallTriggers();
  });

  window.addEventListener('appinstalled', () => {
    // Log to GA4
    if(typeof gtag === 'function') gtag('event', 'pwa_installed');
    hideInstallCard();
    localStorage.setItem('dr_pwa_installed', '1');
  });

  function checkInstallTriggers() {
    if (isStandalone || localStorage.getItem('dr_pwa_installed') || localStorage.getItem('dr_pwa_snooze')) {
      return; // Already installed or snoozed
    }
    
    // Trigger 1: 30 seconds on site
    setTimeout(showInstallCard, 30000);
    
    // Trigger 2: 2nd visit
    let visits = parseInt(localStorage.getItem('dr_visits') || '0');
    if (visits >= 2) showInstallCard();
    
    // Trigger 3: Scroll past packages
    const pkgSec = document.getElementById('packages');
    if (pkgSec && window.IntersectionObserver) {
      new IntersectionObserver((entries, obs) => {
        if(entries[0].isIntersecting) {
          showInstallCard();
          obs.disconnect();
        }
      }).observe(pkgSec);
    }
  }

  // Increment visit counter
  if(!sessionStorage.getItem('dr_session_logged')){
    let v = parseInt(localStorage.getItem('dr_visits') || '0');
    localStorage.setItem('dr_visits', v + 1);
    sessionStorage.setItem('dr_session_logged', '1');
  }

  function showInstallCard() {
    if(document.getElementById(installCardId) || (!deferredPrompt && !isIosSafari())) return;
    
    const card = document.createElement('div');
    card.id = installCardId;
    card.className = 'pwa-install-card';
    card.innerHTML = `
      <div class="pic-content">
        <img src="icon-192.png" alt="DigiRise App" class="pic-icon">
        <div class="pic-text">
          <h4>DigiRise ko apne phone pe rakho</h4>
          <p>1 tap mein audit, packages, aur WhatsApp</p>
        </div>
      </div>
      <div class="pic-actions">
        <button class="pic-btn pic-snooze">Baad mein</button>
        <button class="pic-btn pic-install">Install App</button>
      </div>
    `;
    document.body.appendChild(card);
    
    // Slide in animation
    requestAnimationFrame(() => card.classList.add('show'));
    
    card.querySelector('.pic-snooze').addEventListener('click', () => {
      localStorage.setItem('dr_pwa_snooze', Date.now()); // Snooze for 7 days handled conceptually
      hideInstallCard();
    });
    
    card.querySelector('.pic-install').addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
          hideInstallCard();
        }
      } else if (isIosSafari()) {
        // Transform card to show iOS instructions
        card.innerHTML = `
          <div class="pic-ios-sheet">
            <p>To install: Tap the <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg> <b>Share</b> icon below, then select <b>Add to Home Screen</b>.</p>
            <button class="pic-btn pic-snooze" style="margin-top:8px;width:100%">Got it</button>
          </div>
        `;
        card.querySelector('.pic-snooze').addEventListener('click', hideInstallCard);
      }
    });
  }

  function hideInstallCard() {
    const card = document.getElementById(installCardId);
    if(card) {
      card.classList.remove('show');
      setTimeout(() => card.remove(), 400);
    }
  }

  function isIosSafari() {
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isSafari = isIOS && webkit && !ua.match(/CriOS/i);
    return isSafari && !isStandalone;
  }

  // Clear snooze if > 7 days
  const snoozeDate = localStorage.getItem('dr_pwa_snooze');
  if (snoozeDate && (Date.now() - parseInt(snoozeDate)) > 7 * 24 * 60 * 60 * 1000) {
    localStorage.removeItem('dr_pwa_snooze');
  }

  // 3. Online/Offline indicator toasts
  function showToast(msg, isError) {
    let t = document.getElementById('pwa-toast');
    if(!t) {
      t = document.createElement('div');
      t.id = 'pwa-toast';
      document.body.appendChild(t);
    }
    t.className = 'pwa-toast' + (isError ? ' error' : '') + ' show';
    t.textContent = msg;
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  window.addEventListener('online', () => showToast('⚡ Wapas online!'));
  window.addEventListener('offline', () => showToast('📴 Offline mode', true));

  // 4. Service Worker Update Notification
  let newWorker = null;
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        showUpdateToast();
      }
    });
    
    // Register SW
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateToast();
            }
          });
        });
      });
    });
  }

  function showUpdateToast() {
    if(document.getElementById('pwa-update-toast')) return;
    const t = document.createElement('div');
    t.id = 'pwa-update-toast';
    t.className = 'pwa-update-toast show';
    t.innerHTML = '<span>New version available</span><button id="pwa-refresh-btn">Refresh</button>';
    document.body.appendChild(t);
    
    document.getElementById('pwa-refresh-btn').addEventListener('click', () => {
      if (newWorker) newWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    });
  }

  // 5. Web Share API (bind to any .btn-share)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-share');
    if(!btn) return;
    e.preventDefault();
    
    const shareData = {
      title: 'DigiRise India',
      text: 'Check out DigiRise India - Digital Marketing & Web Design Agency',
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        showToast('Link copy ho gaya ✓');
      });
    }
  });

})();
