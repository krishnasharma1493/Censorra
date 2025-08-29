// Popup script for NSFW Image Blocker Extension
// Handles the settings UI and communicates with background script

class PopupController {
  constructor() {
    this.settings = {
      blockingEnabled: true,
      blockingMode: 'blur'
    };
    this.stats = {
      imagesScanned: 0,
      contentBlocked: 0
    };
    this.init();
  }

  async init() {
    try {
      await this.loadSettings();
      await this.loadStats();
      this.setupEventListeners();
      this.updateUI();
      this.updateStats();
      console.log('Popup initialized successfully');
    } catch (error) {
      console.error('Error initializing popup:', error);
      // Continue with default settings if there's an error
      this.updateUI();
      this.updateStats();
    }
  }

  async loadSettings() {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get(['blockingEnabled', 'blockingMode'], (result) => {
          if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError);
            resolve(); // Continue with defaults
            return;
          }
          
          this.settings.blockingEnabled = result.blockingEnabled !== false;
          this.settings.blockingMode = result.blockingMode || 'blur';
          resolve();
        });
      } catch (error) {
        console.error('Error in loadSettings:', error);
        resolve(); // Continue with defaults
      }
    });
  }

  async loadStats() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(['imagesScanned', 'contentBlocked'], (result) => {
          if (chrome.runtime.lastError) {
            console.error('Error loading stats:', chrome.runtime.lastError);
            resolve(); // Continue with defaults
            return;
          }
          
          this.stats.imagesScanned = result.imagesScanned || 0;
          this.stats.contentBlocked = result.contentBlocked || 0;
          resolve();
        });
      } catch (error) {
        console.error('Error in loadStats:', error);
        resolve(); // Continue with defaults
      }
    });
  }

  setupEventListeners() {
    try {
      // Main toggle switch
      const enabledToggle = document.getElementById('blockingEnabled');
      if (enabledToggle) {
        enabledToggle.addEventListener('change', (e) => {
          this.settings.blockingEnabled = e.target.checked;
          this.saveSettings();
          this.updateUI();
          this.notifyContentScript();
        });
      }

      // Blocking mode radio buttons
      const modeRadios = document.querySelectorAll('input[name="blockingMode"]');
      modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.settings.blockingMode = e.target.value;
            this.saveSettings();
            this.notifyContentScript();
          }
        });
      });

      // Listen for storage changes from other parts of the extension
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
          if (changes.imagesScanned) {
            this.stats.imagesScanned = changes.imagesScanned.newValue || 0;
          }
          if (changes.contentBlocked) {
            this.stats.contentBlocked = changes.contentBlocked.newValue || 0;
          }
          this.updateStats();
        }
      });
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  updateUI() {
    try {
      // Update toggle switch
      const enabledToggle = document.getElementById('blockingEnabled');
      if (enabledToggle) {
        enabledToggle.checked = this.settings.blockingEnabled;
      }

      // Update mode radio buttons
      const blurMode = document.getElementById('blurMode');
      const replaceMode = document.getElementById('replaceMode');
      
      if (blurMode) blurMode.checked = this.settings.blockingMode === 'blur';
      if (replaceMode) replaceMode.checked = this.settings.blockingMode === 'replace';

      // Enable/disable mode settings based on main toggle
      const modeSettings = document.getElementById('modeSettings');
      if (modeSettings) {
        if (this.settings.blockingEnabled) {
          modeSettings.classList.remove('disabled');
        } else {
          modeSettings.classList.add('disabled');
        }
      }

      // Update status
      const statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.textContent = this.settings.blockingEnabled ? 'Active' : 'Disabled';
        statusElement.style.color = this.settings.blockingEnabled ? '#4CAF50' : '#F44336';
      }
    } catch (error) {
      console.error('Error updating UI:', error);
    }
  }

  updateStats() {
    try {
      const imagesScannedElement = document.getElementById('imagesScanned');
      const contentBlockedElement = document.getElementById('contentBlocked');
      
      if (imagesScannedElement) {
        imagesScannedElement.textContent = this.stats.imagesScanned;
      }
      if (contentBlockedElement) {
        contentBlockedElement.textContent = this.stats.contentBlocked;
      }
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  saveSettings() {
    try {
      chrome.storage.sync.set({
        blockingEnabled: this.settings.blockingEnabled,
        blockingMode: this.settings.blockingMode
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving settings:', chrome.runtime.lastError);
        }
      });
    } catch (error) {
      console.error('Error in saveSettings:', error);
    }
  }

  async notifyContentScript() {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.id) {
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
          action: 'settingsChanged',
          settings: this.settings
        }).catch(() => {
          // Content script might not be loaded yet, which is fine
          console.log('Content script not available on this page');
        });
      }
    } catch (error) {
      console.error('Error notifying content script:', error);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new PopupController();
  } catch (error) {
    console.error('Error initializing popup controller:', error);
  }
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Popup error:', event.error);
});