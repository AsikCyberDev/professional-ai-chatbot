// src/components/ChatBotRenderer.js

import { html, unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@4.0.0/lib/marked.esm.js';

/**
 * Renders the chat button that toggles the chat window.
 */
export function renderChatButton() {
  return html`
    <button
      class="fixed bottom-4 right-4 chat-button text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      @click=${() => this.isChatOpen = true}
      aria-label="Open Chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </button>
  `;
}

/**
 * Renders the main chat container with messages and input.
 */
export function renderChatContainer() {
  return html`
    <div class="chat-container fixed bottom-4 right-4 text-white rounded-lg shadow-2xl w-96 max-h-[80vh] flex flex-col transition-all duration-300 ease-in-out transform ${this.isChatOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}">
      <div class="flex items-center justify-between header-bg p-4 rounded-t-lg">
        <span class="text-lg font-semibold ${this.fontSize}">${this.heading}</span>
        <div class="flex space-x-2">
          ${this.enableSettings ? html`
            <button class="icon-button text-white hover:text-gray-300 transition-colors duration-300" @click=${() => this.isSettingsOpen = !this.isSettingsOpen} aria-label="Toggle Settings">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          ` : ''}
          <button class="icon-button text-white hover:text-gray-300 transition-colors duration-300" @click=${() => this.isChatOpen = false} aria-label="${this.buttonLabels.close}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      ${this.showToolbar ? renderToolbar.call(this) : ''}
      ${this.isSettingsOpen && this.enableSettings ? renderSettings.call(this) : ''}
      <div class="message-container overflow-y-auto p-4 space-y-4" id="message-container">
        ${this.messages.map((message, index) => renderMessage.call(this, message, index))}
      </div>
      <div class="chat-input-container bg-input p-4 border-t border-border">
        <div class="flex items-center space-x-2">
          <input
            type="text"
            .value=${this.input}
            @input=${(e) => this.input = e.target.value}
            @keypress=${(e) => e.key === 'Enter' && this.handleSend()}
            class="chat-input flex-1 p-2 bg-input-bg text-input-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=${this.messages.length === 0 ? this.initialPlaceholder : this.subsequentPlaceholder}
            ?disabled=${this.isLoading}
            id="chat-input"
            aria-label="Message input"
          />
          <button
            @click=${this.handleSend}
            class="send-button p-2 bg-button text-button-text rounded-lg hover:bg-button-hover transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${this.isLoading ? 'opacity-50 cursor-not-allowed' : ''}"
            ?disabled=${this.isLoading}
            aria-label="${this.buttonLabels.send}"
          >
            ${this.isLoading
      ? html`<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>`
      : html`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                  </svg>`}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the toolbar with the clear chat option.
 */
export function renderToolbar() {
  return html`
    <div class="p-2 flex justify-end space-x-2 bg-toolbar">
      <button @click=${this.clearChat} class="icon-button text-xs text-toolbar-text hover:underline" aria-label="Clear chat">
        <!-- Clear Chat Icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M9 6v12a2 2 0 002 2h2a2 2 0 002-2V6M19 6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6" />
        </svg>
      </button>
    </div>
  `;
}

/**
 * Renders the settings panel with model, temperature, and other configurations.
 */
export function renderSettings() {
  return html`
    <div class="settings-container p-4 bg-settings-bg border-b border-border space-y-4">
      <div>
        <label for="model-select" class="block text-sm font-medium text-settings-text">Model</label>
        <select
          id="model-select"
          .value=${this.selectedModel}
          @change=${(e) => this.selectedModel = e.target.value}
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-input-bg text-input-text border border-input-border focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          aria-label="Model Selection"
        >
          ${this.models.map((model) => html`
            <option value=${model}>${model}</option>
          `)}
        </select>
      </div>
      <div>
        <label for="temperature" class="block text-sm font-medium text-settings-text">Temperature: ${this.temperature.toFixed(2)}</label>
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
        <label for="max-tokens" class="block text-sm font-medium text-settings-text">Max Tokens: ${this.maxTokens}</label>
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
        <label for="top-p" class="block text-sm font-medium text-settings-text">Top P: ${this.topP.toFixed(2)}</label>
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
    </div>
  `;
}

/**
 * Renders individual messages in the chat.
 */
export function renderMessage(message, index) {
  const containerClass = message.role === 'user' ? 'justify-end' : 'justify-start';
  const messageClass = message.role === 'user'
    ? `user-message px-4 py-2 rounded-lg shadow ${this.fontSize}`
    : `bot-message px-4 py-2 rounded-lg shadow ${this.fontSize}`;

  return html`
    <div class="flex ${containerClass} items-end space-x-2">
      <div class="flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-1 max-w-[75%]">
        <div class="${messageClass}">
          <div class="prose ${this.theme === 'dark' ? 'prose-invert' : ''} max-w-none">
            ${unsafeHTML(marked(message.content))}
          </div>
        </div>
        <button
          @click=${() => this.copyToClipboard(message.content)}
          class="icon-button text-xs text-icon-color transition-colors duration-300"
          aria-label="Copy message"
        >
          <!-- Copy Icon SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  `;
}
