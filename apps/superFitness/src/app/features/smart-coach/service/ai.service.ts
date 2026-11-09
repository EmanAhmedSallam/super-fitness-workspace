import { inject, Service } from '@angular/core';
import { GEMINI_API_KEY } from './gemini-api-key.token';

@Service()
export class AiService {
  private readonly geminiApiKey = inject(GEMINI_API_KEY);
   private history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    async ask(text: string): Promise<string> {
        this.history.push({
            role: 'user',
            parts: [{ text }]
        });
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${this.geminiApiKey}`,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    contents: this.history,
                }),
            }
        );
        const data = await res.json();
        const replyText = data.candidates[0].content.parts[0].text;
        this.history.push({
            role: 'model',
            parts: [{ text: replyText }]
        });

        return replyText;
    }

    clearHistory() {
        this.history = [];
    }
}
