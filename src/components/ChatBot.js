import { unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { LitElement, css, html, unsafeCSS } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@4.0.0/lib/marked.esm.js';
import styles from './styles.css';

const defaultModels = [
    "AI21-Jamba-Instruct", "Cohere-command-r", "Cohere-command-r-plus", "Meta-Llama-3-70B-Instruct",
    "Meta-Llama-3-8B-Instruct", "Meta-Llama-3-1-405B-Instruct", "Meta-Llama-3-1-70B-Instruct",
    "Meta-Llama-3-1-8B-Instruct", "Mistral-large", "Mistral-large-2407", "Mistral-Nemo",
    "Mistral-small", "gpt-4o", "gpt-4o-mini", "Phi-3-medium-128k-instruct", "Phi-3-medium-4k-instruct",
    "Phi-3-mini-128k-instruct", "Phi-3-mini-4k-instruct", "Phi-3-small-128k-instruct",
    "Phi-3-small-8k-instruct", "Phi-3.5-mini-instruct", "text-embedding-3-large",
    "text-embedding-3-small", "cohere-embed-v3-english", "cohere-embed-v3-multilingual"
];

export class ChatBot extends LitElement {
    static properties = {
        endpoint: { type: String },
        heading: { type: String },
        models: { type: Array },
        theme: { type: String },
        initialModel: { type: String },
        initialTemperature: { type: Number },
        initialMaxTokens: { type: Number },
        initialTopP: { type: Number },
        input: { type: String },
        messages: { type: Array },
        isLoading: { type: Boolean },
        isChatOpen: { type: Boolean },
        isSettingsOpen: { type: Boolean },
        selectedModel: { type: String },
        temperature: { type: Number },
        maxTokens: { type: Number },
        topP: { type: Number },
        enableSettings: { type: Boolean },
        buttonLabels: { type: Object },
        fontSize: { type: String },
        showToolbar: { type: Boolean },
        initialPlaceholder: { type: String },
        subsequentPlaceholder: { type: String },
        themeSliderValue: { type: Number },
    };

    static styles = [ css`
      :host {
        --bg-color: #1a202c;
        --text-color: #ffffff;
        --button-color: #4a5568;
        --input-bg: #2d3748;
        --input-text: #e2e8f0;
        --border-color: #2d3748;
        --icon-color: #e2e8f0;
        --header-bg: #2d3748;
        --header-text: #ffffff;
        --button-text: #ffffff;
      }

      .chat-container {
        background: var(--bg-color);
        color: var(--text-color);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 24rem;
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--border-color);
        overflow: hidden;
        animation: slideIn 0.3s ease-in-out;
      }

      .chat-button {
        background-color: var(--button-color);
        color: var(--button-text);
        border-radius: 50%;
        padding: 1rem;
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        border: none;
        transition: background-color 0.3s, transform 0.3s;
      }

      .chat-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      }

      .chat-button:active {
        transform: scale(0.95);
      }

      .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: var(--header-bg);
        color: var(--header-text);
        border-bottom: 1px solid var(--border-color);
      }

      .chat-input-container {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-top: 1px solid var(--border-color);
        background: var(--input-bg);
      }

      .chat-input {
        background-color: var(--input-bg);
        color: var(--input-text);
        padding: 0.5rem;
        border-radius: 0.375rem;
        border: 1px solid var(--border-color);
        flex-grow: 1;
        margin-right: 0.5rem;
        font-size: var(--font-size);
      }

      .send-button {
        background-color: var(--button-color);
        color: var(--button-text);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s;
      }

      .send-button:hover {
        transform: scale(1.05);
      }

      .message-container {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem 1rem;
        background: var(--bg-color);
        scroll-behavior: smooth;
        max-height: calc(80vh - 8rem);
      }

      .message {
        margin-bottom: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        display: inline-block;
        animation: slideIn 0.3s ease-in-out;
        word-wrap: normal;
        white-space: wrap;
        line-height: 1.4;
        transition: transform 0.3s, opacity 0.3s;
      }

      .message.user {
        margin-left: auto;
        text-align: center;
      }

      .message.assistant {
        margin-right: auto;
        text-align: center;
      }

      .dark .message.assistant {
        background-color: #374151;
        color: #ffffff;
      }

      .icon-button {
        background: none;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        transition: filter 0.3s;
      }

      .icon {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        transition: fill 0.3s;
      }

      .icon-button:hover .icon {
        transform: scale(1.1);
        transition: transform 0.3s;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .icon.animate-spin {
        animation: spin 1s linear infinite;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
      }

      .input-error {
        animation: shake 0.3s;
        border-color: #e3342f;
      }`
      ,
        unsafeCSS(styles)
    ]
      ;

    constructor() {
        super();
        this.endpoint = '';
        this.heading = 'AI Assistant';
        this.models = defaultModels;
        this.theme = 'dark';
        this.initialModel = 'gpt-4o';
        this.initialTemperature = 0.7;
        this.initialMaxTokens = 2048;
        this.initialTopP = 0.9;
        this.input = '';
        this.messages = [];
        this.isLoading = false;
        this.isChatOpen = false;
        this.isSettingsOpen = false;
        this.selectedModel = this.initialModel;
        this.temperature = this.initialTemperature;
        this.maxTokens = this.initialMaxTokens;
        this.topP = this.initialTopP;
        this.enableSettings = false;
        this.buttonLabels = { send: 'Send', close: 'Close', settings: 'Settings' };
        this.fontSize = 'text-base';
        this.showToolbar = true;
        this.initialPlaceholder = 'Type your message...';
        this.subsequentPlaceholder = 'Continue the conversation...';
        this.themeSliderValue = 0;
    }

    firstUpdated() {
        this.loadThemeFromLocalStorage();
        this.updateThemeColors();
        this.syncSettingsUI();
        this.scrollToBottom();
    }

    syncSettingsUI() {
        const modelSelect = this.shadowRoot.querySelector('#model-select');
        if (modelSelect) {
            modelSelect.value = this.initialModel;
        }

        const tempInput = this.shadowRoot.querySelector('#temperature');
        if (tempInput) {
            tempInput.value = this.initialTemperature;
        }

        const maxTokensInput = this.shadowRoot.querySelector('#max-tokens');
        if (maxTokensInput) {
            maxTokensInput.value = this.initialMaxTokens;
        }

        const topPInput = this.shadowRoot.querySelector('#top-p');
        if (topPInput) {
            topPInput.value = this.initialTopP;
        }
    }

    updateThemeColors() {
        const value = this.themeSliderValue;
        if (value <= 10) {
            this.style.setProperty('--bg-color', '#1a202c');
            this.style.setProperty('--text-color', '#ffffff');
            this.style.setProperty('--button-color', '#4a5568');
            this.style.setProperty('--input-bg', '#2d3748');
            this.style.setProperty('--input-text', '#e2e8f0');
            this.style.setProperty('--border-color', '#2d3748');
            this.style.setProperty('--icon-color', '#e2e8f0');
            this.style.setProperty('--header-bg', '#2d3748');
            this.style.setProperty('--header-text', '#ffffff');
            this.style.setProperty('--button-text', '#ffffff');
        } else if (value >= 90) {
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
            const progress = (value - 10) / 80;
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

    loadThemeFromLocalStorage() {
        const savedThemeValue = localStorage.getItem('chatbotThemeSliderValue');
        if (savedThemeValue) {
            this.themeSliderValue = parseInt(savedThemeValue, 10);
            this.updateThemeColors();
        }
    }

    saveThemeToLocalStorage() {
        localStorage.setItem('chatbotThemeSliderValue', this.themeSliderValue.toString());
    }

    handleThemeSliderChange(event) {
        this.themeSliderValue = parseInt(event.target.value, 10);
        this.updateThemeColors();
        this.saveThemeToLocalStorage();
    }

    render() {
        return html`
          ${this.isChatOpen ? this.renderChatContainer() : this.renderChatButton()}
        `;
    }

    renderChatButton() {
        return html`
          <button
            class="chat-button"
            @click=${() => this.isChatOpen = true}
            aria-label="Open Chat"
          >
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M9 17H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </button>
        `;
    }

    renderChatContainer() {
        return html`
          <div class="chat-container">
            <div class="chat-header">
              <span class="text-lg font-semibold ${this.fontSize}">${this.heading}</span>
              <div class="flex space-x-2">
                ${this.enableSettings ? html`
                  <button class="icon-button" @click=${() => this.isSettingsOpen = !this.isSettingsOpen} aria-label="Toggle Settings">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M19.14 12.936a7.031 7.031 0 010-1.872l2.037-1.486a.5.5 0 00.122-.617l-1.931-3.343a.5.5 0 00-.6-.22l-2.397.96a7.012 7.012 0 00-1.621-.94l-.36-2.548a.5.5 0 00-.492-.416h-3.862a.5.5 0 00-.492.416l-.36 2.548a7.012 7.012 0 00-1.621.94l-2.397-.96a.5.5 0 00-.6.22l-1.931 3.343a.5.5 0 00.122.617l2.037 1.486c-.056.299-.086.603-.086.911s.03.612.086.911l-2.037 1.486a.5.5 0 00-.122.617l1.931 3.343a.5.5 0 00.6.22l2.397-.96a7.012 7.012 0 001.621.94l.36 2.548a.5.5 0 00.492.416h3.862a.5.5 0 00.492-.416l.36-2.548a7.012 7.012 0 001.621-.94l2.397.96a.5.5 0 00.6-.22l1.931-3.343a.5.5 0 00-.122-.617l-2.037-1.486zM12 15.6a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2z"/>
                    </svg>
                  </button>
                ` : ''}
                <button class="icon-button" @click=${() => this.isChatOpen = false} aria-label="${this.buttonLabels.close}">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            ${this.showToolbar ? this.renderToolbar() : ''}
            ${this.isSettingsOpen && this.enableSettings ? this.renderSettings() : ''}
            <div class="message-container" id="message-container">
              ${this.messages.map((message, index) => this.renderMessage(message, index))}
            </div>
            <div class="chat-input-container">
              <input
                type="text"
                .value=${this.input}
                @input=${(e) => this.input = e.target.value}
                @keypress=${(e) => e.key === 'Enter' && this.handleSend()}
                class="chat-input"
                placeholder=${this.messages.length === 0 ? this.initialPlaceholder : this.subsequentPlaceholder}
                ?disabled=${this.isLoading}
                id="chat-input"
                aria-label="Message input"
              />
              <button
                @click=${this.handleSend}
                class="send-button"
                ?disabled=${this.isLoading}
                aria-label="${this.buttonLabels.send}"
              >
                ${this.isLoading
                ? html`<svg class="icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>`
                : html`<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M10.185 3L3 21h18L10.185 3z"/>
                      </svg>`}
              </button>
            </div>
          </div>
        `;
    }

    renderToolbar() {
        return html`
          <div class="p-2 flex justify-end space-x-2" style="background: var(--bg-color); border-bottom: 1px solid var(--border-color);">
            <button @click=${this.clearChat} class="icon-button" aria-label="Clear chat">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1 1 11h8l1-11 3-1v-1H3v1zm4 2h10v9H7V8zm4 0V5h2v3h-2z"/>
              </svg>
            </button>
          </div>
        `;
    }

    renderSettings() {
        return html`
          <div class="p-4 border-b" style="background: var(--bg-color); border-color: var(--border-color);">
            <div>
              <label for="model-select" class="block text-sm font-medium" style="color: var(--text-color);">Model</label>
              <select
                id="model-select"
                .value=${this.selectedModel}
                @change=${(e) => this.selectedModel = e.target.value}
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md"
                style="background: var(--input-bg); color: var(--input-text); border-color: var(--border-color);"
                aria-label="Model Selection"
              >
                ${this.models.map((model) => html`
                  <option value=${model} ?selected=${model === this.initialModel}>${model}</option>
                `)}
              </select>
            </div>
            <div>
              <label for="temperature" class="block text-sm font-medium" style="color: var(--text-color);">Temperature: ${this.temperature.toFixed(2)}</label>
              <input
                type="range"
                id="temperature"
                .value=${this.temperature}
                @input=${(e) => this.temperature = parseFloat(e.target.value)}
                min="0"
                max="2"
                step="0.1"
                class="mt-1 block w-full"
                aria-label="Temperature adjustment"
              />
            </div>
            <div>
              <label for="max-tokens" class="block text-sm font-medium" style="color: var(--text-color);">Max Tokens: ${this.maxTokens}</label>
              <input
                type="range"
                id="max-tokens"
                .value=${this.maxTokens}
                @input=${(e) => this.maxTokens = parseInt(e.target.value)}
                min="1"
                max="8192"
                class="mt-1 block w-full"
                aria-label="Max tokens adjustment"
              />
            </div>
            <div>
              <label for="top-p" class="block text-sm font-medium" style="color: var(--text-color);">Top P: ${this.topP.toFixed(2)}</label>
              <input
                type="range"
                id="top-p"
                .value=${this.topP}
                @input=${(e) => this.topP = parseFloat(e.target.value)}
                min="0"
                max="1"
                step="0.1"
                class="mt-1 block w-full"
                aria-label="Top P adjustment"
              />
            </div>
            <div class="mt-4">
              <h3 class="text-sm font-medium" style="color: var(--text-color);">Adjust Theme</h3>
              <input
                type="range"
                id="theme-slider"
                min="0"
                max="100"
                .value=${this.themeSliderValue}
                @input=${this.handleThemeSliderChange}
                class="mt-2 w-full"
                aria-label="Theme adjustment slider"
              />
            </div>
          </div>
        `;
    }

    renderMessage(message) {
        const containerClass = message.role === 'user' ? 'justify-end' : 'justify-start';
        const messageClass = message.role === 'user'
            ? `message user ${this.theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`
            : `message assistant ${this.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} ${this.theme === 'dark' ? 'text-white' : 'text-gray-800'}`;

        return html`
          <div class="flex ${containerClass} items-end space-x-2 w-full">
            <div class="flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-1 max-w-[80%]">
              <div class="${messageClass} px-3 py-2 rounded-lg shadow-sm">
                <div class="prose ${this.theme === 'dark' ? 'prose-invert' : ''} max-w-none">
                  ${unsafeHTML(marked(message.content))}
                </div>
              </div>
              <button
                @click=${() => this.copyToClipboard(message.content)}
                class="icon-button"
                aria-label="Copy message"
              >
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
          </div>
        `;
    }

    async handleSend() {
        if (this.input.trim() && !this.isLoading) {
            const userMessage = { role: 'user', content: this.input };
            this.messages = [...this.messages, userMessage];
            this.input = '';
            this.isLoading = true;

            try {
                const response = await fetch(this.endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: this.messages,
                        model: this.selectedModel,
                        temperature: this.temperature,
                        max_tokens: this.maxTokens,
                        top_p: this.topP,
                        stream: true,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let assistantMessage = { role: 'assistant', content: '' };
                this.messages = [...this.messages, assistantMessage];

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6).trim();
                            if (data === '[DONE]') {
                                this.isLoading = false;
                                this.focusInput();
                                this.scrollToBottom();
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
                }
            } catch (error) {
                console.error('Error sending message:', error);
                this.messages = [
                    ...this.messages,
                    { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }
                ];
                this.isLoading = false;
                this.focusInput();
            }
        }
    }

    clearChat() {
        this.messages = [];
        this.focusInput();
    }

    copyToClipboard(content) {
        navigator.clipboard.writeText(content).then(() => {
            this.showNotification('Copied to clipboard!');
        });
    }

    showNotification(message) {
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

    focusInput() {
        requestAnimationFrame(() => {
            const inputElement = this.shadowRoot?.querySelector('#chat-input');
            if (inputElement) {
                inputElement.focus();
            }
        });
    }

    scrollToBottom() {
        const chatContainer = this.shadowRoot?.querySelector('.message-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
}

customElements.define('chat-bot', ChatBot);
