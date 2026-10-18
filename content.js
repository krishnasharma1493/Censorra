/**
 * Censorra — Content Scanner Script (Manifest V3)
 * Real-time DOM observation, Canvas downsampling, and dynamic element filtering.
 * Developed by Krishna Sharma
 */

class CensorraScanner {
  constructor() {
    this.processedUrls = new Set();
    this.monitoredElements = new WeakMap();
    this.activeSettings = {
      blockingEnabled: true,
      blockingMode: 'blur'
    };
    this.maxPayloadBytes = 1024 * 1024; // 1MB payload ceiling
    this.init();
  }

  async init() {
    await this.fetchSettings();
    this.listenForMessages();
    this.scanDocument();
    this.observeMutations();
  }

  async fetchSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['blockingEnabled', 'blockingMode'], (res) => {
        if (res) {
          this.activeSettings.blockingEnabled = res.blockingEnabled !== false;
          this.activeSettings.blockingMode = res.blockingMode || 'blur';
        }
        resolve();
      });
    });
  }

  listenForMessages() {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === 'settingsChanged' && msg.settings) {
        const prevMode = this.activeSettings.blockingMode;
        const prevEnabled = this.activeSettings.blockingEnabled;
        this.activeSettings = { ...msg.settings };

        if (!this.activeSettings.blockingEnabled) {
          this.revealAll();
        } else if (!prevEnabled || prevMode !== this.activeSettings.blockingMode) {
          this.reapplyPolicy();
        }
      }
    });
  }

  scanDocument() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => this.processImage(img));
  }

  observeMutations() {
    const observer = new MutationObserver((mutations) => {
      if (!this.activeSettings.blockingEnabled) return;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          if (node.tagName === 'IMG') {
            this.handleImageElement(node);
          } else if (node.querySelectorAll) {
            const nested = node.querySelectorAll('img');
            nested.forEach((img) => this.handleImageElement(img));
          }
        }
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
  }

  handleImageElement(img) {
    if (img.complete && img.naturalWidth > 0) {
      this.processImage(img);
    } else {
      img.addEventListener('load', () => this.processImage(img), { once: true });
    }
  }

  isEligible(img) {
    if (!img.src || img.src.startsWith('data:image/svg')) return false;
    // Skip small UI icons & tracking pixels
    if (img.naturalWidth < 120 || img.naturalHeight < 120) return false;
    if (img.offsetWidth === 0 && img.offsetHeight === 0) return false;
    return true;
  }

  async processImage(img) {
    if (!this.activeSettings.blockingEnabled) return;
    if (this.processedUrls.has(img.src)) {
      const pastOutcome = this.monitoredElements.get(img);
      if (pastOutcome && pastOutcome.isNSFW) {
        this.enforcePolicy(img, this.activeSettings.blockingMode);
      }
      return;
    }

    if (!this.isEligible(img)) return;
    this.processedUrls.add(img.src);

    const base64Data = await this.rasterizeImage(img);
    if (!base64Data) return;

    try {
      chrome.runtime.sendMessage(
        { action: 'evaluateImage', imageData: base64Data },
        (res) => {
          if (chrome.runtime.lastError || !res) return;
          this.monitoredElements.set(img, res);

          if (res.isNSFW) {
            this.enforcePolicy(img, res.action || this.activeSettings.blockingMode);
          }
        }
      );
    } catch {
      // Extension context invalidated or reloaded
    }
  }

  enforcePolicy(img, mode) {
    if (mode === 'blur') {
      img.classList.add('censorra-blurred');
      img.setAttribute('data-censorra-status', 'blurred');
      img.setAttribute('title', 'Protected by Censorra: Click to reveal');
      this.attachRevealListener(img, 'blur');
    } else if (mode === 'replace') {
      if (!img.dataset.censorraOriginalSrc) {
        img.dataset.censorraOriginalSrc = img.src;
      }
      img.src = chrome.runtime.getURL('placeholder.png');
      img.classList.add('censorra-replaced');
      img.setAttribute('data-censorra-status', 'replaced');
      img.setAttribute('title', 'Protected by Censorra: Click to reveal');
      this.attachRevealListener(img, 'replace');
    }
  }

  attachRevealListener(img, mode) {
    if (img.__censorraListenerAttached) return;
    img.__censorraListenerAttached = true;

    img.addEventListener('click', (e) => {
      const status = img.getAttribute('data-censorra-status');
      if (status === 'blurred') {
        e.preventDefault();
        e.stopPropagation();
        img.classList.remove('censorra-blurred');
        img.setAttribute('data-censorra-status', 'revealed');
      } else if (status === 'replaced' && img.dataset.censorraOriginalSrc) {
        e.preventDefault();
        e.stopPropagation();
        img.src = img.dataset.censorraOriginalSrc;
        img.classList.remove('censorra-replaced');
        img.setAttribute('data-censorra-status', 'revealed');
      } else if (status === 'revealed') {
        // Toggle re-protection
        this.enforcePolicy(img, mode);
      }
    });
  }

  revealAll() {
    const affected = document.querySelectorAll('[data-censorra-status]');
    affected.forEach((img) => {
      img.classList.remove('censorra-blurred', 'censorra-replaced');
      if (img.dataset.censorraOriginalSrc) {
        img.src = img.dataset.censorraOriginalSrc;
      }
      img.removeAttribute('data-censorra-status');
    });
  }

  reapplyPolicy() {
    document.querySelectorAll('img').forEach((img) => {
      const info = this.monitoredElements.get(img);
      if (info && info.isNSFW) {
        this.enforcePolicy(img, this.activeSettings.blockingMode);
      }
    });
  }

  async rasterizeImage(img) {
    return new Promise((resolve) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        const maxDim = 480;
        const scale = Math.min(maxDim / (img.naturalWidth || maxDim), maxDim / (img.naturalHeight || maxDim), 1);
        canvas.width = Math.max(img.naturalWidth * scale, 32);
        canvas.height = Math.max(img.naturalHeight * scale, 32);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg', 0.82);

        if (dataUri.length > this.maxPayloadBytes) {
          resolve(null);
        } else {
          resolve(dataUri);
        }
      } catch {
        // Handle cross-origin canvas security exceptions gracefully
        resolve(null);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CensorraScanner());
} else {
  new CensorraScanner();
}