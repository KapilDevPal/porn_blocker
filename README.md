# SafeSurf - Porn Blocker Chrome Extension

A Chrome extension that detects inappropriate content and redirects users to a motivational, positive page to help maintain focus and productivity.

## Features

- **Content Detection**: Scans URLs and page content for inappropriate keywords
- **Automatic Redirection**: Redirects to a clean, motivational page when inappropriate content is detected
- **Early Detection**: Runs at `document_start` to catch content before the page fully loads
- **Popup Management**: Click the extension icon to access a beautiful popup interface
- **Customizable Keywords**: Add, remove, and manage blocked keywords through the popup
- **Protection Toggle**: Enable/disable protection with immediate effect
- **Whitelist Protection**: Major websites are automatically whitelisted to prevent false positives
- **Incognito Mode Blocking**: Prevents users from bypassing protection using incognito mode
- **Persistent Settings**: All settings are saved using Chrome's sync storage
- **Real-time Updates**: Changes in the popup are immediately applied to all active tabs
- **Smart Keyword Matching**: Uses word boundaries to prevent false positives
- **No Backend Required**: All data is stored locally
- **Manifest V3**: Uses the latest Chrome extension manifest version

## Blocked Keywords

The extension comes with these default blocked keywords:
- porn, sex, xxx, nsfw, nude, hentai, adult
- hot girls, sex video, pornography, explicit
- mature, adult content, 18+, adult site

**You can customize this list through the popup interface!**

## Whitelisted Domains

The extension automatically whitelists major websites to prevent false positives:
- Search engines: Google, Bing, Yahoo, DuckDuckGo
- Social media: Facebook, Twitter, Instagram, LinkedIn, Reddit
- E-commerce: Amazon, eBay, Walmart, Target
- Educational: Wikipedia, Stack Overflow, GitHub
- Entertainment: YouTube, Netflix, Spotify
- And many more trusted domains

## Installation Instructions

### Step 1: Prepare the Extension Files

1. Create a new folder on your computer (e.g., `safesurf-extension`)
2. Place all the following files in that folder:
   - `manifest.json`
   - `content.js`
   - `background.js`
   - `popup.html`
   - `popup.js`
   - `redirect.html`
   - `redirect.js`
   - `style.css`

### Step 2: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top-right corner
3. Click "Load unpacked" button
4. Select the folder containing your extension files
5. The extension should now appear in your extensions list

### Step 3: Test the Extension

1. **Test the Popup**: Click on the SafeSurf extension icon in your toolbar to open the management popup
2. **Test Protection Toggle**: Try toggling protection on/off and verify it works immediately
3. **Test Incognito Blocking**: Try opening an incognito window - it should be blocked
4. **Test URL Blocking**: Try visiting a URL that contains blocked keywords (e.g., `example.com/porn` or `example.com/adult-content`)
5. **Test Content Blocking**: Visit a page with blocked keywords in the title or content
6. The extension should redirect you to the motivational redirect page

## File Structure

```
safesurf-extension/
├── manifest.json      # Extension configuration
├── content.js         # Content script for detection
├── background.js      # Background script for incognito blocking
├── popup.html         # Popup interface for settings
├── popup.js           # Popup functionality
├── redirect.html      # Motivational redirect page
├── redirect.js        # Redirect page functionality
├── style.css          # Styles for redirect page
└── README.md          # This file
```

## How It Works

1. **Content Script**: `content.js` runs on every page load
2. **Whitelist Check**: First checks if the domain is in the whitelist
3. **URL Check**: Checks the current URL for blocked keywords using word boundaries
4. **Content Check**: Scans page title, meta description, and body text
5. **Redirection**: If matches are found, redirects to `redirect.html`
6. **Motivational Page**: Shows positive alternatives and encouragement
7. **Popup Management**: Users can manage settings through the popup interface
8. **Background Script**: `background.js` blocks incognito mode usage
9. **Storage Sync**: Settings are saved using Chrome's sync storage API

## Using the Popup Interface

### Accessing the Popup
- Click on the SafeSurf extension icon in your Chrome toolbar
- A beautiful popup will open with all management options

