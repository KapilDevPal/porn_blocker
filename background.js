// SafeSurf - Background Script for Incognito Mode Blocking

console.log('SafeSurf background script started');

// Function to redirect incognito tab
function redirectIncognitoTab(tab) {
    try {
        console.log('Redirecting incognito tab:', tab.id);
        const redirectURL = chrome.runtime.getURL('redirect.html');
        chrome.tabs.update(tab.id, { url: redirectURL });
        
        // Show a notification without icon to avoid download error
        chrome.notifications.create({
            type: 'basic',
            title: 'SafeSurf Protection',
            message: 'Incognito mode is blocked for your digital wellbeing.'
        });
    } catch (error) {
        console.log('Error redirecting incognito tab:', error);
    }
}

// Function to redirect all tabs in an incognito window
function redirectIncognitoWindow(window) {
    try {
        console.log('Redirecting incognito window:', window.id);
        chrome.tabs.query({ windowId: window.id }, function(tabs) {
            if (chrome.runtime.lastError) {
                console.log('Error querying tabs for window:', chrome.runtime.lastError);
                return;
            }
            
            const redirectURL = chrome.runtime.getURL('redirect.html');
            tabs.forEach(tab => {
                chrome.tabs.update(tab.id, { url: redirectURL });
            });
        });
        
        // Show a notification without icon to avoid download error
        chrome.notifications.create({
            type: 'basic',
            title: 'SafeSurf Protection',
            message: 'Incognito mode is blocked for your digital wellbeing.'
        });
    } catch (error) {
        console.log('Error redirecting incognito window:', error);
    }
}

// Function to close incognito window
function closeIncognitoWindow(windowId) {
    try {
        console.log('Closing incognito window:', windowId);
        chrome.windows.remove(windowId);
        
        // Show a notification without icon to avoid download error
        chrome.notifications.create({
            type: 'basic',
            title: 'SafeSurf Protection',
            message: 'Incognito window closed for your protection.'
        });
    } catch (error) {
        console.log('Error closing incognito window:', error);
    }
}

// Listen for tab creation to detect incognito mode
chrome.tabs.onCreated.addListener(function(tab) {
    console.log('Tab created:', tab.id, 'Incognito:', tab.incognito, 'URL:', tab.url, 'Window ID:', tab.windowId);
    
    // Check if the tab is in incognito mode
    if (tab.incognito) {
        console.log('🎯 INCOGNITO TAB DETECTED! Redirecting immediately...');
        // Add a small delay to ensure the tab is fully created
        setTimeout(() => {
            redirectIncognitoTab(tab);
        }, 100);
    } else {
        console.log('Regular tab created (not incognito)');
    }
});

// Listen for tab updates to catch any incognito tabs that might slip through
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log('Tab updated:', tabId, 'Status:', changeInfo.status, 'Incognito:', tab.incognito, 'URL:', tab.url);
    
    if (tab.incognito) {
        console.log('🎯 INCOGNITO TAB UPDATED! Checking for redirect...');
        
        // Check if the URL is not already our redirect page
        const redirectURL = chrome.runtime.getURL('redirect.html');
        if (tab.url !== redirectURL && tab.url !== 'chrome://newtab/') {
            console.log('🎯 INCOGNITO TAB UPDATED! Redirecting...');
            redirectIncognitoTab(tab);
        }
    }
});

// Listen for window creation to catch incognito windows
chrome.windows.onCreated.addListener(function(window) {
    console.log('Window created:', window.id, 'Incognito:', window.incognito, 'Type:', window.type, 'State:', window.state);
    
    if (window.incognito) {
        console.log('🎯 INCOGNITO WINDOW DETECTED! Closing immediately...');
        // Close the incognito window immediately
        setTimeout(() => {
            closeIncognitoWindow(window.id);
        }, 50);
    } else {
        console.log('Regular window created (not incognito)');
    }
});

