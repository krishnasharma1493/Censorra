# 🚀 Chrome Extension Installation Guide

## Quick Start (Load Unpacked Extension)

### Step 1: Open Chrome Extension Management
1. Open Chrome or Brave browser
2. Type `chrome://extensions/` in the address bar (or `brave://extensions/` for Brave)
3. Press Enter

### Step 2: Enable Developer Mode
1. Look for the **"Developer mode"** toggle in the top-right corner
2. Click to turn it ON (the toggle should be blue/green)

### Step 3: Load the Extension
1. Click the **"Load unpacked"** button
2. Navigate to and select the `extension` folder (this folder containing all the files)
3. Click **"Select Folder"**

### Step 4: Verify Installation
✅ You should see "NSFW Image Blocker" in your extensions list
✅ Look for a shield icon in your browser toolbar
✅ The extension badge should show "ON" in green

## Testing the Extension

1. **Open the popup**: Click the shield icon in your toolbar
2. **Check demo mode**: Should show "Demo Mode" message
3. **Visit a website with images**: Try any news site or social media
4. **Monitor stats**: The popup should show scanning activity

## Troubleshooting

### ❌ "Could not load JavaScript 'content.js'" Error
- Make sure you selected the correct `extension` folder
- Verify all files are present: `manifest.json`, `content.js`, `background.js`, etc.

### ❌ Extension doesn't appear
- Refresh the extensions page
- Check if Developer mode is enabled
- Try reloading the extension (click the refresh icon)

### ❌ No images being blocked
- This is normal in demo mode (only ~15% random detection)
- Check if extension is enabled (green "ON" badge)
- Visit sites with larger images (>50px)

### ❌ Popup doesn't open
- Right-click the extension icon → "Inspect popup"
- Check browser console for errors

## Configuring Real AI Detection

To enable actual NSFW detection:

1. Get a free Hugging Face API key from [huggingface.co](https://huggingface.co)
2. Open `extension/background.js`
3. Replace `YOUR_HUGGINGFACE_API_KEY` with your real API key
4. Reload the extension

## File Structure Check

Make sure your `extension` folder contains:
```
extension/
├── manifest.json     ✅ Required
├── background.js     ✅ Required  
├── content.js        ✅ Required
├── content.css       ✅ Required
├── popup.html        ✅ Required
├── popup.js          ✅ Required
├── placeholder.png   ✅ Required
├── icons/            ✅ Required
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Demo vs Production

**Demo Mode** (default):
- Works immediately without setup
- Random 15% detection for testing
- Perfect for hackathon demos

**Production Mode** (with API key):
- Real AI image detection
- Requires internet connection
- More accurate results

---

🎉 **You're all set!** The extension should now be protecting your browsing experience.