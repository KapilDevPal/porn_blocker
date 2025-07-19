// Default blocked keywords (protected from removal)
const defaultKeywords = [
    "porn", "sex", "xxx", "nsfw", "nude", "hentai", "adult", 
    "hot girls", "sex video", "pornography", "explicit", 
    "mature", "adult content", "18+", "adult site"
];

// DOM elements
const toggleProtection = document.getElementById('toggleProtection');
const status = document.getElementById('status');
const incognitoStatus = document.getElementById('incognitoStatus');
const newKeywordInput = document.getElementById('newKeyword');
const addKeywordBtn = document.getElementById('addKeyword');
const keywordsList = document.getElementById('keywordsList');

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadKeywords();
    checkIncognitoStatus();
    
    // Event listeners
    toggleProtection.addEventListener('change', toggleProtectionHandler);
    addKeywordBtn.addEventListener('click', addKeyword);
    newKeywordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addKeyword();
        }
    });
});

// Load protection status
function loadSettings() {
    chrome.storage.sync.get(['protectionEnabled'], function(result) {
        const isEnabled = result.protectionEnabled !== false; // Default to true
        toggleProtection.checked = isEnabled;
        updateStatusDisplay(isEnabled);
    });
}

// Toggle protection on/off
function toggleProtectionHandler() {
    const isEnabled = toggleProtection.checked;
    console.log('Toggling protection to:', isEnabled);
    
    chrome.storage.sync.set({ protectionEnabled: isEnabled }, function() {
        updateStatusDisplay(isEnabled);
        
        // Notify all content scripts about the change
        try {
            chrome.tabs.query({}, function(tabs) {
                if (chrome.runtime.lastError) {
                    console.log('Error querying tabs:', chrome.runtime.lastError);
                    return;
                }
                
                tabs.forEach(tab => {
                    try {
                        chrome.tabs.sendMessage(tab.id, {
                            action: 'updateProtection',
                            enabled: isEnabled
                        }).catch(() => {
                            // Ignore connection errors for tabs without content scripts
                        });
                    } catch (e) {
                        // Ignore errors for tabs that don't have content scripts
                    }
                });
            });
        } catch (error) {
            console.log('Error in toggleProtectionHandler:', error);
        }
        
        // Show feedback to user
        const message = isEnabled ? 'Protection enabled!' : 'Protection disabled!';
        showNotification(message);
    });
}

// Update status display
function updateStatusDisplay(isEnabled) {
    if (isEnabled) {
        status.className = 'status active';
        status.querySelector('span').textContent = 'Protection is ACTIVE';
    } else {
        status.className = 'status';
        status.querySelector('span').textContent = 'Protection is DISABLED';
    }
}

// Check incognito blocking status
function checkIncognitoStatus() {
    try {
        chrome.runtime.sendMessage({ action: 'checkIncognitoStatus' }, function(response) {
            if (chrome.runtime.lastError) {
                // Handle connection error
                incognitoStatus.querySelector('span').textContent = '🔒 Incognito Mode BLOCKED';
                return;
            }
            
            if (response && response.incognitoBlocked) {
                incognitoStatus.querySelector('span').textContent = '🔒 Incognito Mode BLOCKED';
            } else {
                incognitoStatus.querySelector('span').textContent = '⚠️ Incognito Mode NOT BLOCKED';
            }
        });
    } catch (error) {
        console.log('Error in checkIncognitoStatus:', error);
        incognitoStatus.querySelector('span').textContent = '🔒 Incognito Mode BLOCKED';
    }
}

// Show notification
function showNotification(message) {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        animation: fadeInOut 2s ease-in-out;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 2000);
}

// Load keywords from storage
function loadKeywords() {
    chrome.storage.sync.get(['blockedKeywords'], function(result) {
        const keywords = result.blockedKeywords || defaultKeywords;
        displayKeywords(keywords);
    });
}

