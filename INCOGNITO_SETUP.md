# 🔒 Incognito Mode Blocking Setup Guide

## ⚠️ IMPORTANT: Enable Extension in Incognito Mode

For incognito blocking to work, you MUST enable the extension in incognito mode:

### Step 1: Open Extension Settings
1. Go to `chrome://extensions/` in your browser
2. Find "SafeSurf - Porn Blocker" in the list
3. Click on "Details" button

### Step 2: Enable Incognito Access
1. In the extension details page, find "Allow in incognito"
2. **Toggle the switch to ON** ✅
3. You should see a warning message - click "Allow"

### Step 3: Test Incognito Blocking
1. Press `Ctrl+Shift+N` (or `Cmd+Shift+N` on Mac) to open incognito mode
2. The incognito window should either:
   - Close immediately
   - Redirect to the SafeSurf protection page
   - Show a notification about being blocked

## 🔧 Troubleshooting Incognito Blocking

### If Incognito Mode Still Opens:
1. **Check Extension Status**: Make sure SafeSurf is enabled in `chrome://extensions/`
2. **Check Incognito Permission**: Ensure "Allow in incognito" is ON
3. **Reload Extension**: Click the reload button on the extension
4. **Restart Browser**: Sometimes a browser restart is needed
5. **Check Console**: Open DevTools and look for incognito detection logs

### Expected Console Logs:
```
Window created: 123 Incognito: true Type: normal
Incognito window detected, closing immediately...
Closing incognito window: 123
```

### Alternative Testing:
1. Open DevTools (F12) before opening incognito
2. Look for the console logs when you press `Ctrl+Shift+N`
3. You should see immediate detection and blocking

## 🛡️ How Incognito Blocking Works

The extension uses multiple methods to detect and block incognito mode:

1. **Window Creation Detection**: Detects when incognito windows are created
2. **Tab Creation Detection**: Detects when incognito tabs are created
3. **Focus Detection**: Detects when incognito windows gain focus
4. **Periodic Checks**: Runs checks every 5 seconds to catch any missed windows
5. **Content Script**: Runs in incognito context to immediately redirect

## 📝 Notes

- **Incognito blocking is separate** from keyword blocking
- **Incognito blocking works even when protection is disabled**
- **The extension must be enabled in incognito mode** for this to work
- **Some browsers may have additional security settings** that prevent incognito blocking

## 🚨 Security Note

This feature is designed for personal use and digital wellbeing. The extension cannot bypass browser security features, so it relies on the user enabling it in incognito mode. 