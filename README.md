# SafeSurf - Porn Blocker Chrome Extension

A Chrome extension that detects inappropriate content and redirects users to a motivational, positive page to help maintain focus and productivity.

## Features

- **Content Detection**: Scans URLs and page content for inappropriate keywords
- **Automatic Redirection**: Redirects to a clean, motivational page when inappropriate content is detected
- **Early Detection**: Runs at `document_start` to catch content before the page fully loads
- **No Backend Required**: All data is stored locally
- **Manifest V3**: Uses the latest Chrome extension manifest version

## Blocked Keywords

The extension currently blocks pages containing these keywords:
- porn, sex, xxx, nsfw, nude, hentai, adult
- hot girls, sex video, pornography, explicit
- mature, adult content, 18+, adult site

## Installation Instructions

### Step 1: Prepare the Extension Files

1. Create a new folder on your computer (e.g., `safesurf-extension`)
2. Place all the following files in that folder:
   - `manifest.json`
   - `content.js`
   - `redirect.html`
   - `style.css`

### Step 2: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top-right corner
3. Click "Load unpacked" button
4. Select the folder containing your extension files
5. The extension should now appear in your extensions list

### Step 3: Test the Extension

1. **Test URL Blocking**: Try visiting a URL that contains blocked keywords (e.g., `example.com/porn` or `example.com/adult-content`)
2. **Test Content Blocking**: Visit a page with blocked keywords in the title or content
3. The extension should redirect you to the motivational redirect page

## File Structure

```
safesurf-extension/
├── manifest.json      # Extension configuration
├── content.js         # Content script for detection
├── redirect.html      # Motivational redirect page
├── style.css          # Styles for redirect page
└── README.md          # This file
```

## How It Works

1. **Content Script**: `content.js` runs on every page load
2. **URL Check**: Immediately checks the current URL for blocked keywords
3. **Content Check**: Scans page title, meta description, and body text
4. **Redirection**: If matches are found, redirects to `redirect.html`
5. **Motivational Page**: Shows positive alternatives and encouragement

## Customization

### Adding More Keywords

Edit the `blockedKeywords` array in `content.js`:

```javascript
const blockedKeywords = [
  "porn", "sex", "xxx", "nsfw", "nude", "hentai", "adult", 
  "hot girls", "sex video", "pornography", "explicit", 
  "mature", "adult content", "18+", "adult site",
  // Add your custom keywords here
  "your-custom-keyword"
];
```

### Modifying the Redirect Page

Edit `redirect.html` and `style.css` to customize the appearance and content of the motivational page.

## Troubleshooting

- **Extension not loading**: Make sure all files are in the same folder and the manifest.json is valid
- **Not blocking pages**: Check that the extension is enabled in `chrome://extensions/`
- **Console errors**: Open Chrome DevTools (F12) to check for any JavaScript errors

## Security Notes

- The extension only has `activeTab` permission, which is minimal and secure
- All keyword matching is done locally in the browser
- No data is sent to external servers

## Future Enhancements

- User-configurable keyword lists
- Whitelist functionality
- Statistics and reporting
- Custom redirect pages
- Password protection for settings

## License

This project is for educational and personal use. Please respect privacy and use responsibly. 