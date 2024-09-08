export const ChatBotUtils = {
    loadHighlightJsCss() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css';
        document.head.appendChild(link);
    },

    setupResizeObserver(chatBot) {
        const chatContainer = chatBot.shadowRoot.querySelector('.chat-container');
        if (chatContainer && !chatBot.resizeObserver) {
            chatBot.resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    chatBot.chatContainerWidth = entry.contentRect.width;
                    chatBot.chatContainerHeight = entry.contentRect.height;
                    chatBot.requestUpdate();
                }
            });
            chatBot.resizeObserver.observe(chatContainer);
        }
    },

    setupDraggable(chatBot) {
        const container = chatBot.shadowRoot.querySelector('.chat-container');
        const header = chatBot.shadowRoot.querySelector('.chat-header');
        if (!container || !header) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const startDragging = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = container.offsetLeft;
            startTop = container.offsetTop;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDragging);
        };

        const drag = (e) => {
            if (isDragging) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                container.style.left = `${startLeft + deltaX}px`;
                container.style.top = `${startTop + deltaY}px`;
            }
        };

        const stopDragging = () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDragging);
        };

        header.addEventListener('mousedown', startDragging);
    },

    setupLanguage(chatBot) {
        console.log(`Current language set to: ${chatBot.language}`);
    }
};
