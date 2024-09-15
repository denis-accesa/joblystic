# Configuration

1. Install [ollama](https://ollama.com/)
2. Configure [models directory](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server) using `OLLAMA_MODELS` environment variable
3. [Download models](https://ollama.com/library)
4. Run using JS

```js
const ollama = new Ollama();
const response = await ollama.chat({});
```
