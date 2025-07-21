# 🔒 Incognito Mode Testing Guide

## 🚨 CRITICAL: Extension Must Be Enabled in Incognito Mode

**This is the most common reason why incognito blocking doesn't work!**

### Step 1: Enable Extension in Incognito Mode
1. Go to `chrome://extensions/` in your browser
2. Find "SafeSurf - Porn Blocker" in the list
3. Click on "Details" button
4. **IMPORTANT**: Find "Allow in incognito" and toggle it to **ON** ✅
5. You should see a warning message - click "Allow"

### Step 2: Verify Extension is Working in Incognito
1. Press `Ctrl+Shift+N` to open incognito mode
2. Look for the SafeSurf extension icon in the toolbar
3. If you don't see the icon, the extension is not enabled in incognito mode

### Step 3: Test with Console Logs
1. Open DevTools (F12) **before** opening incognito mode
2. Go to the Console tab
3. Press `Ctrl+Shift+N` to open incognito mode
4. Look for these specific logs:
   ```
   🎯 INCOGNITO WINDOW DETECTED! Closing immediately...
   🎯 INCOGNITO TAB DETECTED! Redirecting immediately...
   ```

## 🔍 Troubleshooting Steps

### If You Don't See Incognito Detection Logs:

1. **Check Extension Status**:
   - Go to `chrome://extensions/`
   - Make sure SafeSurf is enabled
   - Make sure "Allow in incognito" is ON

2. **Check Extension Icon in Incognito**:
   - Open incognito mode
   - Look for the SafeSurf icon in the toolbar
   - If not visible, the extension is not enabled in incognito

3. **Check Browser Settings**:
   - Some browsers have additional security settings
   - Check if there are any enterprise policies blocking extensions in incognito

4. **Test with Different Method**:
   - Right-click on the SafeSurf extension icon
   - Look for "Allow in incognito" option
   - Enable it if available

### Expected Behavior:

**When Incognito Mode is Properly Blocked:**
- ✅ Incognito window opens briefly then closes
- ✅ Console shows "🎯 INCOGNITO WINDOW DETECTED!"
- ✅ You see a notification about incognito being blocked
- ✅ Extension icon is visible in incognito mode

**When Incognito Mode is NOT Blocked:**
- ❌ Incognito window opens normally
- ❌ No detection logs in console
- ❌ Extension icon not visible in incognito mode
- ❌ "Allow in incognito" is OFF in extension settings

## 🧪 Alternative Testing Methods

### Method 1: Manual Incognito Test
1. Enable "Allow in incognito" in extension settings
2. Open DevTools console
3. Press `Ctrl+Shift+N`
4. Watch for detection logs

### Method 2: Check Extension Permissions
1. Go to `chrome://extensions/`
2. Click "Details" on SafeSurf
3. Check "Site access" - should be "On all sites"
4. Check "Allow in incognito" - should be ON

### Method 3: Browser Restart Test
1. Enable "Allow in incognito"
2. Restart Chrome completely
3. Try opening incognito mode again

## 📊 Debug Information

### Console Logs to Look For:
```
🎯 INCOGNITO WINDOW DETECTED! Closing immediately...
🎯 INCOGNITO TAB DETECTED! Redirecting immediately...
Closing incognito window: [window_id]
Redirecting incognito tab: [tab_id]
```

### If You See These Logs:
- ✅ Extension is working correctly
- ✅ Incognito mode is being detected
- ✅ Blocking should be happening

### If You DON'T See These Logs:
- ❌ Extension is not enabled in incognito mode
- ❌ "Allow in incognito" is OFF
- ❌ Extension permissions are insufficient

## 🚨 Common Issues and Solutions

### Issue 1: "Allow in incognito" is OFF
**Solution**: Enable it in `chrome://extensions/` → SafeSurf → Details → "Allow in incognito"

### Issue 2: Extension icon not visible in incognito
**Solution**: This means the extension is not enabled in incognito mode

### Issue 3: No detection logs
**Solution**: Check if the extension is actually running in incognito mode

### Issue 4: Incognito opens normally
**Solution**: The extension is not enabled in incognito mode or has insufficient permissions

## 🔧 Technical Details

The extension uses these methods to detect incognito mode:
1. **Window Creation Detection**: `chrome.windows.onCreated`
2. **Tab Creation Detection**: `chrome.tabs.onCreated`
3. **Tab Update Detection**: `chrome.tabs.onUpdated`
4. **Focus Detection**: `chrome.windows.onFocusChanged`
5. **Periodic Checks**: Every 5 seconds

**All of these require the extension to be enabled in incognito mode!** 