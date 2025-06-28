// Default blocked keywords
const defaultKeywords = [
    "porn", "sex", "xxx", "nsfw", "nude", "hentai", "adult", 
    "hot girls", "sex video", "pornography", "explicit", 
    "mature", "adult content", "18+", "adult site"
];

// DOM elements
const toggleProtection = document.getElementById('toggleProtection');
const status = document.getElementById('status');
const newKeywordInput = document.getElementById('newKeyword');
const addKeywordBtn = document.getElementById('addKeyword');
const keywordsList = document.getElementById('keywordsList');

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadKeywords();
    
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
    chrome.storage.sync.set({ protectionEnabled: isEnabled }, function() {
        updateStatusDisplay(isEnabled);
        
        // Notify content script about the change
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateProtection',
                    enabled: isEnabled
                });
            }
        });
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

// Load keywords from storage
function loadKeywords() {
    chrome.storage.sync.get(['blockedKeywords'], function(result) {
        const keywords = result.blockedKeywords || defaultKeywords;
        displayKeywords(keywords);
    });
}

// Display keywords in the list
function displayKeywords(keywords) {
    keywordsList.innerHTML = '';
    
    keywords.forEach(keyword => {
        const keywordItem = document.createElement('div');
        keywordItem.className = 'keyword-item';
        
        const keywordSpan = document.createElement('span');
        keywordSpan.textContent = keyword;
        
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
        alert('Please enter a keyword');
        return;
    }
    
    chrome.storage.sync.get(['blockedKeywords'], function(result) {
        const keywords = result.blockedKeywords || defaultKeywords;
        
        if (keywords.includes(keyword)) {
            alert('This keyword is already in the list');
            return;
        }
        
        keywords.push(keyword);
        
        chrome.storage.sync.set({ blockedKeywords: keywords }, function() {
            displayKeywords(keywords);
            newKeywordInput.value = '';
            
            // Notify content script about the change
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateKeywords',
                        keywords: keywords
                    });
                }
            });
        });
    });
}

// Remove keyword
function removeKeyword(keywordToRemove) {
    chrome.storage.sync.get(['blockedKeywords'], function(result) {
        const keywords = result.blockedKeywords || defaultKeywords;
        const updatedKeywords = keywords.filter(keyword => keyword !== keywordToRemove);
        
        chrome.storage.sync.set({ blockedKeywords: updatedKeywords }, function() {
            displayKeywords(updatedKeywords);
            
            // Notify content script about the change
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateKeywords',
                        keywords: updatedKeywords
                    });
                }
            });
        });
    });
} 