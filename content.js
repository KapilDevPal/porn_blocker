// SafeSurf - Porn Blocker Content Script
// Runs at document_start to catch content before page loads

// Default blocked keywords (fallback)
const defaultBlockedKeywords = [
  "porn", "sex", "xxx", "nsfw", "nude", "hentai", "adult", 
  "hot girls", "sex video", "pornography", "explicit", 
  "mature", "adult content", "18+", "adult site"
];

let blockedKeywords = [...defaultBlockedKeywords];
let protectionEnabled = true;

// Load settings from storage
function loadSettings() {
    chrome.storage.sync.get(['blockedKeywords', 'protectionEnabled'], function(result) {
        if (result.blockedKeywords) {
            blockedKeywords = result.blockedKeywords;
        }
        if (result.protectionEnabled !== undefined) {
            protectionEnabled = result.protectionEnabled;
        }
    });
}

// Function to check if URL contains blocked keywords
function checkURL(url) {
    if (!protectionEnabled) return false;
    
    const lowerURL = url.toLowerCase();
    return blockedKeywords.some(keyword => 
        lowerURL.includes(keyword.toLowerCase())
    );
}

// Function to check if page content contains blocked keywords
function checkPageContent() {
    if (!protectionEnabled) return false;
    
    const bodyText = document.body ? document.body.innerText.toLowerCase() : '';
    const titleText = document.title ? document.title.toLowerCase() : '';
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaText = metaDescription ? metaDescription.getAttribute('content').toLowerCase() : '';
    
    const allText = bodyText + ' ' + titleText + ' ' + metaText;
    
    return blockedKeywords.some(keyword => 
        allText.includes(keyword.toLowerCase())
    );
}

// Function to redirect to safe page
function redirectToSafePage() {
    const redirectURL = chrome.runtime.getURL('redirect.html');
    window.location.href = redirectURL;
}

// Main function to perform checks
function performSafetyCheck() {
    // Check current URL
    if (checkURL(window.location.href)) {
        redirectToSafePage();
        return;
    }
    
    // Check page content (only if DOM is ready)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (checkPageContent()) {
                redirectToSafePage();
            }
        });
    } else {
        if (checkPageContent()) {
            redirectToSafePage();
        }
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateKeywords') {
        blockedKeywords = request.keywords;
        // Re-check current page with new keywords
        performSafetyCheck();
    } else if (request.action === 'updateProtection') {
        protectionEnabled = request.enabled;
        if (protectionEnabled) {
            // Re-check current page if protection was re-enabled
            performSafetyCheck();
        }
    }
});

// Load settings and run initial check
loadSettings();
performSafetyCheck();

// Also check on URL changes (for SPAs)
let currentURL = window.location.href;
const observer = new MutationObserver(() => {
    if (window.location.href !== currentURL) {
        currentURL = window.location.href;
        performSafetyCheck();
    }
});

// Start observing URL changes
observer.observe(document, { subtree: true, childList: true }); 