// Single theme mode - no theme switching
(function() {
    console.log('Theme script loaded - single theme mode');
    
    // Remove any theme classes and localStorage entries
    document.body.classList.remove('light-theme');
    localStorage.removeItem('theme');
    
    // Function to hide the theme toggle button
    function hideThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (themeToggle) {
            // Hide the theme toggle button
            themeToggle.style.display = 'none';
            console.log('Theme toggle button hidden');
        }
    }
    
    // Set up once DOM is loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        hideThemeToggle();
    } else {
        document.addEventListener('DOMContentLoaded', hideThemeToggle);
    }
})();