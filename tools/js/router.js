/**
 * DigiRise Tools Hub v2 - Command Router
 * Parses user input to auto-select the best tool and prefill parameters.
 */

function parseCommandAndRoute(input, selectedAgent, selectedTool, selectedMode) {
  input = input.trim();
  if (!input) return;

  saveToHistory(input, selectedTool);

  if (selectedAgent === 'manual') {
    if (selectedTool !== 'auto') {
      window.location.href = `/tools/${selectedTool}/`;
      return;
    }
  }

  let targetTool = selectedTool !== 'auto' ? selectedTool : 'search';
  let params = new URLSearchParams();
  params.set('autorun', '1');
  if (selectedMode && selectedMode !== 'Standard') {
    params.set('mode', selectedMode.toLowerCase());
  }

  const lowerInput = input.toLowerCase();

  const urlRegex = /(https?:\/\/[^\s]+)|([a-z0-9-]+\.[a-z]{2,})/i;
  if (urlRegex.test(input) || lowerInput.includes('speed') || lowerInput.includes('lighthouse')) {
    targetTool = 'website-speed-checker';
    const match = input.match(urlRegex);
    if (match) {
      let url = match[0];
      if (!url.startsWith('http')) url = 'https://' + url;
      params.set('url', url);
    }
  }
  else if (lowerInput.includes('budget') || lowerInput.includes('spend') || lowerInput.includes('₹') || lowerInput.includes('rupee') || lowerInput.includes('ads me kitna')) {
    targetTool = 'ad-budget-calculator';
    const numMatch = input.match(/\d+(,\d+)*(\.\d+)?/);
    if (numMatch) {
      params.set('budget', numMatch[0].replace(/,/g, ''));
    }
  }
  else if (lowerInput.includes('roi') || lowerInput.includes('return') || lowerInput.includes('profit')) {
    targetTool = 'roi-calculator';
    const numMatch = input.match(/\d+(,\d+)*(\.\d+)?/);
    if (numMatch) {
      params.set('spend', numMatch[0].replace(/,/g, ''));
    }
  }
  else if (lowerInput.includes('copy') || lowerInput.includes('caption') || lowerInput.includes('ad likho') || lowerInput.includes('headline')) {
    targetTool = 'ad-copy-generator';
    params.set('brief', input);
  }

  if (targetTool === 'search') {
    const searchInput = document.getElementById('hubSearchInput');
    if (searchInput) {
      searchInput.value = input;
      searchInput.dispatchEvent(new Event('input'));
      const allToolsTab = document.querySelector('.tab-btn[data-tab="all-tools"]');
      if (allToolsTab) allToolsTab.click();
    }
  } else {
    window.location.href = `/tools/${targetTool}/?${params.toString()}`;
  }
}

function saveToHistory(inputSummary, toolId) {
  try {
    let history = JSON.parse(localStorage.getItem('dr_tools_history') || '[]');
    history.unshift({
      tool: toolId,
      inputSummary: inputSummary,
      timestamp: new Date().toISOString(),
      resultSummary: 'Run via Command Card'
    });
    history = history.slice(0, 10);
    localStorage.setItem('dr_tools_history', JSON.stringify(history));
  } catch(e) {}
}
