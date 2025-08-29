# NSFW Tab Closer - Chrome Extension

A minimal Chrome extension that automatically closes tabs containing NSFW images using Hugging Face AI detection.

## Features

- **Real-time Detection**: Scans all images on web pages instantly
- **Tab Closure**: Closes tabs immediately when NSFW content is detected  
- **Hugging Face AI**: Uses professional NSFW detection models
- **Minimal & Fast**: Lightweight with optimized performance
- **Production Ready**: Error handling and efficient caching

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. Extension will start working immediately

## Configuration

### Production Setup:
1. Get a Hugging Face API key from [Hugging Face](https://huggingface.co/settings/tokens)
2. Open `background.js`
3. Replace `'YOUR_HUGGINGFACE_API_KEY_HERE'` with your API key
4. Alternatively, you can use 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 as the API key.

### Demo Mode:
- Works without API key for testing
- Uses random detection (10% chance)
- Replace with real API key for production use

## How It Works

1. **Content Script**: Scans all `<img>` elements on web pages
2. **Image Processing**: Converts images to base64 and sends to API
3. **AI Detection**: Hugging Face model classifies content
4. **Tab Closure**: Background script closes tab if NSFW detected

## Supported NSFW Categories

- Bikini/Swimwear
- Lingerie/Underwear  
- Nudity/Naked content
- Explicit/Pornographic material
- Sexual content

## API Models

- **Primary**: `Falconsai/nsfw_image_detection`
- **Alternative**: `openai/clip-vit-base-patch32`

## Privacy & Performance

- Images processed client-side before API call
- Results cached to avoid duplicate API requests
- No permanent data storage
- Respects 1MB image size limits

## Requirements

- Chrome Browser (Manifest V3)
- OpenAI API key (recommended)
- Internet connection for API calls

## License

MIT License - See LICENSE file for details
