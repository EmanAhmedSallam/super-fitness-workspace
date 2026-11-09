import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AiService } from './service/ai.service';
interface Message {
  sender: 'bot' | 'user';
  text: string;
  /** Translation key for app-generated messages; takes precedence over `text` when rendering */
  i18nKey?: string;
  avatar?: string;
}
interface PreviousChat {
  sender: 'bot' | 'user';
  text: string;
}
@Component({
  imports: [CommonModule, TranslatePipe],
  selector: 'app-smart-coach',
  templateUrl: './smart-coach.html',
})
export class SmartCoach {
  private aiService = inject(AiService);

  isOpen = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  messages = signal<Message[]>([
    { sender: 'bot', text: '', i18nKey: 'chat.greeting' },
  ]);

  previousChats = signal<PreviousChat[]>([]);

  async sendMessage(input: HTMLInputElement) {
    const text = input.value.trim();
    if (!text || this.isLoading()) return;
    input.value = '';
    this.previousChats.update((chats) => [...chats, { sender: 'user', text }]);
    this.messages.update(m => [...m, { sender: 'user', text }]);
    this.isLoading.set(true);

    try {
      const reply = await this.aiService.ask(text);
      this.messages.update(m => [...m, { sender: 'bot', text: reply }]);
      this.previousChats.update((chats) => [...chats, { sender: 'bot', text: reply }]);
    } catch {
      this.messages.update(m => [
        ...m,
        { sender: 'bot', text: '', i18nKey: 'chat.error' },
      ]);
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleChat() {
    this.isOpen.update(value => !value);
    if (!this.isOpen()) {
      this.isMenuOpen.set(false);
    }
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }
}
