// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully');
    
    // Get the Our App button and target
    const ourAppBtn = document.getElementById('ourAppButton');
    const appDownloadBox = document.getElementById('app-download');
    
    if(ourAppBtn && appDownloadBox) {
        ourAppBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Our App button clicked!');
            console.log('Target found:', appDownloadBox);
            
            // Scroll to app download box
            const headerOffset = 100;
            const elementPosition = appDownloadBox.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Add highlight animation
            setTimeout(() => {
                appDownloadBox.classList.add('highlight-bounce');
                console.log('Animation added');
                setTimeout(() => {
                    appDownloadBox.classList.remove('highlight-bounce');
                }, 2000);
            }, 800);
        });
    } else {
        console.error('Button or target not found!');
        console.log('Button:', ourAppBtn);
        console.log('Target:', appDownloadBox);
    }
    
    // Handle all other anchor links
    document.querySelectorAll('a[href^="#"]:not(#ourAppButton)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if(href && href !== '#') {
                const target = document.querySelector(href);
                
                if(target) {
                    e.preventDefault();
                    
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    console.log('Navigation setup complete');

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');

    // Function to set the theme
    function setTheme(isDarkMode) {
        if (isDarkMode) {
            body.classList.add('dark-mode');
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'inline';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            if (moonIcon) moonIcon.style.display = 'inline';
            if (sunIcon) sunIcon.style.display = 'none';
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    // Check for saved dark mode preference on load
    if (localStorage.getItem('darkMode') === 'enabled') {
        setTheme(true);
    } else {
        setTheme(false); // Default to light mode
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            setTheme(!body.classList.contains('dark-mode'));
        });
    }
});