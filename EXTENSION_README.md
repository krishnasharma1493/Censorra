# NSFW Image Blocker Chrome Extension

A Chrome/Brave browser extension that automatically detects and blocks NSFW content using AI.

## Installation Instructions

### Loading the Extension in Chrome/Brave

1. **Open Extension Management:**
   - Chrome: Go to `chrome://extensions/`
   - Brave: Go to `brave://extensions/`

2. **Enable Developer Mode:**
   - Toggle "Developer mode" in the top-right corner

3. **Load the Extension:**
   - Click "Load unpacked" button
   - Select the `extension` folder from this project
   - The extension should now appear in your extensions list

4. **Verify Installation:**
   - Look for the shield icon in your browser toolbar
   - Click it to open the settings popup
   - You should see "Demo Mode" status

## Configuration

### Setting up the AI API (Optional)

The extension works in demo mode by default. To enable real AI detection:

1. **Get a Hugging Face API Key:**
   - Go to [huggingface.co](https://huggingface.co)
   - Sign up/login and go to Settings → Access Tokens
   - Create a new token with "Read" permissions

2. **Configure the Extension:**
   - Open `extension/background.js`
   - Replace `YOUR_HUGGINGFACE_API_KEY` with your actual API key
   - Reload the extension in Chrome

## Features

- ✅ **Real-time Detection:** Scans images as they load on web pages
- ✅ **Two Blocking Modes:** Blur or replace with placeholder
- ✅ **Click to Reveal:** Users can click blocked content to view it
- ✅ **Settings Persistence:** Remembers your preferences
- ✅ **Statistics Tracking:** Shows images scanned and content blocked
- ✅ **Demo Mode:** Works without API configuration for testing

## How It Works

1. **Content Script** (`content.js`): Monitors all images on web pages
2. **Background Script** (`background.js`): Handles AI API calls and caching
3. **Popup Interface** (`popup.html/js`): Provides user controls and settings
4. **Manifest** (`manifest.json`): Defines extension permissions and structure

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content.js            # DOM manipulation and image scanning
├── content.css           # Styles for blocked content
├── popup.html            # Settings interface
├── popup.js              # Popup functionality
├── placeholder.png       # Default replacement image
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Testing the Extension

1. **Load the extension** following the installation steps above
2. **Visit websites with images** (e.g., social media, news sites)
3. **Check the popup** to see scanning statistics
4. **Toggle settings** to test blur vs. replace modes
5. **Monitor console** (F12) for any error messages

## Troubleshooting

### Extension Won't Load
- Make sure all files are in the `extension` folder
- Check the console for JavaScript errors
- Verify manifest.json syntax

### Images Not Being Blocked
- Check if the extension is enabled (green "ON" badge)
- Verify images are large enough (>50px)
- Look for console errors in developer tools

### API Issues
- Ensure you have a valid Hugging Face API key
- Check your internet connection
- Monitor the background script console for API errors

## Security & Privacy

- Images are processed via external API (when configured)
- No personal data is collected or stored
- Settings are stored locally in browser storage
- Cache is used to avoid re-processing the same images

## Development Notes

- Uses Manifest V3 for modern Chrome extensions
- Implements proper error handling and fallbacks
- Includes demo mode for testing without API setup
- Optimized for performance with image caching
- Responsive popup design with gradient styling

## Known Limitations

- Requires internet connection for AI detection (unless using demo mode)
- May have false positives/negatives depending on AI model accuracy
- Works only on publicly accessible images (not private/authenticated content)
- Small images (icons) are ignored to avoid unnecessary processing

---

**Note:** This is a hackathon project. For production use, consider implementing additional features like:
- Local AI model integration
- More sophisticated detection algorithms
- User reporting/feedback system
- Whitelist/blacklist functionality