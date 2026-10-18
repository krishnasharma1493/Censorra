/**
 * Censorra — Popup Controller Script
 * Manages UI interactions, storage synchronization, and active tab messaging.
 * Developed by Krishna Sharma
 */

class CensorraPopup {
  constructor() {
    this.elements = {
      masterToggle: document.getElementById('masterToggle'),
      policySection: document.getElementById('policySection'),
      statusBadge: document.getElementById('statusBadge'),
      statusText: document.getElementById('statusText'),
      statScanned: document.getElementById('statScanned'),
      statBlocked: document.getElementById('statBlocked'),
      modeRadios: document.querySelectorAll('input[name="blockingMode"]')
    };

    this.settings = {
      blockingEnabled: true,
      blockingMode: 'blur'
    };

    this.init();
  }

  async init() {
    await this.restoreSettings();
    await this.restoreTelemetry();
    this.bindEvents();
    this.listenForStorageChanges();
  }

  async restoreSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['blockingEnabled', 'blockingMode'], (res) => {
        if (res) {
          this.settings.blockingEnabled = res.blockingEnabled !== false;
          this.settings.blockingMode = res.blockingMode || 'blur';
        }
        this.renderSettings();
        resolve();
      });
    });
  }

  async restoreTelemetry() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['imagesScanned', 'contentBlocked'], (res) => {
        const scanned = res?.imagesScanned || 0;
        const blocked = res?.contentBlocked || 0;
        this.renderTelemetry(scanned, blocked);
        resolve();
      });
    });
  }

  renderSettings() {
    const { masterToggle, policySection, statusBadge, statusText, modeRadios } = this.elements;

    if (masterToggle) {
      masterToggle.checked = this.settings.blockingEnabled;
    }

    if (statusBadge && statusText) {
      if (this.settings.blockingEnabled) {
        statusBadge.classList.remove('disabled');
        statusText.textContent = 'Active';
      } else {
        statusBadge.classList.add('disabled');
        statusText.textContent = 'Paused';
      }
    }

    if (policySection) {
      if (this.settings.blockingEnabled) {
        policySection.classList.remove('disabled-overlay');
      } else {
        policySection.classList.add('disabled-overlay');
      }
    }

    modeRadios.forEach((radio) => {
      radio.checked = radio.value === this.settings.blockingMode;
      radio.disabled = !this.settings.blockingEnabled;
    });
  }

  renderTelemetry(scanned, blocked) {
    if (this.elements.statScanned) {
      this.elements.statScanned.textContent = Number(scanned).toLocaleString();
    }
    if (this.elements.statBlocked) {
      this.elements.statBlocked.textContent = Number(blocked).toLocaleString();
    }
  }

  bindEvents() {
    const { masterToggle, modeRadios } = this.elements;

    if (masterToggle) {
      masterToggle.addEventListener('change', (e) => {
        this.settings.blockingEnabled = e.target.checked;
        this.persistSettings();
        this.renderSettings();
        this.notifyActiveTab();
      });
    }

    modeRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.settings.blockingMode = e.target.value;
          this.persistSettings();
          this.notifyActiveTab();
        }
      });
    });
  }

  persistSettings() {
    chrome.storage.sync.set({
      blockingEnabled: this.settings.blockingEnabled,
      blockingMode: this.settings.blockingMode
    });
  }

  listenForStorageChanges() {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        const scanned = changes.imagesScanned ? changes.imagesScanned.newValue : undefined;
        const blocked = changes.contentBlocked ? changes.contentBlocked.newValue : undefined;
        if (scanned !== undefined || blocked !== undefined) {
          chrome.storage.local.get(['imagesScanned', 'contentBlocked'], (data) => {
            this.renderTelemetry(data.imagesScanned || 0, data.contentBlocked || 0);
          });
        }
      }
    });
  }

  async notifyActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'settingsChanged',
          settings: this.settings
        }).catch(() => {
          // Tab does not host content script (e.g. chrome:// internal pages)
        });
      }
    } catch {
      // Non-critical background handling
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CensorraPopup();
});