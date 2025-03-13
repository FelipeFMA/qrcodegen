document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    body.setAttribute('data-theme', initialTheme);
    
    // Update theme toggle icon based on current theme
    updateThemeIcon();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        const currentTheme = body.getAttribute('data-theme');
        
        // Only update if no theme is saved
        if (!savedTheme && currentTheme !== newSystemTheme) {
            body.setAttribute('data-theme', newSystemTheme);
            updateThemeIcon();
        }
    });
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add transition class for smooth theme change
        document.documentElement.classList.add('theme-transition');
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 500);
    });
    
    function updateThemeIcon() {
        const isDark = body.getAttribute('data-theme') === 'dark';
        themeToggle.innerHTML = isDark ? '<span class="icon">☀️</span>' : '<span class="icon">🌙</span>';
        
        // Add animation to the icon
        const icon = themeToggle.querySelector('.icon');
        icon.classList.add('icon-spin');
        setTimeout(() => {
            icon.classList.remove('icon-spin');
        }, 500);
    }
    
    const qrText = document.getElementById('qrText');
    const generateBtn = document.getElementById('generateBtn');
    const qrCodeDiv = document.getElementById('qrCode');
    const downloadBtn = document.getElementById('downloadBtn');

    generateBtn.addEventListener('click', generateQRCode);
    qrText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });
    
    // Focus the input field on page load
    qrText.focus();

    function generateQRCode() {
        const text = qrText.value.trim();
        if (!text) {
            // Show error with shake animation
            qrText.classList.add('error');
            qrText.placeholder = 'Please enter text or URL';
            setTimeout(() => {
                qrText.classList.remove('error');
                qrText.placeholder = 'Enter text or URL';
            }, 1000);
            return;
        }

        // Add loading state to button
        generateBtn.disabled = true;
        generateBtn.innerHTML = 'Generating...';

        // Clear previous QR code with animation
        if (qrCodeDiv.firstChild) {
            // Remove visible class first for smooth transition
            qrCodeDiv.classList.remove('visible');
            qrCodeDiv.firstChild.style.opacity = '0';
            qrCodeDiv.firstChild.style.transform = 'scale(0.8)';
            
            // Wait for fade out animation
            setTimeout(() => {
                qrCodeDiv.innerHTML = '';
                // Hide the QR code container during transition
                qrCodeDiv.style.display = 'none';
                createQRCode(text);
            }, 300);
        } else {
            createQRCode(text);
        }
    }
    
    function createQRCode(text) {
        // Generate the QR code
        const qr = qrcode(0, 'L');
        qr.addData(text);
        qr.make();

        // Make the QR code container visible
        qrCodeDiv.style.display = 'inline-block';
        
        // Force reflow to ensure the display change takes effect before adding the class
        void qrCodeDiv.offsetWidth;

        // Add the QR code to the DOM with animation
        const qrImage = document.createElement('img');
        qrImage.src = qr.createDataURL(4);
        qrImage.alt = `QR Code for: ${text}`;
        qrImage.style.opacity = '0';
        qrImage.style.transform = 'scale(0.9)';
        qrCodeDiv.appendChild(qrImage);
        
        // Add visible class for smooth transition
        setTimeout(() => {
            qrCodeDiv.classList.add('visible');
        }, 10);

        // Entrance animation for QR code
        setTimeout(() => {
            qrImage.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            qrImage.style.opacity = '1';
            qrImage.style.transform = 'scale(1)';
            
            // Reset button state
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate QR Code';
        }, 50);

        // Show download button with animation
        downloadBtn.classList.remove('hidden');
        downloadBtn.style.opacity = '0';
        downloadBtn.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            downloadBtn.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            downloadBtn.style.opacity = '1';
            downloadBtn.style.transform = 'translateY(0)';
        }, 300);

        // Set up download functionality
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = `qr-code-${Date.now()}.png`;
            link.href = qrImage.src;
            
            // Add download animation
            qrImage.style.transform = 'scale(0.95)';
            setTimeout(() => {
                qrImage.style.transform = 'scale(1)';
                link.click();
            }, 200);
        };
    }
});
