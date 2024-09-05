# Professional AI Chatbot

A customizable, professional-looking AI chatbot web component.

## Installation

```bash
npm install professional-ai-chatbot
```

## Usage

```html
<script type="module">
  import 'professional-ai-chatbot';
</script>

<chat-bot
  endpoint="https://your-api-endpoint.com"
  heading="AI Assistant"
  theme="dark"
  initial-model="gpt-4o"
  initial-temperature="0.7"
  initial-max-tokens="2048"
  initial-top-p="0.9"
></chat-bot>
```

## Attributes

- `endpoint`: API endpoint for the chatbot (required)
- `heading`: Chat window heading (default: "AI Assistant")
- `theme`: Color theme, "light" or "dark" (default: "dark")
- `initial-model`: Initial AI model to use (default: "gpt-4o")
- `initial-temperature`: Initial temperature setting (default: 0.7)
- `initial-max-tokens`: Initial max tokens setting (default: 2048)
- `initial-top-p`: Initial top-p setting (default: 0.9)

## License

MIT