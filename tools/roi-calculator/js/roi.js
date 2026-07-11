document.addEventListener('DOMContentLoaded', () => {
  const spendInput = document.getElementById('spendInput');
  const cpcInput = document.getElementById('cpcInput');
  const cvrInput = document.getElementById('cvrInput');
  const aovInput = document.getElementById('aovInput');
  const runBtn = document.getElementById('runBtn');
  
  const term = document.getElementById('terminal');
  const resultBlock = document.getElementById('resultBlock');

  const roasVal = document.getElementById('roasVal');
  const revenueVal = document.getElementById('revenueVal');
  const cpaVal = document.getElementById('cpaVal');
  const breakevenVal = document.getElementById('breakevenVal');

  const params = new URLSearchParams(window.location.search);
  if (params.has('spend')) spendInput.value = params.get('spend');
  
  if (params.get('autorun') === '1' && spendInput.value) {
    runCalc();
  }

  runBtn.addEventListener('click', runCalc);
  [spendInput, cpcInput, cvrInput, aovInput].forEach(el => {
    el.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') runCalc();
    });
  });

  function runCalc() {
    const spend = parseFloat(spendInput.value);
    const cpc = parseFloat(cpcInput.value);
    const cvr = parseFloat(cvrInput.value);
    const aov = parseFloat(aovInput.value);

    if (!spend || !cpc || !cvr || !aov) return alert('Please fill all fields');

    term.classList.add('active');
    resultBlock.classList.remove('active');
    term.innerHTML = '';

    logTerm(`> INIT ROI CALCULATION...`);
    logTerm(`> SPEND: ₹${spend} | CPC: ₹${cpc} | CVR: ${cvr}%`);
    
    setTimeout(() => {
      const clicks = spend / cpc;
      const conversions = clicks * (cvr / 100);
      const revenue = conversions * aov;
      const roas = revenue / spend;
      const cpa = spend / conversions;
      const breakeven = aov;

      logTerm('> COMPUTING PROFITABILITY MATRIX...');

      roasVal.textContent = roas.toFixed(2) + 'x';
      roasVal.className = 'mc-val ' + (roas >= 3 ? 'good' : roas >= 1.5 ? 'warn' : 'poor');
      
      revenueVal.textContent = '₹' + Math.floor(revenue).toLocaleString();
      cpaVal.textContent = '₹' + Math.floor(cpa).toLocaleString();
      breakevenVal.textContent = '₹' + Math.floor(breakeven).toLocaleString();

      setTimeout(() => {
        term.classList.remove('active');
        resultBlock.classList.add('active');
      }, 400);
    }, 500);
  }

  function logTerm(msg) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = msg;
    term.appendChild(div);
  }
});
