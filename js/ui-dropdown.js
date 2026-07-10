/* ═══════════════════════════════════════════════
   DigiRise India — UI Dropdown Controller (FIX-3)
   Handles both Nav Dropdowns and Native Select Replacement
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavDropdowns();
  initCustomSelects();
});

function initNavDropdowns() {
  const dropdowns = document.querySelectorAll('.ui-dropdown');
  
  dropdowns.forEach(dd => {
    const trigger = dd.querySelector('.ui-dropdown-trigger');
    const menu = dd.querySelector('.ui-dropdown-menu');
    if (!trigger || !menu) return;
    
    const isHover = dd.getAttribute('data-trigger') === 'hover';
    
    if (isHover && window.innerWidth > 980) {
      // Hover only works well on desktop
      dd.addEventListener('mouseenter', () => dd.classList.add('open'));
      dd.addEventListener('mouseleave', () => dd.classList.remove('open'));
    } else {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // close others
        dropdowns.forEach(other => {
          if (other !== dd) other.classList.remove('open');
        });
        
        dd.classList.toggle('open');
      });
    }
  });

  document.addEventListener('click', (e) => {
    dropdowns.forEach(dd => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
      }
    });
  });
}

function initCustomSelects() {
  document.querySelectorAll('select').forEach(select => {
    // Skip if already initialized
    if (select.dataset.customized) return;
    select.dataset.customized = "true";
    select.style.display = 'none';
    
    const wrap = document.createElement('div');
    wrap.className = 'ui-custom-select';
    
    const trigger = document.createElement('div');
    trigger.className = 'ui-cs-trigger';
    
    const valText = document.createElement('span');
    valText.className = 'ui-cs-val';
    valText.textContent = select.options[select.selectedIndex]?.text || 'Select...';
    
    const arrow = document.createElement('span');
    arrow.className = 'ui-cs-arrow';
    arrow.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    
    trigger.appendChild(valText);
    trigger.appendChild(arrow);
    
    const menuWrap = document.createElement('div');
    menuWrap.className = 'ui-cs-menu';
    
    Array.from(select.options).forEach((opt, idx) => {
      const item = document.createElement('div');
      item.className = 'ui-cs-item';
      if (select.selectedIndex === idx) item.classList.add('selected');
      item.textContent = opt.text;
      item.dataset.value = opt.value;
      
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        // Update original select
        select.selectedIndex = idx;
        valText.textContent = opt.text;
        
        // Update selected class
        menuWrap.querySelectorAll('.ui-cs-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        // Close menu
        wrap.classList.remove('open');
        
        // Fire change event for listeners
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      menuWrap.appendChild(item);
    });
    
    wrap.appendChild(trigger);
    wrap.appendChild(menuWrap);
    
    select.parentNode.insertBefore(wrap, select.nextSibling);
    
    // Toggle logic
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.ui-custom-select.open').forEach(w => {
        if (w !== wrap) w.classList.remove('open');
      });
      wrap.classList.toggle('open');
    });
    
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
      }
    });
  });
}