// Listen for window focus to catch any incognito windows that might have been missed
chrome.windows.onFocusChanged.addListener(function(windowId) {
    try {
        // Skip invalid window IDs
        if (windowId === chrome.windows.WINDOW_ID_NONE || windowId === -1) {
            return;
        }
        
        chrome.windows.get(windowId, function(window) {
            if (chrome.runtime.lastError) {
                console.log('Error getting window:', chrome.runtime.lastError);
                return;
            }
            
            if (window && window.incognito) {
                console.log('Incognito window focused, closing immediately...');
                closeIncognitoWindow(window.id);
            }
        });
    } catch (error) {
        console.log('Error in window focus handler:', error);
    }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        console.log('SafeSurf extension installed');
        
        // Show welcome notification without icon to avoid download error
        chrome.notifications.create({
            type: 'basic',
            title: 'SafeSurf Installed',
            message: 'Your digital wellbeing companion is now active! Incognito mode is blocked.'
        });
    }
    
    // Check for any existing incognito windows/tabs
    checkExistingIncognito();
});

// Function to check for existing incognito windows and tabs
function checkExistingIncognito() {
    try {
        console.log('Checking for existing incognito windows/tabs...');
        
        // Check for incognito windows
        chrome.windows.getAll({ windowTypes: ['normal'] }, function(windows) {
            if (chrome.runtime.lastError) {
                console.log('Error getting windows:', chrome.runtime.lastError);
                return;
            }
            
            console.log('Found windows:', windows.length);
            windows.forEach(window => {
                console.log('Window:', window.id, 'Incognito:', window.incognito);
                if (window.incognito) {
                    console.log('Found existing incognito window, closing...');
                    closeIncognitoWindow(window.id);
                }
            });
        });
        
        // Check for incognito tabs
        chrome.tabs.query({}, function(tabs) {
            if (chrome.runtime.lastError) {
                console.log('Error querying tabs:', chrome.runtime.lastError);
                return;
            }
            
            console.log('Found tabs:', tabs.length);
            const incognitoTabs = tabs.filter(tab => tab.incognito);
            console.log('Incognito tabs found:', incognitoTabs.length);
            
            if (incognitoTabs.length > 0) {
                console.log('Found existing incognito tabs, redirecting...');
                incognitoTabs.forEach(tab => {
                    redirectIncognitoTab(tab);
                });
            }
        });
    } catch (error) {
        console.log('Error in checkExistingIncognito:', error);
    }
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Background received message:', request);
    
    if (request.action === 'checkIncognitoStatus') {
        // Return current incognito blocking status
        sendResponse({ incognitoBlocked: true });
    } else if (request.action === 'checkIncognitoContext') {
        // Check if the sender is in incognito mode
        const isIncognito = sender.tab && sender.tab.incognito;
        console.log('Checking incognito context for tab:', sender.tab ? sender.tab.id : 'unknown', 'Incognito:', isIncognito);
        sendResponse({ isIncognito: isIncognito });
    }
});

// More aggressive periodic checks for incognito windows
setInterval(function() {
    try {
        console.log('Running periodic incognito check...');
        chrome.windows.getAll({ windowTypes: ['normal'] }, function(windows) {
            if (chrome.runtime.lastError) {
                console.log('Error in periodic check:', chrome.runtime.lastError);
                return;
            }
            
            windows.forEach(window => {
                if (window.incognito) {
                    console.log('Periodic check found incognito window, closing immediately...');
                    closeIncognitoWindow(window.id);
                }
            });
        });
        
        // Also check all tabs for incognito
        chrome.tabs.query({}, function(tabs) {
            if (chrome.runtime.lastError) {
                console.log('Error querying tabs in periodic check:', chrome.runtime.lastError);
                return;
            }
            
            const incognitoTabs = tabs.filter(tab => tab.incognito);
            if (incognitoTabs.length > 0) {
                console.log('Periodic check found incognito tabs, redirecting...');
                incognitoTabs.forEach(tab => {
                    redirectIncognitoTab(tab);
                });
            }
        });
    } catch (error) {
        console.log('Error in periodic incognito check:', error);
    }
}, 5000); // Check every 5 seconds instead of 1 second to reduce spam

// Also check when the service worker starts
checkExistingIncognito(); 