// Display keywords in the list (only custom keywords)
function displayKeywords(keywords) {
    keywordsList.innerHTML = '';
    
    // Filter out default keywords - only show custom ones
    const customKeywords = keywords.filter(keyword => !defaultKeywords.includes(keyword));
    
    if (customKeywords.length === 0) {
        // Show a message when no custom keywords exist
        const noKeywordsMsg = document.createElement('div');
        noKeywordsMsg.style.cssText = `
            text-align: center;
            padding: 20px;
            opacity: 0.7;
            font-style: italic;
        `;
        noKeywordsMsg.textContent = 'No custom keywords added yet';
        keywordsList.appendChild(noKeywordsMsg);
        return;
    }
    
    customKeywords.forEach(keyword => {
        const keywordItem = document.createElement('div');
        keywordItem.className = 'keyword-item';
        
        const keywordSpan = document.createElement('span');
        keywordSpan.textContent = keyword;
        
        // Show remove button for custom keywords
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeKeyword(keyword));
        
        keywordItem.appendChild(keywordSpan);
        keywordItem.appendChild(removeBtn);
        keywordsList.appendChild(keywordItem);
    });
}

// Add new keyword
function addKeyword() {
    const keyword = newKeywordInput.value.trim().toLowerCase();
    
    if (!keyword) {
        showNotification('Please enter a keyword');
        return;
    }
    
    chrome.storage.sync.get(['blockedKeywords'], function(result) {
        const keywords = result.blockedKeywords || defaultKeywords;
        
        if (keywords.includes(keyword)) {
            showNotification('This keyword is already in the list');
            return;
        }
        
        keywords.push(keyword);
        
        chrome.storage.sync.set({ blockedKeywords: keywords }, function() {
            displayKeywords(keywords);
            newKeywordInput.value = '';
            
            // Notify all content scripts about the change
            try {
                chrome.tabs.query({}, function(tabs) {
                    if (chrome.runtime.lastError) {
                        console.log('Error querying tabs:', chrome.runtime.lastError);
                        return;
                    }
                    
                    tabs.forEach(tab => {
                        try {
                            chrome.tabs.sendMessage(tab.id, {
                                action: 'updateKeywords',
                                keywords: keywords
                            }).catch(() => {
                                // Ignore connection errors for tabs without content scripts
                            });
                        } catch (e) {
                            // Ignore errors for tabs that don't have content scripts
                        }
                    });
                });
            } catch (error) {
                console.log('Error in addKeyword:', error);
            }
            
            showNotification('Keyword added successfully!');
        });
    });
}

// Remove keyword
function removeKeyword(keywordToRemove) {
    // Prevent removal of default keywords
    if (defaultKeywords.includes(keywordToRemove)) {
        showNotification('Default keywords cannot be removed');
        return;
    }
    
    chrome.storage.sync.get(['blockedKeywords'], function(result) {
        const keywords = result.blockedKeywords || defaultKeywords;
        const updatedKeywords = keywords.filter(keyword => keyword !== keywordToRemove);
        
        chrome.storage.sync.set({ blockedKeywords: updatedKeywords }, function() {
            displayKeywords(updatedKeywords);
            
            // Notify all content scripts about the change
            try {
                chrome.tabs.query({}, function(tabs) {
                    if (chrome.runtime.lastError) {
                        console.log('Error querying tabs:', chrome.runtime.lastError);
                        return;
                    }
                    
                    tabs.forEach(tab => {
                        try {
                            chrome.tabs.sendMessage(tab.id, {
                                action: 'updateKeywords',
                                keywords: updatedKeywords
                            }).catch(() => {
                                // Ignore connection errors for tabs without content scripts
                            });
                        } catch (e) {
                            // Ignore errors for tabs that don't have content scripts
                        }
                    });
                });
            } catch (error) {
                console.log('Error in removeKeyword:', error);
            }
            
            showNotification('Keyword removed successfully!');
        });
    });
} 