function goBack() {
    window.history.back();
}

function goToGoogle() {
    window.location.href = 'https://www.google.com';
}

// Prevent going back to the blocked page
window.addEventListener('load', function() {
    if (window.history.length > 1) {
        // Clear the blocked page from history
        window.history.replaceState(null, null, window.location.href);
    }
}); 