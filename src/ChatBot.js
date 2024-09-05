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
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

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
    this.enableSettings = false; // Settings disabled by default
  }

  render() {
    if (!this.isChatOpen) {
      return html`
        <button
          class="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          @click=${() => this.isChatOpen = true}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      `;
    }

    return html`
      <div class="fixed bottom-4 right-4 ${this.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} text-white rounded-lg shadow-2xl w-96 max-h-[80vh] flex flex-col transition-all duration-300 ease-in-out transform ${this.isChatOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}">
        <div class="flex items-center justify-between ${this.theme === 'dark' ? 'bg-gray-700' : 'bg-blue-600'} p-4 rounded-t-lg">
          <span class="text-lg font-semibold">${this.heading}</span>
          <div class="flex space-x-2">
            ${this.enableSettings ? html`
              <button class="text-white hover:text-gray-300 transition-colors duration-300" @click=${() => this.isSettingsOpen = !this.isSettingsOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            ` : ''}
            <button class="text-white hover:text-gray-300 transition-colors duration-300" @click=${() => this.isChatOpen = false}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        ${this.isSettingsOpen && this.enableSettings ? this.renderSettings() : ''}
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          ${this.messages.map((message, index) => this.renderMessage(message, index))}
        </div>
        <div class="p-4 ${this.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} border-t ${this.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}">
          <div class="flex items-center space-x-2">
            <input
              type="text"
              .value=${this.input}
              @input=${(e) => this.input = e.target.value}
              @keypress=${(e) => e.key === 'Enter' && this.handleSend()}
              class="flex-1 p-2 ${this.theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              ?disabled=${this.isLoading}
              id="chat-input"
            />
            <button
              @click=${this.handleSend}
              class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${this.isLoading ? 'opacity-50 cursor-not-allowed' : ''}"
              ?disabled=${this.isLoading}
            >
              ${this.isLoading
        ? html`<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>`
        : html`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                  </svg>`
      }
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderSettings() {
    return html`
      <div class="p-4 ${this.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} border-b ${this.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} space-y-4">
        <div>
          <label for="model-select" class="block text-sm font-medium ${this.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}">Model</label>
          <select
            id="model-select"
            .value=${this.selectedModel}
            @change=${(e) => this.selectedModel = e.target.value}
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base ${this.theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${this.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            ${this.models.map((model) => html`
              <option value=${model}>${model}</option>
            `)}
          </select>
        </div>
        <div>
          <label for="temperature" class="block text-sm font-medium ${this.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}">Temperature: ${this.temperature.toFixed(2)}</label>
          <input
            type="range"
            id="temperature"
            .value=${this.temperature}
            @input=${(e) => this.temperature = parseFloat(e.target.value)}
            min="0"
            max="2"
            step="0.1"
            class="mt-1 block w-full"
          />
        </div>
        <div>
          <label for="max-tokens" class="block text-sm font-medium ${this.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}">Max Tokens: ${this.maxTokens}</label>
          <input
            type="range"
            id="max-tokens"
            .value=${this.maxTokens}
            @input=${(e) => this.maxTokens = parseInt(e.target.value)}
            min="1"
            max="8192"
            class="mt-1 block w-full"
          />
        </div>
        <div>
          <label for="top-p" class="block text-sm font-medium ${this.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}">Top P: ${this.topP.toFixed(2)}</label>
          <input
            type="range"
            id="top-p"
            .value=${this.topP}
            @input=${(e) => this.topP = parseFloat(e.target.value)}
            min="0"
            max="1"
            step="0.1"
            class="mt-1 block w-full"
          />
        </div>
      </div>
    `;
  }

  renderMessage(message) {
    const containerClass = message.role === 'user' ? 'justify-end' : 'justify-start';
    const messageClass = message.role === 'user'
      ? `${this.theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`
      : `${this.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} ${this.theme === 'dark' ? 'text-white' : 'text-gray-800'}`;

    return html`
      <div class="flex ${containerClass} items-end space-x-2">
        <div class="flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-1 max-w-[75%]">
          <div class="${messageClass} px-4 py-2 rounded-lg shadow">
            <div class="prose ${this.theme === 'dark' ? 'prose-invert' : ''} max-w-none">
             ${unsafeHTML(marked(message.content))}
            </div>
          </div>
          <button
            @click=${() => this.copyToClipboard(message.content)}
            class="text-xs ${this.theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'} transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
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
                this.focusInput(); // Focus the input field after AI response
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed?.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage.content += content;
                  this.messages = [...this.messages.slice(0, -1), { ...assistantMessage }];
                  this.requestUpdate();
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
        this.focusInput(); // Focus the input field after error
      }
    }
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

  updated(changedProperties) {
    if (changedProperties.has('messages')) {
      requestAnimationFrame(() => this.scrollToBottom());
    }
  }

  scrollToBottom() {
    const chatContainer = this.shadowRoot?.querySelector('.overflow-y-auto');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
}

customElements.define('chat-bot', ChatBot);