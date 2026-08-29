class DrAuditForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section id="audit" class="section" style="background-color: var(--color-bg-primary); position: relative; overflow: hidden;">
        <!-- Background Elements -->
        <div style="position: absolute; bottom: -20%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle, var(--color-accent-gold-glow) 0%, transparent 70%); z-index: 0; filter: blur(60px); pointer-events: none;"></div>

        <div class="container relative z-10 grid gap-12 md:grid-cols-2 items-center">
          
          <div class="flex flex-col gap-6 animate-on-scroll">
            <span class="badge" style="width: fit-content;">Free Strategy Session</span>
            <h2>Get Your <span class="text-gradient">Growth Audit</span></h2>
            <p class="text-lg text-secondary">
              We'll analyze your current digital presence, identify bottlenecks, and give you a step-by-step roadmap to scale—completely free.
            </p>
            <ul class="flex flex-col gap-3 mt-4">
              <li class="flex items-start gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2" style="flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Comprehensive Website & SEO Review</span>
              </li>
              <li class="flex items-start gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2" style="flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Competitor Ad Strategy Breakdown</span>
              </li>
              <li class="flex items-start gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2" style="flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Custom Action Plan for Your Business</span>
              </li>
            </ul>
          </div>

          <div class="card glass animate-on-scroll delay-200">
            <form id="audit-form" class="flex flex-col gap-4">
              <div class="flex flex-col gap-1">
                <label for="name" class="font-medium text-sm">Full Name <span class="text-error">*</span></label>
                <input type="text" id="name" name="name" required class="input-field" placeholder="John Doe">
              </div>
              
              <div class="grid gap-4 md:grid-cols-2">
                <div class="flex flex-col gap-1">
                  <label for="email" class="font-medium text-sm">Email <span class="text-error">*</span></label>
                  <input type="email" id="email" name="email" required class="input-field" placeholder="john@company.com">
                </div>
                <div class="flex flex-col gap-1">
                  <label for="phone" class="font-medium text-sm">Phone Number</label>
                  <input type="tel" id="phone" name="phone" class="input-field" placeholder="+91 98765 43210">
                </div>
              </div>
              
              <div class="flex flex-col gap-1">
                <label for="website" class="font-medium text-sm">Website URL</label>
                <input type="url" id="website" name="website" class="input-field" placeholder="https://yourwebsite.com">
              </div>

              <dr-select name="budget" label="Monthly Marketing Budget" required>
                <option value="" disabled selected>Select Budget Range</option>
                <option value="under-15k">Under ₹15,000</option>
                <option value="15k-50k">₹15,000 - ₹50,000</option>
                <option value="50k-1L">₹50,000 - ₹1,00,000</option>
                <option value="over-1L">₹1,00,000+</option>
              </dr-select>
              
              <div class="flex flex-col gap-1 mt-2">
                <label for="goals" class="font-medium text-sm">What is your primary goal?</label>
                <textarea id="goals" name="goals" rows="3" class="input-field" placeholder="e.g. We want to double our lead volume in 3 months..."></textarea>
              </div>
              
              <button type="submit" class="btn btn-primary mt-4 w-full" id="submit-btn">
                <span>Request Free Audit</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </button>
              
              <p id="form-status" class="text-sm text-center mt-2 hidden"></p>
            </form>
          </div>
          
        </div>
      </section>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .input-field {
        width: 100%;
        background-color: var(--color-bg-elevated);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-3) var(--spacing-4);
        color: var(--color-text-primary);
        font-size: 1rem;
        transition: all var(--transition-fast);
      }
      .input-field:focus {
        outline: none;
        border-color: var(--color-accent-gold);
        box-shadow: 0 0 0 2px var(--color-accent-gold-glow);
      }
      .input-field::placeholder {
        color: var(--color-text-muted);
      }
      .text-error { color: var(--color-error); }
      .hidden { display: none; }
      .text-success { color: var(--color-success); }
    `;
    this.appendChild(style);

    this.setupForm();
  }

  setupForm() {
    const form = this.querySelector('#audit-form') as HTMLFormElement;
    const submitBtn = this.querySelector('#submit-btn') as HTMLButtonElement;
    const statusMsg = this.querySelector('#form-status') as HTMLParagraphElement;

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Submitting...</span><div class="loader"></div>';
      statusMsg.className = 'text-sm text-center mt-2 hidden';

      try {
        const response = await fetch('/api/leads/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          form.reset();
          statusMsg.textContent = 'Audit request sent successfully! We will contact you shortly.';
          statusMsg.className = 'text-sm text-center mt-2 text-success';
        } else {
          const res = await response.json();
          throw new Error(res.error || 'Something went wrong');
        }
      } catch (error: any) {
        statusMsg.textContent = error.message;
        statusMsg.className = 'text-sm text-center mt-2 text-error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Request Free Audit</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
        `;
      }
    });
  }
}

customElements.define('dr-audit-form', DrAuditForm);
