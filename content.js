// SafeSurf - Porn Blocker Content Script
// Runs at document_start to catch content before page loads

console.log('SafeSurf content script loaded');

// Default blocked keywords (fallback)
const defaultBlockedKeywords = [
  "porn", "sex", "xxx", "nsfw", "nude", "hentai", "adult", 
  "hot girls", "sex video", "pornography", "explicit", 
  "mature", "adult content", "18+", "adult site"
];

// Whitelist domains that should never be blocked
const whitelistDomains = [
  "google.com", "bing.com", "yahoo.com", "duckduckgo.com",
  "wikipedia.org", "stackoverflow.com", "github.com",
  "reddit.com", "youtube.com", "facebook.com", "twitter.com",
  "linkedin.com", "amazon.com", "ebay.com", "walmart.com",
  "target.com", "bestbuy.com", "homedepot.com", "lowes.com",
  "netflix.com", "spotify.com", "discord.com", "slack.com",
  "zoom.us", "teams.microsoft.com", "office.com", "microsoft.com",
  "apple.com", "adobe.com", "autodesk.com", "blender.org",
  "unity.com", "unrealengine.com", "steam.com", "epicgames.com",
  "nvidia.com", "amd.com", "intel.com", "dell.com", "hp.com",
  "lenovo.com", "asus.com", "acer.com", "samsung.com",
  "lg.com", "sony.com", "canon.com", "nikon.com",
  "weather.com", "accuweather.com", "weather.gov",
  "maps.google.com", "earth.google.com", "translate.google.com",
  "drive.google.com", "docs.google.com", "sheets.google.com",
  "slides.google.com", "gmail.com", "outlook.com", "yahoo.com",
  "icloud.com", "dropbox.com", "onedrive.live.com", "box.com",
  "mega.nz", "mediafire.com", "rapidshare.com", "4shared.com",
  "scribd.com", "slideshare.net", "prezi.com", "canva.com",
  "figma.com", "sketch.com", "invisionapp.com", "framer.com",
  "webflow.com", "wix.com", "squarespace.com", "wordpress.com",
  "shopify.com", "woocommerce.com", "magento.com", "prestashop.com",
  "opencart.com", "oscommerce.com", "zencart.com", "cubecart.com",
  "bigcommerce.com", "volusion.com", "3dcart.com", "ecwid.com",
  "etsy.com", "pinterest.com", "instagram.com", "tiktok.com",
  "snapchat.com", "whatsapp.com", "telegram.org", "signal.org",
  "viber.com", "line.me", "wechat.com", "qq.com", "weibo.com",
  "baidu.com", "naver.com", "daum.net", "yahoo.co.jp",
  "rakuten.co.jp", "amazon.co.jp", "amazon.de", "amazon.co.uk",
  "amazon.fr", "amazon.it", "amazon.es", "amazon.ca", "amazon.com.au",
  "ebay.co.uk", "ebay.de", "ebay.fr", "ebay.it", "ebay.es", "ebay.ca",
  "ebay.com.au", "alibaba.com", "aliexpress.com", "wish.com",
  "temu.com", "shein.com", "romwe.com", "zaful.com", "gearbest.com",
  "banggood.com", "lightinthebox.com", "dx.com", "focalprice.com",
  "dealextreme.com", "chinavasion.com", "everbuying.com",
  "tomtop.com", "tvc-mall.com", "geekbuying.com", "antelife.com"
];

let blockedKeywords = [...defaultBlockedKeywords];
let protectionEnabled = true;

// Load settings from storage
function loadSettings() {
    try {
        chrome.storage.sync.get(['blockedKeywords', 'protectionEnabled'], function(result) {
            if (chrome.runtime.lastError) {
                console.log('Error loading settings:', chrome.runtime.lastError);
                return;
            }
            
            if (result.blockedKeywords) {
                blockedKeywords = result.blockedKeywords;
                console.log('Loaded keywords:', blockedKeywords);
            }
            if (result.protectionEnabled !== undefined) {
                protectionEnabled = result.protectionEnabled;
                console.log('Protection enabled:', protectionEnabled);
            } else {
                // Default to true if not set
                protectionEnabled = true;
                console.log('Protection enabled (default):', protectionEnabled);
            }
            
            // After loading settings, perform safety check
            performSafetyCheck();
        });
    } catch (error) {
        console.log('Error in loadSettings:', error);
        // Default to true on error
        protectionEnabled = true;
        performSafetyCheck();
    }
}

// Check if domain is whitelisted
function isWhitelisted(url) {
    try {
        const domain = new URL(url).hostname.toLowerCase();
        console.log('Checking whitelist for domain:', domain);
        
        // Check if the URL contains blocked keywords first
        const lowerURL = url.toLowerCase();
        const hasBlockedKeywords = blockedKeywords.some(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            return lowerURL.includes(lowerKeyword);
        });
        
        if (hasBlockedKeywords) {
            console.log('URL contains blocked keywords, bypassing whitelist');
            return false;
        }
        
        const isWhitelisted = whitelistDomains.some(whitelistDomain => 
            domain === whitelistDomain || domain.endsWith('.' + whitelistDomain)
        );
        
        console.log('Whitelist check result:', isWhitelisted);
        return isWhitelisted;
    } catch (e) {
        console.log('Error in whitelist check:', e);
        return false;
    }
}

// Improved keyword matching with context awareness
function checkKeywordMatch(text, keyword) {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    // Split keyword into words for better matching
    const keywordWords = lowerKeyword.split(/\s+/);
    
    // Check if all words in the keyword are present
    if (keywordWords.length > 1) {
        return keywordWords.every(word => lowerText.includes(word));
    }
    
    // For single words, check for word boundaries to avoid false positives
    const wordBoundaryRegex = new RegExp(`\\b${lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return wordBoundaryRegex.test(text);
}

// Function to check if URL contains blocked keywords
function checkURL(url) {
    if (!protectionEnabled) {
        console.log('Protection disabled, skipping URL check');
        return false;
    }
    
    // Always allow whitelisted domains
    if (isWhitelisted(url)) {
        console.log('URL is whitelisted:', url);
        return false;
    }
    
    const lowerURL = url.toLowerCase();
    console.log('Checking URL:', url);
    console.log('Blocked keywords:', blockedKeywords);
    console.log('URL to check:', lowerURL);
    
    // Check for exact keyword matches in URL
    const shouldBlock = blockedKeywords.some(keyword => {
        const lowerKeyword = keyword.toLowerCase();
        console.log('Checking keyword:', lowerKeyword, 'against URL:', lowerURL);
        
        // For multi-word keywords, check if all words are present
        if (lowerKeyword.includes(' ')) {
            const keywordWords = lowerKeyword.split(/\s+/);
            const allWordsPresent = keywordWords.every(word => lowerURL.includes(word));
            console.log('Multi-word keyword check:', keywordWords, 'Result:', allWordsPresent);
            return allWordsPresent;
        }
        
        // For single words, check for word boundaries
        const wordBoundaryRegex = new RegExp(`\\b${lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const regexMatch = wordBoundaryRegex.test(url);
        console.log('Single word regex check:', wordBoundaryRegex, 'Result:', regexMatch);
        
        // Also check simple contains for debugging
        const simpleMatch = lowerURL.includes(lowerKeyword);
        console.log('Simple contains check:', lowerKeyword, 'Result:', simpleMatch);
        
        return regexMatch || simpleMatch;
    });
    
    if (shouldBlock) {
        console.log('URL blocked due to keyword match:', url);
    } else {
        console.log('URL passed all keyword checks');
    }
    
    return shouldBlock;
}

