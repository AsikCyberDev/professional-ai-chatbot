import { css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';


export const stylesJS = css`
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
      --accent-color: #3b82f6;
      --shadow-color: rgba(0, 0, 0, 0.15);
    }

    .chat-container {
      background: var(--bg-color);
      color: var(--text-color);
      border-radius: 8px;
      box-shadow: 0 8px 16px var(--shadow-color);
      width: 384px;
      height: 600px;
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border-color);
      overflow: hidden;
      animation: fadeIn 0.3s ease-in-out, slideUp 0.4s ease-out;
      resize: both;
      min-width: 384px;
      min-height: 600px;
      transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    }

    .chat-container.hide {
      transform: translateY(20px);
      opacity: 0;
    }

    .chat-button {
      background-color: var(--button-color);
      color: var(--button-text);
      border-radius: 50%;
      padding: 1rem;
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      box-shadow: 0 4px 6px var(--shadow-color);
      cursor: pointer;
      border: none;
      transition: background-color 0.3s, transform 0.3s, opacity 0.3s;
      animation: popIn 0.4s ease-out;
    }

    .chat-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 12px var(--shadow-color);
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
      cursor: move;
      animation: fadeIn 0.3s ease-in-out;
      box-shadow: 0 2px 4px var(--shadow-color);
    }

    .chat-input-container {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border-top: 1px solid var(--border-color);
      background: var(--input-bg);
      animation: slideInBottom 0.3s ease-out;
      box-shadow: 0 -2px 4px var(--shadow-color);
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
      transition: box-shadow 0.3s ease;
    }

    .chat-input:focus {
      box-shadow: 0 0 8px var(--accent-color);
    }

    .send-button {
      background-color: var(--accent-color);
      color: var(--button-text);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.3s, opacity 0.3s;
      animation: slideInBottom 0.3s ease-out;
      box-shadow: 0 2px 4px var(--shadow-color);
    }

    .send-button:hover {
      transform: scale(1.1);
    }

    .message-container {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 1rem;
      background: var(--bg-color);
      scroll-behavior: smooth;
      max-height: calc(80vh - 8rem);
      animation: fadeIn 0.3s ease-in-out;
      box-shadow: inset 0 4px 8px var(--shadow-color);
    }

    .message {
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      display: inline-block;
      animation: fadeIn 0.3s ease-in-out, slideIn 0.3s ease-out;
      word-wrap: break-word;
      line-height: 1.4;
      transition: transform 0.3s, opacity 0.3s;
      box-shadow: 0 2px 4px var(--shadow-color);
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
      transition: transform 0.3s, opacity 0.3s;
      animation: fadeIn 0.3s ease-out;
    }

    .icon {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      transition: transform 0.3s, fill 0.3s;
    }

    .icon-button:hover .icon {
      transform: scale(1.2);
      transition: transform 0.3s;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateX(-20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideInBottom {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes popIn {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .settings-container {
      border-radius: 8px;
      box-shadow: 0 2px 4px var(--shadow-color);
      animation: fadeIn 0.3s ease-out, slideIn 0.3s ease-out;
    }

    .setting-item {
      transition: background-color 0.3s, border-color 0.3s;
      animation: slideIn 0.3s ease-out;
    }

    .setting-item:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `;