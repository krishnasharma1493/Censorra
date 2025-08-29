// Background script for NSFW Tab Closer Extension
// Handles Hugging Face API calls and tab management

class NSFWDetector {
  constructor() {
    this.apiKey = 'YOUR_HUGGINGFACE_API_KEY_HERE'; // Replace with your HF API key
    this.apiUrl = 'https://api-inference.huggingface.co/models/Falconsai/nsfw_image_detection';
    this.cache = new Map();
    this.nsfwCategories = ['bikini', 'lingerie', 'underwear', 'nude', 'naked', 'porn', 'nsfw', 'explicit'];
  }

  async detectNSFW(imageData, tabId) {
    const cacheKey = this.hashImageData(imageData);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const result = this.cache.get(cacheKey);
      if (result) {
        this.closeTab(tabId);
      }
      return result;
    }

    // Demo mode if no API key
    if (this.apiKey === 'YOUR_HUGGINGFACE_API_KEY_HERE') {
      const result = this.demoDetection();
      this.cache.set(cacheKey, result);
      if (result) {
        this.closeTab(tabId);
      }
      return result;
    }

    try {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Call Hugging Face API
      const apiResponse = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: blob
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      const isNSFW = this.parseNSFWResult(result);

      // Cache result
      this.cache.set(cacheKey, isNSFW);

      if (isNSFW) {
        this.closeTab(tabId);
      }

      return isNSFW;

    } catch (error) {
      console.error('NSFW detection failed:', error);
      // Fallback to demo detection on error
      const result = this.demoDetection();
      this.cache.set(cacheKey, result);
      if (result) {
        this.closeTab(tabId);
      }
      return result;
    }
  }

  parseNSFWResult(result) {
    if (Array.isArray(result)) {
      // Find NSFW-related predictions
      const nsfwPrediction = result.find(item => {
        const label = item.label?.toLowerCase() || '';
        return this.nsfwCategories.some(category => label.includes(category)) ||
               label.includes('nsfw') || 
               label.includes('explicit') ||
               label.includes('sexual');
      });

      // Consider NSFW if confidence > 0.6
      return nsfwPrediction && nsfwPrediction.score > 0.6;
    }
    return false;
  }

  hashImageData(imageData) {
    // Simple hash for caching
    let hash = 0;
    for (let i = 0; i < Math.min(imageData.length, 1000); i++) {
      const char = imageData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  demoDetection() {
    // Demo mode: random detection for testing
    return Math.random() < 0.1; // 10% chance for demo
  }

  closeTab(tabId) {
    if (tabId) {
      chrome.tabs.remove(tabId, () => {
        console.log(`Tab ${tabId} closed due to NSFW content detection`);
      });
    }
  }
}

// Initialize detector
const nsfwDetector = new NSFWDetector();

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkImage') {
    const tabId = sender.tab?.id;
    
    nsfwDetector.detectNSFW(request.imageData, tabId)
      .then(isNSFW => {
        sendResponse({ isNSFW });
      })
      .catch(error => {
        console.error('Error checking image:', error);
        sendResponse({ isNSFW: false });
      });
    return true; // Keep message channel open for async response
  }
});

// Extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('NSFW Tab Closer extension installed');
});