// Function to check if page content contains blocked keywords
function checkPageContent() {
    if (!protectionEnabled) {
        console.log('Protection disabled, skipping content check');
        return false;
    }
    
    // Always allow whitelisted domains
    if (isWhitelisted(window.location.href)) {
        console.log('Page is whitelisted:', window.location.href);
        return false;
    }
    
    const bodyText = document.body ? document.body.innerText : '';
    const titleText = document.title || '';
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaText = metaDescription ? metaDescription.getAttribute('content') || '' : '';
    
    const allText = bodyText + ' ' + titleText + ' ' + metaText;
    
    console.log('Content check - Title:', titleText);
    console.log('Content check - Meta description:', metaText);
    console.log('Content check - Body text length:', bodyText.length);
    console.log('Content check - All text length:', allText.length);
    console.log('Content check - First 200 chars of body:', bodyText.substring(0, 200));
    
    // Only check if there's substantial content
    if (allText.trim().length < 50) {
        console.log('Page content too short, skipping check');
        return false;
    }
    
    console.log('Checking page content for keywords');
    console.log('Blocked keywords to check:', blockedKeywords);
    
    const shouldBlock = blockedKeywords.some(keyword => {
        const match = checkKeywordMatch(allText, keyword);
        console.log('Content keyword check:', keyword, 'Result:', match);
        return match;
    });
    
    if (shouldBlock) {
        console.log('Page content blocked due to keyword match');
    } else {
        console.log('Page content passed all keyword checks');
    }
    
    return shouldBlock;
}

// Function to redirect to safe page
function redirectToSafePage() {
    if (!protectionEnabled) {
        console.log('Protection disabled, not redirecting');
        return;
    }
    console.log('Redirecting to safe page');
    const redirectURL = chrome.runtime.getURL('redirect.html');
    window.location.href = redirectURL;
}

// Main function to perform checks
function performSafetyCheck() {
    console.log('Performing safety check...');
    console.log('Protection enabled:', protectionEnabled);
    console.log('Current URL:', window.location.href);
    
    // Don't check if protection is disabled
    if (!protectionEnabled) {
        console.log('Protection is disabled, allowing all content');
        return;
    }
    
    // Check current URL
    if (checkURL(window.location.href)) {
        console.log('URL blocked, redirecting...');
        redirectToSafePage();
        return;
    }
    
    // Check page content (only if DOM is ready)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, checking content...');
            if (protectionEnabled && checkPageContent()) {
                console.log('Content blocked, redirecting...');
                redirectToSafePage();
            }
        });
    } else {
        console.log('DOM already loaded, checking content...');
        if (protectionEnabled && checkPageContent()) {
            console.log('Content blocked, redirecting...');
            redirectToSafePage();
        }
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Received message:', request);
    
    if (request.action === 'updateKeywords') {
        blockedKeywords = request.keywords;
        console.log('Updated keywords:', blockedKeywords);
        // Re-check current page with new keywords only if protection is enabled
        if (protectionEnabled) {
            performSafetyCheck();
        }
    } else if (request.action === 'updateProtection') {
        protectionEnabled = request.enabled;
        console.log('Protection updated:', protectionEnabled);
        
        // If protection is disabled, allow the current page immediately
        if (!protectionEnabled) {
            console.log('Protection disabled, allowing current page');
            return;
        } else {
            // Re-check current page if protection was re-enabled
            console.log('Protection enabled, re-checking current page');
            performSafetyCheck();
        }
    }
});

// Load settings and run initial check
loadSettings();

// Also check on URL changes (for SPAs)
let currentURL = window.location.href;
const observer = new MutationObserver(() => {
    if (window.location.href !== currentURL) {
        currentURL = window.location.href;
        console.log('URL changed, re-checking:', currentURL);
        
        // Only perform safety check if protection is enabled
        if (protectionEnabled) {
            performSafetyCheck();
        } else {
            console.log('Protection disabled, skipping URL change check');
        }
    }
});

// Start observing URL changes
observer.observe(document, { subtree: true, childList: true }); 