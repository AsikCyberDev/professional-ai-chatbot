// src/components/ChatBotStyles.js

export const chatBotStyles = `
  :host {
    --bg-color: var(--bg-color, #1f2937);
    --text-color: var(--text-color, #ffffff);
    --button-color: var(--button-color, #3b82f6);
    --input-bg: var(--input-bg, #2d3748);
    --input-text: var(--input-text, #e2e8f0);
    --border-color: var(--border-color, #2d3748);
    --icon-color: var(--icon-color, #e2e8f0);
    --header-bg: var(--header-bg, #2d3748);
    --header-text: var(--header-text, #ffffff);
    --button-text: var(--button-text, #ffffff);
    --button-hover: var(--button-hover, #2563eb);
    --settings-bg: var(--settings-bg, #2d3748);
    --toolbar-bg: var(--toolbar-bg, #1f2937);
    --toolbar-text: var(--toolbar-text, #9ca3af);
    --user-message-bg: var(--user-message-bg, #3b82f6);
    --bot-message-bg: var(--bot-message-bg, #4b5563);
  }

  .chat-button {
    position: fixed;
    bottom: 16px;
    right: 16px;
    background-color: var(--button-color);
    color: var(--button-text);
    border-radius: 50%;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
  }

  .chat-button:hover {
    background-color: var(--button-hover);
  }

  .chat-container {
    position: fixed;
    bottom: 16px;
    right: 16px;
    width: 384px; /* w-96 */
    max-height: 80vh;
    background-color: var(--bg-color);
    color: var(--text-color);
    border-radius: 12px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
  }

  .header-bg {
    background-color: var(--header-bg);
    color: var(--header-text);
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
  }

  .message-container {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .chat-input-container {
    background-color: var(--input-bg);
    border-top: 1px solid var(--border-color);
    padding: 16px;
    display: flex;
    gap: 8px;
  }

  .chat-input {
    flex: 1;
    padding: 8px 12px;
    background-color: var(--input-bg);
    color: var(--input-text);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
  }

  .chat-input:focus {
    border-color: var(--button-color);
  }

  .send-button {
    background-color: var(--button-color);
    color: var(--button-text);
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
  }

  .send-button:hover {
    background-color: var(--button-hover);
  }

  .settings-container {
    background-color: var(--settings-bg);
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .toolbar {
    background-color: var(--toolbar-bg);
    padding: 8px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .toolbar button {
    background: none;
    border: none;
    color: var(--toolbar-text);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.3s ease;
  }

  .toolbar button:hover {
    color: var(--button-hover);
  }

  .user-message {
    align-self: flex-end;
    background-color: var(--user-message-bg);
    color: var(--text-color);
    padding: 8px 12px;
    border-radius: 8px;
    max-width: 75%;
    word-wrap: break-word;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin: 2px 0;
  }

  .bot-message {
    align-self: flex-start;
    background-color: var(--bot-message-bg);
    color: var(--text-color);
    padding: 8px 12px;
    border-radius: 8px;
    max-width: 75%;
    word-wrap: break-word;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin: 2px 0;
  }

  .icon-button {
    background: none;
    border: none;
    color: var(--icon-color);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.3s ease;
  }

  .icon-button:hover {
    color: var(--button-hover);
  }

  .settings-bg {
    background-color: var(--settings-bg);
    color: var(--text-color);
  }

  .bg-input {
    background-color: var(--input-bg);
  }

  .bg-toolbar {
    background-color: var(--toolbar-bg);
    color: var(--toolbar-text);
  }

  .text-toolbar-text {
    color: var(--toolbar-text);
  }

  .text-icon-color {
    color: var(--icon-color);
  }

  .text-input-text {
    color: var(--input-text);
  }

  .border-border {
    border-color: var(--border-color);
  }

  .bg-button {
    background-color: var(--button-color);
  }

  .text-button-text {
    color: var(--button-text);
  }
`;
