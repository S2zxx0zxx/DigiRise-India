document.addEventListener('DOMContentLoaded', async () => {
  const budgetInput = document.getElementById('budgetInput');
  const industrySelect = document.getElementById('industrySelect');
  const goalSelect = document.getElementById('goalSelect');
  const runBtn = document.getElementById('runBtn');
  
  const term = document.getElementById('terminal');
  const resultBlock = document.getElementById('resultBlock');

  const clicksVal = document.getElementById('clicksVal');
  const convVal = document.getElementById('convVal');
  const cpcVal = document.getElementById('cpcVal');
  const cpaVal = document.getElementById('cpaVal');

  let benchmarks = null;

  try {
    const res = await fetch('/tools/data/benchmarks.json');
    benchmarks = await res.json();
    benchmarks.industries.forEach(ind => {
      const opt = document.createElement('option');
      opt.value = ind.name;
      opt.textContent = ind.name;
      industrySelect.appendChild(opt);
    });
  } catch(e) {
    console.error('Failed to load benchmarks', e);
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has('budget')) budgetInput.value = params.get('budget');
  
  if (params.get('autorun') === '1' && budgetInput.value) {
    setTimeout(runCalc, 500); // wait for fetch
  }

  runBtn.addEventListener('click', runCalc);
  budgetInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') runCalc();
  });

  function runCalc() {
    const budget = parseFloat(budgetInput.value);
    if (!budget || isNaN(budget) || budget <= 0) return alert('Enter a valid budget amount');
    if (!benchmarks) return alert('Data loading, try again in a moment');

    term.classList.add('active');
    resultBlock.classList.remove('active');
    term.innerHTML = '';

    logTerm(`> INIT BUDGET CALCULATION: ₹${budget.toLocaleString()}`);
    logTerm(`> INDUSTRY: ${industrySelect.value} | GOAL: ${goalSelect.value}`);
    
    setTimeout(() => {
      const indData = benchmarks.industries.find(i => i.name === industrySelect.value) || benchmarks.industries[0];
      const goalData = benchmarks.goals[goalSelect.value];

      // Use average of range
      let avgCpc = (indData.cpc_range[0] + indData.cpc_range[1]) / 2;
      let avgCvr = (indData.cvr_range[0] + indData.cvr_range[1]) / 2;

      // Apply multipliers
      avgCpc *= goalData.cpc_multiplier;
      avgCvr *= goalData.cvr_multiplier;

      const clicks = Math.floor(budget / avgCpc);
      const conversions = Math.floor(clicks * (avgCvr / 100));
      const cpa = conversions > 0 ? (budget / conversions) : 0;

      logTerm('> CALCULATING CLICKS AND CONVERSIONS...');

      clicksVal.textContent = clicks.toLocaleString();
      convVal.textContent = conversions.toLocaleString();
      cpcVal.textContent = '₹' + avgCpc.toFixed(2);
      cpaVal.textContent = cpa > 0 ? '₹' + cpa.toFixed(0) : 'N/A';

      setTimeout(() => {
        term.classList.remove('active');
        resultBlock.classList.add('active');
      }, 500);
    }, 600);
  }

  function logTerm(msg) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = msg;
    term.appendChild(div);
  }
});
