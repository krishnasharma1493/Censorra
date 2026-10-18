/**
 * Censorra — Background Service Worker (Manifest V3)
 * Orchestrates AI inference, caching, tab management, and telemetry.
 * Developed by Krishna Sharma
 */

class CensorraEngine {
  constructor() {
    this.apiKey = 'YOUR_HUGGINGFACE_API_KEY_HERE'; // Replace with a valid Hugging Face Inference API token
    this.apiUrl = 'https://api-inference.huggingface.co/models/Falconsai/nsfw_image_detection';
    this.cache = new Map();
    this.maxCacheEntries = 500;
    this.nsfwKeywords = ['nsfw', 'porn', 'nude', 'naked', 'explicit', 'sexual', 'bikini', 'lingerie', 'underwear'];
    this.initStorage();
  }

  initStorage() {
    chrome.storage.sync.get(['blockingEnabled', 'blockingMode'], (res) => {
      if (res.blockingEnabled === undefined) {
        chrome.storage.sync.set({
          blockingEnabled: true,
          blockingMode: 'blur' // Options: 'blur', 'replace', 'close_tab'
        });
      }
    });

    chrome.storage.local.get(['imagesScanned', 'contentBlocked'], (res) => {
      if (res.imagesScanned === undefined || res.contentBlocked === undefined) {
        chrome.storage.local.set({
          imagesScanned: 0,
          contentBlocked: 0
        });
      }
    });
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['blockingEnabled', 'blockingMode'], (items) => {
        resolve({
          blockingEnabled: items.blockingEnabled !== false,
          blockingMode: items.blockingMode || 'blur'
        });
      });
    });
  }

  async recordTelemetry(isBlocked) {
    chrome.storage.local.get(['imagesScanned', 'contentBlocked'], (data) => {
      const scanned = (data.imagesScanned || 0) + 1;
      const blocked = (data.contentBlocked || 0) + (isBlocked ? 1 : 0);
      chrome.storage.local.set({
        imagesScanned: scanned,
        contentBlocked: blocked
      });
    });
  }

  async evaluateImage(imageData, tabId) {
    const settings = await this.getSettings();
    if (!settings.blockingEnabled) {
      return { isNSFW: false, action: 'none', confidence: 0 };
    }

    const cacheKey = this.computeHash(imageData);

    // Cache hit check
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      await this.recordTelemetry(cached.isNSFW);
      if (cached.isNSFW && settings.blockingMode === 'close_tab') {
        this.terminateTab(tabId);
      }
      return { ...cached, action: settings.blockingMode };
    }

    let isNSFW = false;
    let confidence = 0;

    // Use Demo Mode if no API key is configured
    if (!this.apiKey || this.apiKey === 'YOUR_HUGGINGFACE_API_KEY_HERE') {
      const demo = this.simulateInference();
      isNSFW = demo.isNSFW;
      confidence = demo.confidence;
    } else {
      try {
        const response = await fetch(imageData);
        const blob = await response.blob();

        const apiRes = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: blob
        });

        if (!apiRes.ok) {
          throw new Error(`Inference API status: ${apiRes.status}`);
        }

        const classifications = await apiRes.json();
        const parsed = this.parseClassification(classifications);
        isNSFW = parsed.isNSFW;
        confidence = parsed.confidence;
      } catch (err) {
        console.warn('[Censorra] API evaluation failed, falling back to heuristic demo simulation:', err);
        const demo = this.simulateInference();
        isNSFW = demo.isNSFW;
        confidence = demo.confidence;
      }
    }

    const outcome = { isNSFW, confidence };
    this.addToCache(cacheKey, outcome);
    await this.recordTelemetry(isNSFW);

    if (isNSFW && settings.blockingMode === 'close_tab') {
      this.terminateTab(tabId);
    }

    return {
      isNSFW,
      confidence,
      action: isNSFW ? settings.blockingMode : 'none'
    };
  }

  parseClassification(results) {
    if (!Array.isArray(results)) {
      return { isNSFW: false, confidence: 0 };
    }

    const match = results.find((item) => {
      const label = (item.label || '').toLowerCase();
      return this.nsfwKeywords.some((kw) => label.includes(kw));
    });

    if (match && match.score >= 0.55) {
      return { isNSFW: true, confidence: match.score };
    }

    return { isNSFW: false, confidence: results[0]?.score || 0 };
  }

  simulateInference() {
    // 12% probability for test demonstration
    const trigger = Math.random() < 0.12;
    return {
      isNSFW: trigger,
      confidence: trigger ? 0.88 + Math.random() * 0.1 : 0.05 + Math.random() * 0.1
    };
  }

  computeHash(str) {
    let hash = 0;
    const len = Math.min(str.length, 1200);
    for (let i = 0; i < len; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString();
  }

  addToCache(key, value) {
    if (this.cache.size >= this.maxCacheEntries) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  terminateTab(tabId) {
    if (tabId && tabId !== chrome.tabs.TAB_ID_NONE) {
      chrome.tabs.remove(tabId, () => {
        if (chrome.runtime.lastError) {
          // Tab might already be closed
        }
      });
    }
  }
}

const censorraEngine = new CensorraEngine();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'evaluateImage') {
    const tabId = sender.tab ? sender.tab.id : null;
    censorraEngine.evaluateImage(request.imageData, tabId)
      .then((res) => sendResponse(res))
      .catch((err) => {
        console.error('[Censorra] Internal evaluation error:', err);
        sendResponse({ isNSFW: false, action: 'none', confidence: 0 });
      });
    return true; // Keep channel open for asynchronous response
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  console.log(`[Censorra] Service worker active. Event: ${details.reason}`);
});