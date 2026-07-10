document.addEventListener('DOMContentLoaded', async () => {
  // Load tools.json
  const res = await fetch('tools.json');
  const data = await res.json();
  const tools = data.tools;

  const toolSelect = document.getElementById('toolSelect');
  const modeSelect = document.getElementById('modeSelect');
  const fanDeck = document.getElementById('fanDeck');
  const allToolsGrid = document.getElementById('allToolsGrid');
  const cmdInput = document.getElementById('cmdInput');
  const cmdSubmit = document.getElementById('cmdSubmit');
  const agentSelect = document.getElementById('agentSelect');

  // Populate Selects and grids
  tools.forEach((t, i) => {
    // Dropdown
    if(t.status !== 'soon') {
      const opt = document.createElement('option');
      opt.value = t.slug;
      opt.textContent = `Tool: ${t.name} ${t.status === 'live' ? '🟢' : ''}`;
      toolSelect.appendChild(opt);
    }

    // Grid
    const card = document.createElement('a');
    card.href = t.status !== 'soon' ? `/tools/${t.slug}/` : '#';
    card.className = `tool-card ${t.status === 'soon' ? 'disabled' : ''}`;
    card.innerHTML = `
      <div class="tc-icon">${t.icon}</div>
      <div class="tc-title">${t.name} <span class="status-dot ${t.status}"></span></div>
      <div class="tc-desc">${t.description}</div>
    `;
    allToolsGrid.appendChild(card);

    // Fan Deck
    const tiltClass = i === 0 ? 'tilt-left-2' : i === 1 ? 'tilt-left-1' : i === 2 ? 'tilt-center' : i === 3 ? 'tilt-right-1' : 'tilt-right-2';
    const fanCard = document.createElement('div');
    fanCard.className = `fan-card ${tiltClass} ${t.status === 'soon' ? 'soon' : ''}`;
    fanCard.innerHTML = `<div class="fc-icon">${t.icon}</div><div class="fc-label">${t.name}</div>`;
    if (t.status !== 'soon') {
      fanCard.addEventListener('click', () => {
        toolSelect.value = t.slug;
        updateModeSelect();
        cmdInput.focus();
      });
      fanCard.addEventListener('dblclick', () => {
        window.location.href = `/tools/${t.slug}/`;
      });
    }
    fanDeck.appendChild(fanCard);
  });

  // Mode select logic
  function updateModeSelect() {
    modeSelect.innerHTML = '';
    const selected = tools.find(t => t.slug === toolSelect.value);
    if (selected && selected.modes) {
      selected.modes.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = `Mode: ${m} ▾`;
        modeSelect.appendChild(opt);
      });
    } else {
      modeSelect.innerHTML = '<option value="Standard">Mode: Standard ▾</option>';
    }
  }
  toolSelect.addEventListener('change', updateModeSelect);

  // Submit Logic
  cmdSubmit.addEventListener('click', () => {
    parseCommandAndRoute(cmdInput.value, agentSelect.value, toolSelect.value, modeSelect.value);
  });
  cmdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      parseCommandAndRoute(cmdInput.value, agentSelect.value, toolSelect.value, modeSelect.value);
    }
  });

  // Typewriter placeholders
  const placeholders = ["Check my website speed...", "Plan my ad budget...", "Calculate ROI for 5000 spend...", "Write ad copy for fashion brand..."];
  let phIdx = 0;
  setInterval(() => {
    phIdx = (phIdx + 1) % placeholders.length;
    cmdInput.placeholder = placeholders[phIdx];
  }, 3000);

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('pane-' + btn.dataset.tab).classList.add('active');
      
      if (btn.dataset.tab === 'recent') loadRecent();
    });
  });

  // Recent
  function loadRecent() {
    const list = document.getElementById('recentList');
    try {
      const history = JSON.parse(localStorage.getItem('dr_tools_history') || '[]');
      if (history.length === 0) return;
      list.innerHTML = '';
      history.forEach(h => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        const d = new Date(h.timestamp);
        item.innerHTML = `
          <div class="ri-details">
            <div class="ri-title">${h.tool}</div>
            <div class="ri-query">"${h.inputSummary}"</div>
            <div class="ri-time">${d.toLocaleDateString()} ${d.toLocaleTimeString()}</div>
          </div>
          <button class="tool-btn secondary" onclick="window.location.href='/tools/${h.tool}/'">Run again</button>
        `;
        list.appendChild(item);
      });
    } catch(e) {}
  }

  // Search
  const searchInput = document.getElementById('hubSearchInput');
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const cards = allToolsGrid.querySelectorAll('.tool-card');
    cards.forEach(c => {
      const text = c.textContent.toLowerCase();
      c.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });

  // View toggle
  const viewToggle = document.getElementById('viewToggle');
  viewToggle.addEventListener('click', () => {
    allToolsGrid.classList.toggle('list-view');
  });

});
