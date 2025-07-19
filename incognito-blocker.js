// SafeSurf - Incognito Blocker Content Script
// This script runs in incognito mode to immediately block access

console.log('SafeSurf incognito blocker activated');

// Function to redirect to protection page
function redirectToProtection() {
    const redirectURL = chrome.runtime.getURL('redirect.html');
    if (window.location.href !== redirectURL) {
        console.log('Redirecting incognito tab to protection page');
        window.location.href = redirectURL;
    }
}

// Check if we're in incognito mode using multiple methods
function checkIncognitoMode() {
    try {
        // Method 1: Try to access chrome.extension.inIncognitoContext
        if (typeof chrome !== 'undefined' && chrome.extension && chrome.extension.inIncognitoContext) {
            console.log('Incognito mode detected via extension API');
            return true;
        }
        
        // Method 2: Try chrome.runtime.inIncognitoContext
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.inIncognitoContext) {
            console.log('Incognito mode detected via runtime API');
            return true;
        }
        
        // Method 3: Check if we're in an incognito window by URL patterns
        if (window.location.href.includes('chrome://') || window.location.href.includes('chrome-extension://')) {
            console.log('In Chrome extension context, checking for incognito...');
            return false; // Let the background script handle this
        }
        
        // Method 4: Check for incognito-specific features
        if (window.chrome && window.chrome.webstore) {
            console.log('Chrome webstore API available, likely not incognito');
            return false;
        }
        
        return false;
    } catch (error) {
        console.log('Error checking incognito mode:', error);
        return false;
    }
}

// Check immediately
if (checkIncognitoMode()) {
    console.log('Incognito mode detected, redirecting immediately...');
    redirectToProtection();
}

// Also check on page load
window.addEventListener('load', function() {
    if (checkIncognitoMode()) {
        console.log('Incognito mode detected on load, redirecting...');
        redirectToProtection();
    }
});

// Check more frequently
setInterval(function() {
    if (checkIncognitoMode()) {
        console.log('Periodic incognito check, redirecting...');
        redirectToProtection();
    }
}, 500); // Check every 500ms instead of 2 seconds

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Incognito blocker received message:', request);
    
    if (request.action === 'redirectIncognito') {
        redirectToProtection();
    }
});

// Send a message to background script to check if we're in incognito mode
try {
    chrome.runtime.sendMessage({ action: 'checkIncognitoContext' }, function(response) {
        if (chrome.runtime.lastError) {
            console.log('Error checking incognito context:', chrome.runtime.lastError);
            return;
        }
        
        if (response && response.isIncognito) {
            console.log('Background script confirmed incognito mode, redirecting...');
            redirectToProtection();
        }
    });
} catch (error) {
    console.log('Error sending message to background script:', error);
}

// Additional check: if we can't access certain APIs, we might be in incognito
try {
    if (!window.chrome || !window.chrome.runtime) {
        console.log('Chrome APIs not available, might be in incognito mode');
        redirectToProtection();
    }
} catch (error) {
    console.log('Error checking Chrome APIs:', error);
    redirectToProtection();
} 