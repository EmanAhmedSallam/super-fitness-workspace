import {  Service } from '@angular/core';

@Service()
export class AiService {

  
   private history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
     async ask(text: string): Promise<string> {
    this.history.push({
      role: 'user',
      parts: [{ text }],
    });

    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: this.history,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'AI request failed');
    }

    const replyText = data.candidates[0].content.parts[0].text;

    this.history.push({
      role: 'model',
      parts: [{ text: replyText }],
    });

    return replyText;
  }


    clearHistory() {
        this.history = [];
    }
}
