document.addEventListener('DOMContentLoaded', function() {
    const currentDateElement = document.getElementById('current-date');
    const currentDayElement = document.getElementById('current-day');
    const currentTimeElement = document.getElementById('current-time');
    
    // Function to update the date, day, and time
    function updateDateTime() {
        const now = new Date();
        
        // Format date as DD/MM/YYYY
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = now.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        
        // Get day of week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[now.getDay()];
        
        // Format time as HH:MM:SS
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        
        // Update the elements
        currentDateElement.textContent = formattedDate;
        currentDayElement.textContent = dayOfWeek;
        currentTimeElement.textContent = formattedTime;
    }
    
    // Update immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
});