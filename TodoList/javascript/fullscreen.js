// Fullscreen functionality
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    
    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('click', function() {
            toggleFullscreen();
        });
    }
    
    // Function to toggle fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement && 
            !document.mozFullScreenElement && 
            !document.webkitFullscreenElement && 
            !document.msFullscreenElement) {
            // Enter fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
                document.documentElement.mozRequestFullScreen();
            }
            if (fullscreenToggle) {
                fullscreenToggle.innerHTML = '⛶';
                fullscreenToggle.title = 'Exit fullscreen';
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            }
            if (fullscreenToggle) {
                fullscreenToggle.innerHTML = '⛶';
                fullscreenToggle.title = 'Enter fullscreen';
            }
        }
    }
    
    // Update button icon when fullscreen changes
    document.addEventListener('fullscreenchange', updateFullscreenButtonIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButtonIcon);
    document.addEventListener('mozfullscreenchange', updateFullscreenButtonIcon);
    document.addEventListener('MSFullscreenChange', updateFullscreenButtonIcon);
    
    function updateFullscreenButtonIcon() {
        if (fullscreenToggle) {
            if (document.fullscreenElement || 
                document.webkitFullscreenElement || 
                document.mozFullScreenElement || 
                document.msFullscreenElement) {
                fullscreenToggle.innerHTML = '⛶';
                fullscreenToggle.title = 'Exit fullscreen'; 
            } else {
                fullscreenToggle.innerHTML = '⛶';
                fullscreenToggle.title = 'Enter fullscreen';
            }
        }
    }
});