### Managing Keywords
- **Add Keywords**: Type a new keyword in the input field and click "Add"
- **Remove Keywords**: Click the "Remove" button next to any keyword
- **View All Keywords**: See all currently blocked keywords in the list

### Protection Controls
- **Toggle Protection**: Use the switch to enable/disable protection entirely
- **Status Display**: See whether protection is currently active or disabled
- **Incognito Status**: See that incognito mode is always blocked

## Technical Improvements

### False Positive Prevention
- **Whitelist System**: Major websites are automatically whitelisted
- **Word Boundary Matching**: Uses regex word boundaries to prevent partial matches
- **Context Awareness**: Multi-word keywords require all words to be present
- **Content Threshold**: Only checks pages with substantial content (>50 characters)

### Immediate Protection Toggle
- **Real-time Updates**: Protection toggle works immediately across all tabs
- **Message Broadcasting**: Changes are sent to all active content scripts
- **Visual Feedback**: Shows notifications when settings are changed

### Incognito Mode Blocking
- **Background Script**: Monitors tab and window creation
- **Automatic Redirection**: Redirects incognito tabs to the motivational page
- **Notification System**: Shows notifications when incognito mode is blocked
- **Persistent Blocking**: Works even if protection is disabled

## Customization

### Adding More Keywords

You can add keywords through the popup interface, or edit the `defaultKeywords` array in `popup.js`:

```javascript
const defaultKeywords = [
  "porn", "sex", "xxx", "nsfw", "nude", "hentai", "adult", 
  "hot girls", "sex video", "pornography", "explicit", 
  "mature", "adult content", "18+", "adult site",
  // Add your custom keywords here
  "your-custom-keyword"
];
```

### Modifying the Redirect Page

Edit `redirect.html`, `redirect.js`, and `style.css` to customize the appearance and content of the motivational page.

### Customizing the Popup

Edit `popup.html` and `popup.js` to modify the popup interface and functionality.

### Adding to Whitelist

To add more whitelisted domains, edit the `whitelistDomains` array in `content.js`:

```javascript
const whitelistDomains = [
  "google.com", "bing.com", "yahoo.com",
  // Add your trusted domains here
  "your-trusted-site.com"
];
```

## Technical Details

### Content Security Policy (CSP) Fix
- The extension now uses external JavaScript files instead of inline scripts
- This resolves CSP violations and ensures compatibility with strict security policies
- All functionality is properly separated into dedicated files

### Storage System
- Uses Chrome's `chrome.storage.sync` API for persistent settings
- Settings are synced across devices when signed into Chrome
- Fallback to default keywords if no custom settings are found

### Message Passing
- Real-time communication between popup and content scripts
- Immediate application of settings changes to all active tabs
- Efficient updates without page reloads

### Background Script
- Service worker that runs in the background
- Monitors tab and window creation for incognito detection
- Handles notifications and extension lifecycle events

## Troubleshooting

- **Extension not loading**: Make sure all files are in the same folder and the manifest.json is valid
- **Not blocking pages**: Check that the extension is enabled in `chrome://extensions/`
- **Popup not working**: Ensure you have the `storage` permission in manifest.json
- **Console errors**: Open Chrome DevTools (F12) to check for any JavaScript errors
- **CSP errors**: The extension now uses external scripts to avoid CSP violations
- **False positives**: Check if the site is in the whitelist, or add it manually
- **Protection not toggling**: Try refreshing the page after toggling protection

## Security Notes

- The extension uses minimal permissions (`activeTab`, `storage`, `tabs`, `notifications`)
- All keyword matching is done locally in the browser
- No data is sent to external servers
- Settings are stored securely using Chrome's sync storage
- Incognito mode blocking prevents bypassing protection

## Future Enhancements

- Whitelist management through popup interface
- Statistics and reporting features
- Custom redirect pages per category
- Password protection for settings
- Advanced filtering options
- Integration with productivity tools
- Time-based blocking schedules
- Custom whitelist per user

## License

This project is for educational and personal use. Please respect privacy and use responsibly. 