// src/components/ChatBotUtils.js

export function updateThemeColors() {
    const value = this.themeSliderValue;

    if (value <= 10) {
        // Dark mode
        this.style.setProperty('--bg-color', '#1f2937');
        this.style.setProperty('--text-color', '#ffffff');
        this.style.setProperty('--button-color', '#3b82f6');
        this.style.setProperty('--input-bg', '#2d3748');
        this.style.setProperty('--input-text', '#e2e8f0');
        this.style.setProperty('--border-color', '#2d3748');
        this.style.setProperty('--icon-color', '#e2e8f0');
        this.style.setProperty('--header-bg', '#2d3748');
        this.style.setProperty('--header-text', '#ffffff');
        this.style.setProperty('--button-text', '#ffffff');
    } else if (value >= 90) {
        // Light mode
        this.style.setProperty('--bg-color', '#ffffff');
        this.style.setProperty('--text-color', '#1f2937');
        this.style.setProperty('--button-color', '#3b82f6');
        this.style.setProperty('--input-bg', '#e5e7eb');
        this.style.setProperty('--input-text', '#1f2937');
        this.style.setProperty('--border-color', '#d1d5db');
        this.style.setProperty('--icon-color', '#1f2937');
        this.style.setProperty('--header-bg', '#e5e7eb');
        this.style.setProperty('--header-text', '#1f2937');
        this.style.setProperty('--button-text', '#ffffff');
    } else {
        // Colorful mode with gradient
        const progress = (value - 10) / 80; // Map the slider value to a range for colorful theme
        this.style.setProperty('--bg-color', `linear-gradient(90deg, #43cea2 ${progress * 100}%, #185a9d)`);
        this.style.setProperty('--text-color', `hsl(${progress * 200}, 70%, 90%)`);
        this.style.setProperty('--button-color', `hsl(${progress * 200 + 120}, 70%, 50%)`);
        this.style.setProperty('--input-bg', `hsl(${progress * 200}, 60%, 80%)`);
        this.style.setProperty('--input-text', `hsl(${progress * 200}, 70%, 10%)`);
        this.style.setProperty('--border-color', `hsl(${progress * 200}, 60%, 70%)`);
        this.style.setProperty('--icon-color', `hsl(${progress * 200 + 180}, 60%, 40%)`);
        this.style.setProperty('--header-bg', `hsl(${progress * 200}, 60%, 50%)`);
        this.style.setProperty('--header-text', `hsl(${progress * 200}, 70%, 10%)`);
        this.style.setProperty('--button-text', `hsl(${progress * 200 + 180}, 80%, 90%)`);
    }
}

export function loadThemeFromLocalStorage() {
    const savedThemeValue = localStorage.getItem('chatbotThemeSliderValue');
    if (savedThemeValue) {
        this.themeSliderValue = parseInt(savedThemeValue, 10);
        updateThemeColors.call(this);
    }
}

export function saveThemeToLocalStorage() {
    localStorage.setItem('chatbotThemeSliderValue', this.themeSliderValue.toString());
}

export function scrollToBottom() {
    const chatContainer = this.shadowRoot?.querySelector('.message-container');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

export function focusInput() {
    requestAnimationFrame(() => {
        const inputElement = this.shadowRoot?.querySelector('#chat-input');
        if (inputElement) {
            inputElement.focus();
        }
    });
}

export function copyToClipboard(content) {
    navigator.clipboard.writeText(content).then(() => {
        showNotification.call(this, 'Copied to clipboard!');
    });
}

export function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `fixed bottom-20 right-4 ${this.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}
