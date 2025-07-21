// SafeSurf - Background Script (Incognito blocking removed)

console.log('SafeSurf background script started');

// Only keep message listener for popup communication
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Background received message:', request);
    // Only respond to protection status requests
    if (request.action === 'checkIncognitoStatus') {
        sendResponse({ incognitoBlocked: false });
    }
}); 