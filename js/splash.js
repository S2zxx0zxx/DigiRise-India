(function(){
  function hideSplash(){
    var s = document.getElementById('splash');
    if(s){ s.classList.add('hidden'); }
  }
  // Primary: 1300ms after DOM ready
  setTimeout(hideSplash, 1300);
  // Fallback: hide on first user interaction (in case page is slow)
  document.addEventListener('touchstart', hideSplash, {once:true, passive:true});
  document.addEventListener('click', hideSplash, {once:true});
  // Nuclear fallback: always gone after 2.5s no matter what
  setTimeout(hideSplash, 2500);
})();
