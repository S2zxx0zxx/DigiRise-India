// Import global styles
import './styles/main.css';

// Import Web Components
import './components/layout/dr-header';
import './components/layout/dr-footer';
import './components/ui/dr-modal';
import './components/ui/dr-select';
import './components/home/dr-hero';
import './components/home/dr-services';
import './components/home/dr-pricing';
import './components/home/dr-audit-form';
import './components/blog/dr-blog-list';
import './components/blog/dr-blog-hero';
import './components/case-studies/dr-case-studies-list';
import './components/tools/dr-tools-list';
import './components/tools/dr-roi-calculator';
import './components/tools/dr-copy-generator';
import './components/tools/dr-meta-tag-generator';
import './components/tools/dr-speed-checker';

// Basic Analytics / Entry logic
console.log('🚀 DigiRise India Frontend Initialized.');

// Initialize any tooltips, lazy loading, or intersection observers here
const initObservers = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-slide-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
};

document.addEventListener('DOMContentLoaded', initObservers);
