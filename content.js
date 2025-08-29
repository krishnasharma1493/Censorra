// Content script for NSFW Tab Closer Extension
// Scans images and sends them for classification

class ImageScanner {
  constructor() {
    this.processedImages = new Set();
    this.isActive = true;
    this.maxImageSize = 1024 * 1024; // 1MB limit for API
    this.init();
  }

  init() {
    // Start scanning immediately
    this.scanExistingImages();
    
    // Monitor for new images
    this.setupImageObserver();
    
    console.log('NSFW Tab Closer: Image scanning started');
  }

  scanExistingImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => this.processImage(img));
  }

  async processImage(img) {
    // Skip if already processed
    if (this.processedImages.has(img.src)) return;
    
    // Skip invalid images
    if (!this.isValidImage(img)) return;

    // Mark as processed
    this.processedImages.add(img.src);

    try {
      // Convert image to base64
      const imageData = await this.imageToBase64(img);
      
      if (!imageData) return;

      // Send to background script for analysis
      chrome.runtime.sendMessage({
        action: 'checkImage',
        imageData: imageData
      });

    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  isValidImage(img) {
    // Skip if no source
    if (!img.src || img.src.startsWith('data:')) return false;
    
    // Skip very small images (likely icons)
    if (img.naturalWidth < 150 || img.naturalHeight < 150) return false;
    
    // Skip if not visible
    if (img.offsetWidth === 0 || img.offsetHeight === 0) return false;
    
    // Skip if image failed to load
    if (!img.complete || img.naturalWidth === 0) return false;

    return true;
  }

  async imageToBase64(img) {
    return new Promise((resolve) => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size (resize large images for efficiency)
        const maxDimension = 512;
        const ratio = Math.min(maxDimension / img.naturalWidth, maxDimension / img.naturalHeight);
        
        canvas.width = img.naturalWidth * ratio;
        canvas.height = img.naturalHeight * ratio;
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const base64Data = canvas.toDataURL('image/jpeg', 0.8);
        
        // Check size limit
        if (base64Data.length > this.maxImageSize) {
          resolve(null); // Skip oversized images
          return;
        }
        
        resolve(base64Data);
        
      } catch (error) {
        console.error('Error converting image to base64:', error);
        resolve(null);
      }
    });
  }

  setupImageObserver() {
    // Watch for dynamically added images
    const observer = new MutationObserver((mutations) => {
      if (!this.isActive) return;
      
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if node is an image
            if (node.tagName === 'IMG') {
              // Wait for image to load before processing
              if (node.complete) {
                this.processImage(node);
              } else {
                node.addEventListener('load', () => this.processImage(node), { once: true });
              }
            }
            
            // Check for images within added node
            const images = node.querySelectorAll && node.querySelectorAll('img');
            if (images) {
              images.forEach(img => {
                if (img.complete) {
                  this.processImage(img);
                } else {
                  img.addEventListener('load', () => this.processImage(img), { once: true });
                }
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ImageScanner();
  });
} else {
  new ImageScanner();
}