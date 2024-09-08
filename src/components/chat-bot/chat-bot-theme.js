export const ChatBotTheme = {
    applyTheme(chatBot) {
        const value = chatBot.themeSliderValue;
        if (value <= 10) {
            // Dark Theme
            chatBot.style.setProperty('--bg-color', '#1a202c');
            chatBot.style.setProperty('--text-color', '#ffffff');
            chatBot.style.setProperty('--button-color', '#4a5568');
            chatBot.style.setProperty('--input-bg', '#2d3748');
            chatBot.style.setProperty('--input-text', '#e2e8f0');
            chatBot.style.setProperty('--border-color', '#2d3748');
            chatBot.style.setProperty('--icon-color', '#e2e8f0');
            chatBot.style.setProperty('--header-bg', '#2d3748');
            chatBot.style.setProperty('--header-text', '#ffffff');
            chatBot.style.setProperty('--button-text', '#ffffff');
            chatBot.style.setProperty('--accent-color', '#3b82f6');
            chatBot.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
        } else if (value >= 90) {
            // Light Theme
            chatBot.style.setProperty('--bg-color', '#ffffff');
            chatBot.style.setProperty('--text-color', '#1f2937');
            chatBot.style.setProperty('--button-color', '#3b82f6');
            chatBot.style.setProperty('--input-bg', '#e5e7eb');
            chatBot.style.setProperty('--input-text', '#1f2937');
            chatBot.style.setProperty('--border-color', '#d1d5db');
            chatBot.style.setProperty('--icon-color', '#1f2937');
            chatBot.style.setProperty('--header-bg', '#e5e7eb');
            chatBot.style.setProperty('--header-text', '#1f2937');
            chatBot.style.setProperty('--button-text', '#ffffff');
            chatBot.style.setProperty('--accent-color', '#1d4ed8');
            chatBot.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.15)');
        } else {
            // Gradient Theme Transition
            const progress = (value - 10) / 80;
            chatBot.style.setProperty('--bg-color', `hsl(${progress * 210}, 40%, ${100 - progress * 50}%)`);
            chatBot.style.setProperty('--text-color', `hsl(${progress * 210}, 30%, ${30 + progress * 40}%)`);
            chatBot.style.setProperty('--button-color', `hsl(${progress * 210 + 120}, 60%, 50%)`);
            chatBot.style.setProperty('--input-bg', `hsl(${progress * 210}, 50%, 90%)`);
            chatBot.style.setProperty('--input-text', `hsl(${progress * 210}, 30%, 20%)`);
            chatBot.style.setProperty('--border-color', `hsl(${progress * 210}, 40%, 70%)`);
            chatBot.style.setProperty('--icon-color', `hsl(${progress * 210 + 180}, 60%, 40%)`);
            chatBot.style.setProperty('--header-bg', `hsl(${progress * 210}, 40%, 80%)`);
            chatBot.style.setProperty('--header-text', `hsl(${progress * 210}, 20%, 10%)`);
            chatBot.style.setProperty('--button-text', `hsl(${progress * 210 + 180}, 80%, 90%)`);
            chatBot.style.setProperty('--accent-color', `hsl(${progress * 210 + 90}, 60%, 50%)`);
            chatBot.style.setProperty('--shadow-color', `rgba(0, 0, 0, ${0.3 - progress * 0.15})`);
        }
    },

    loadThemeFromLocalStorage(chatBot) {
        const savedThemeValue = localStorage.getItem('chatbotThemeSliderValue');
        if (savedThemeValue) {
            chatBot.themeSliderValue = parseInt(savedThemeValue, 10);
            this.applyTheme(chatBot);
        }
    }
};
