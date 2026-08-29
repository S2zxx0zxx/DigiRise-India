// tools/js/workbench.js
// Central controller for the AI Agent Workbench

window.DigiRiseWorkbench = {
  engines: window.DigiRiseEngines || {},
  state: {
    activeToolId: null,
    stream: []
  },

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.renderRail();
    this.loadHubUI(); // Replaces hub.js
    
    // Parse URL for deep links
    const params = new URLSearchParams(window.location.search);
    const toolSlug = params.get('tool') || params.get('q');
    
    if (toolSlug && this.engines[toolSlug]) {
      this.toolSelect.value = toolSlug;
      this.loadTool(toolSlug);
    } else {
      this.showEmptyState();
    }
  },

  cacheDOM() {
    this.toolSelect = document.getElementById('toolSelect');
    this.modeSelect = document.getElementById('modeSelect');
    this.agentSelect = document.getElementById('agentSelect');
    this.cmdInput = document.getElementById('cmdInput');
    this.cmdSubmit = document.getElementById('cmdSubmit');
    
    this.workspace = document.getElementById('workspace');
    this.fanSection = document.querySelector('.hub-fan-section');
    this.heroSection = document.querySelector('.hub-hero');
    
    // Create Stream container if it doesn't exist
    let stream = document.getElementById('workStream');
    if (!stream) {
      stream = document.createElement('div');
      stream.id = 'workStream';
      stream.className = 'work-stream';
      
      // We will place it inside the workspace, but we need to keep the header/tabs.
      // Wait, the prompt says workspace contains the stream. 
      // I will just append it to the main content area.
      this.workspace.appendChild(stream);
    }
    this.workStream = stream;
    
    // Left Rail
    let rail = document.getElementById('toolRail');
    if (!rail) {
      rail = document.createElement('div');
      rail.id = 'toolRail';
      rail.className = 'tool-rail';
      const main = document.querySelector('.hub-main');
      main.insertBefore(rail, this.workspace);
    }
    this.toolRail = rail;
  },

  bindEvents() {
    this.cmdSubmit.addEventListener('click', () => this.handleCommand());
    this.cmdInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleCommand();
    });
    
    this.toolSelect.addEventListener('change', () => {
      const toolId = this.toolSelect.value;
      if (toolId && toolId !== 'auto' && this.engines[toolId]) {
        this.loadTool(toolId);
      } else {
        this.showEmptyState();
      }
    });
  },

  renderRail() {
    this.toolRail.innerHTML = '';
    Object.values(this.engines).forEach(engine => {
      const btn = document.createElement('button');
      btn.className = 'rail-btn';
      btn.innerHTML = `<span class="rail-icon">${engine.icon}</span> <span class="rail-name">${engine.name}</span>`;
      btn.dataset.id = engine.id;
      btn.addEventListener('click', () => {
        this.toolSelect.value = engine.id;
        this.loadTool(engine.id);
      });
      this.toolRail.appendChild(btn);
    });
  },

  showEmptyState() {
    this.state.activeToolId = null;
    this.workStream.style.display = 'none';
    
    // Show original hub stuff
    this.heroSection.style.display = 'block';
    this.fanSection.style.display = 'block';
    const workspaceContent = document.querySelector('.workspace-content');
    if(workspaceContent) workspaceContent.style.display = 'block';
    
    this.updateRailSelection(null);
  },

  loadTool(toolId) {
    this.state.activeToolId = toolId;
    this.heroSection.style.display = 'none';
    this.fanSection.style.display = 'none';
    const workspaceContent = document.querySelector('.workspace-content');
    if(workspaceContent) workspaceContent.style.display = 'none';
    const workspaceHeader = document.querySelector('.workspace-header');
    if(workspaceHeader) workspaceHeader.style.display = 'none';
    const tourRow = document.querySelector('.tour-row');
    if(tourRow) tourRow.style.display = 'none';
    
    this.workStream.style.display = 'flex';
    
    this.updateRailSelection(toolId);
    
    const engine = this.engines[toolId];
    if (!engine) return;

    // Create a new interaction card for the tool UI
    const card = document.createElement('div');
    card.className = 'stream-card system-card';
    
    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `<span class="card-icon">${engine.icon}</span> <strong>${engine.name}</strong> loaded.`;
    card.appendChild(header);
    
    const body = document.createElement('div');
    body.className = 'card-body';
    
    const ctx = this.getContext();
    engine.renderInput(body, ctx);
    card.appendChild(body);
    
    this.workStream.appendChild(card);
    this.scrollToBottom();
  },

  updateRailSelection(toolId) {
    document.querySelectorAll('.rail-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === toolId);
    });
  },

  getContext() {
    const agent = this.agentSelect.value;
    const mode = this.modeSelect.value;
    
    return {
      agent,
      mode,
      isPro: agent.includes('pro') || agent.includes('opus') || agent.includes('max'),
      isVerbose: agent.includes('max') || agent.includes('opus'),
      isKill: mode === 'kill',
      isFast: agent.includes('easy') || mode === 'standard'
    };
  },

  async loadHubUI() {
    const fanDeck = document.getElementById('fanDeck');
    const allToolsGrid = document.getElementById('allToolsGrid');
    if (!fanDeck || !allToolsGrid) return;
    
    try {
      const res = await fetch('/tools/tools.json');
      const data = await res.json();
      
      data.tools.forEach((t, i) => {
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
        const tiltClasses = ['tilt-left-2', 'tilt-left-1', 'tilt-center', 'tilt-right-1', 'tilt-right-2'];
        const tiltClass = tiltClasses[i] || 'tilt-right-2';
        const fanCard = document.createElement('div');
        fanCard.className = `fan-card ${tiltClass} ${t.status === 'soon' ? 'soon' : ''}`;
        fanCard.innerHTML = `<div class="fc-icon">${t.icon}</div><div class="fc-label">${t.name}</div>`;
        if (t.status !== 'soon') {
          fanCard.addEventListener('click', () => {
            this.toolSelect.value = t.slug;
            this.cmdInput.focus();
          });
          fanCard.addEventListener('dblclick', () => {
            window.location.href = `/tools/${t.slug}/`;
          });
        }
        fanDeck.appendChild(fanCard);
      });
    } catch(e) { console.warn('Tools.json failed to load', e); }

    // Typewriter placeholders
    const placeholders = ["Check my website speed...", "Plan my ad budget...", "Calculate ROI for 5000 spend...", "Write ad copy for fashion brand..."];
    let phIdx = 0;
    setInterval(() => {
      phIdx = (phIdx + 1) % placeholders.length;
      if (this.cmdInput) this.cmdInput.placeholder = placeholders[phIdx];
    }, 3000);

    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = document.getElementById('pane-' + btn.dataset.tab);
        if (pane) pane.classList.add('active');
        if (btn.dataset.tab === 'recent') this.loadRecent();
      });
    });

    // Search
    const searchInput = document.getElementById('hubSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const cards = allToolsGrid.querySelectorAll('.tool-card');
        cards.forEach(c => {
          c.style.display = c.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
        });
      });
    }

    // View toggle
    const viewToggle = document.getElementById('viewToggle');
    if (viewToggle) {
      viewToggle.addEventListener('click', () => allToolsGrid.classList.toggle('list-view'));
    }
  },

  loadRecent() {
    const list = document.getElementById('recentList');
    if (!list) return;
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
          <button class="tool-btn secondary" onclick="window.location.href='/tools/${h.tool}/'">Run in tab</button>
          <button class="tool-btn secondary" onclick="document.getElementById('cmdInput').value='${h.inputSummary.replace(/'/g, "\\'")}'; document.getElementById('toolSelect').value='${h.tool}'; document.getElementById('cmdSubmit').click();">Run inline</button>
        `;
        list.appendChild(item);
      });
    } catch(e) {
      console.warn("Failed to load recent tools:", e);
    }
  },

  saveToHistory(inputSummary, toolId) {
    try {
      let history = JSON.parse(localStorage.getItem('dr_tools_history') || '[]');
      history.unshift({
        tool: toolId,
        inputSummary: inputSummary,
        timestamp: new Date().toISOString(),
        resultSummary: 'Run via AI Workbench'
      });
      history = history.slice(0, 10);
      localStorage.setItem('dr_tools_history', JSON.stringify(history));
    } catch(e) {
      console.warn("Failed to save tool history:", e);
    }
  },

  async handleCommand() {
    let toolId = this.toolSelect.value;
    const inputStr = this.cmdInput.value.trim();
    
    if (toolId === 'auto' || toolId === 'manual') {
      if (toolId === 'auto') {
        toolId = this.detectTool(inputStr);
      } else {
        const tId = this.detectTool(inputStr);
        window.location.href = `/tools/${tId}/?autorun=1&q=` + encodeURIComponent(inputStr);
        return;
      }
    }

    const engine = this.engines[toolId];
    if (!engine) return;
    
    this.saveToHistory(inputStr, toolId);

    if (this.state.activeToolId !== toolId) {
      this.toolSelect.value = toolId;
      this.loadTool(toolId);
    }

    if (!inputStr) return; // Need input to run

    const userCard = document.createElement('div');
    userCard.className = 'stream-card user-card';
    userCard.innerHTML = `<div class="card-body">${inputStr}</div>`;
    this.workStream.appendChild(userCard);
    
    this.cmdInput.value = '';
    this.scrollToBottom();

    const resultCard = document.createElement('div');
    resultCard.className = 'stream-card agent-card';
    resultCard.innerHTML = `<div class="card-header"><span class="card-icon">⚙️</span> <strong>Running ${engine.name}...</strong></div><div class="card-body"><div class="spinner">Processing...</div></div>`;
    this.workStream.appendChild(resultCard);
    this.scrollToBottom();

    try {
      const ctx = this.getContext();
      const data = await engine.run({ q: inputStr }, ctx);
      
      resultCard.querySelector('.card-header').innerHTML = `<span class="card-icon">${engine.icon}</span> <strong>${engine.name}</strong>`;
      const body = resultCard.querySelector('.card-body');
      body.innerHTML = '';
      
      engine.renderResult(body, data, ctx);
    } catch (err) {
      resultCard.querySelector('.card-body').innerHTML = `<div class="term-err" style="color:var(--error,#ff5c5c)">Error: ${err.message}</div>`;
    }
    this.scrollToBottom();
  },

  detectTool(query) {
    query = query.toLowerCase();
    if (query.match(/speed|lighthouse|core web vitals|slow/)) return 'website-speed-checker';
    if (query.match(/budget|spend|cost/)) return 'ad-budget-calculator';
    if (query.match(/roi|roas|return/)) return 'roi-calculator';
    if (query.match(/copy|ad text|write/)) return 'ad-copy-generator';
    if (query.match(/meta|title|seo|og|twitter/)) return 'meta-tag-analyzer';
    if (query.match(/hash|tag/)) return 'hashtag-generator';
    if (query.match(/wa|whatsapp|wa.me/)) return 'whatsapp-link';
    if (query.match(/caption|length/)) return 'caption-length';
    
    return 'website-speed-checker';
  },

  scrollToBottom() {
    // Only scroll the stream if it's visible
    if(this.workStream && this.workStream.style.display !== 'none') {
        this.workStream.scrollTop = this.workStream.scrollHeight;
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.DigiRiseWorkbench) {
    window.DigiRiseWorkbench.init();
  }
});
