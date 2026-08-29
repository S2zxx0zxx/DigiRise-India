class DrModal extends HTMLElement {
  private dialog: HTMLDialogElement | null = null;

  connectedCallback() {
    const id = this.getAttribute('id') || 'modal';
    const title = this.getAttribute('title') || '';
    
    this.innerHTML = `
      <dialog id="${id}-dialog" class="dr-modal-dialog">
        <div class="dr-modal-content card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">${title}</h2>
            <button class="close-btn" aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="dr-modal-body">
            <!-- Content injected here -->
          </div>
        </div>
      </dialog>
    `;

    // Move any children that existed before innerHTML overwrite into the modal body
    const body = this.querySelector('.dr-modal-body');
    const originalNodes = Array.from(this.childNodes).filter(node => 
      node.nodeType === Node.TEXT_NODE ? node.textContent?.trim() !== '' : node.nodeName !== 'DIALOG'
    );
    originalNodes.forEach(node => body?.appendChild(node));

    this.dialog = this.querySelector('dialog');
    
    const closeBtn = this.querySelector('.close-btn');
    closeBtn?.addEventListener('click', () => this.close());
    
    // Close on backdrop click
    this.dialog?.addEventListener('click', (e) => {
      if (e.target === this.dialog) this.close();
    });

    const style = document.createElement('style');
    style.textContent = `
      .dr-modal-dialog {
        padding: 0;
        border: none;
        background: transparent;
        margin: auto;
        max-width: 90vw;
        width: 100%;
        max-width: 600px;
      }
      .dr-modal-dialog::backdrop {
        background: rgba(8, 6, 4, 0.8);
        backdrop-filter: blur(4px);
      }
      .dr-modal-content {
        padding: var(--spacing-6);
      }
      .mb-4 { margin-bottom: var(--spacing-4); }
      .close-btn {
        background: transparent;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: var(--spacing-2);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
      }
      .close-btn:hover {
        color: var(--color-text-primary);
        background: rgba(255,255,255,0.1);
      }
    `;
    this.appendChild(style);
  }

  open() {
    this.dialog?.showModal();
    this.setAttribute('open', '');
  }

  close() {
    this.dialog?.close();
    this.removeAttribute('open');
  }
}

customElements.define('dr-modal', DrModal);
