import hljs from 'highlight.js/lib/core';
import { unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { html } from 'lit';
import { marked } from 'marked';

export const ChatBotMessages = {

    handleSend: async function () {
        if (this.input.trim() && !this.isLoading) {
            const userMessage = { role: 'user', content: this.input };
            this.messages = [...this.messages, userMessage];
            this.input = '';
            this.isLoading = true;

            await this.sendMessageWithRetry({
                messages: this.messages,
                model: this.selectedModel,
                temperature: this.temperature,
                max_tokens: this.maxTokens,
                top_p: this.topP,
                stream: true,
            });

            this.isLoading = false;
            this.focusInput();
        }
    },

    renderMessage(message) {
        const containerClass = message.role === 'user' ? 'justify-end' : 'justify-start';
        const messageClass = message.role === 'user'
            ? `message user ${this.theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`
            : `message assistant ${this.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} ${this.theme === 'dark' ? 'text-white' : 'text-gray-800'}`;

        // Convert Markdown to HTML
        const htmlContent = marked(message.content, {
            highlight: (code, lang) => {
                return lang && hljs.getLanguage(lang)
                    ? hljs.highlight(code, { language: lang }).value
                    : hljs.highlightAuto(code).value;
            },
        });

        return html`
      <div class="flex ${containerClass} items-end space-x-2 w-full">
        <div class="flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-1 max-w-[80%]">
          <div class="${messageClass} px-3 py-2 rounded-lg shadow-sm">
            <div class="prose ${this.theme === 'dark' ? 'prose-invert' : ''} max-w-none">
              ${unsafeHTML(htmlContent)}
            </div>
          </div>
          <button
            @click=${() => this.copyToClipboard(message.content)}
            class="icon-button"
            aria-label="Copy message"
          >
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M6 9h12v2H6V9zm0 4h12v2H6v-2zm0 4h12v2H6v-2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    },

    clearChat() {
        this.messages = [];
        localStorage.removeItem('chatMessages');
        this.focusInput();
    },

    sendMessageWithRetry: async function (requestBody, attempt = 0) {
        let buffer = '';
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = { role: 'assistant', content: '' };
            this.messages = [...this.messages, assistantMessage];

            const streamContent = async () => {
                const { value, done } = await reader.read();
                if (done) {
                    this.scrollToBottom(true);
                    this.saveMessagesToLocalStorage();
                    return;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete data in the buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (data === '[DONE]') {
                            this.scrollToBottom(true);
                            this.saveMessagesToLocalStorage();
                            return;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed?.choices?.[0]?.delta?.content;
                            if (content) {
                                assistantMessage.content += content;
                                this.messages = [...this.messages.slice(0, -1), { ...assistantMessage }];
                                this.requestUpdate();
                                this.scrollToBottom();
                            }
                        } catch (error) {
                            console.error('Error parsing JSON:', error, 'Data:', data);
                        }
                    }
                }
                setTimeout(streamContent, 50); // Continue streaming
            };

            streamContent();
        } catch (error) {
            if (attempt < this.maxRetryAttempts) {
                console.warn(`Retrying... (${attempt + 1}/${this.maxRetryAttempts})`);
                setTimeout(() => this.sendMessageWithRetry(requestBody, attempt + 1), this.retryDelay);
            } else {
                this.errorNotification('Failed to send message after multiple attempts.');
                console.error('Error sending message:', error);
                this.messages = [
                    ...this.messages,
                    { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }
                ];
                this.saveMessagesToLocalStorage();
            }
        }
    },

    saveMessagesToLocalStorage() {
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }
};
