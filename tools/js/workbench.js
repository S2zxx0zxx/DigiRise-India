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

  async handleCommand() {
    let toolId = this.toolSelect.value;
    const inputStr = this.cmdInput.value.trim();
    
    if (toolId === 'auto' || toolId === 'manual') {
      if (toolId === 'auto') {
        toolId = this.detectTool(inputStr);
      } else {
        return; // manual needs a selected tool
      }
    }

    const engine = this.engines[toolId];
    if (!engine) return;

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
