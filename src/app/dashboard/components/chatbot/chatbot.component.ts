import {
  Component,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { GeneralService } from '../services/general.service';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  safeHtml?: SafeHtml; // For rendered markdown
  isEnglish?: boolean; // To determine text direction
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements AfterViewChecked {
  userInput: string = '';
  messages: Message[] = [];
  isLoading: boolean = false;
  @ViewChild('messages') messagesContainer!: ElementRef;

  constructor(
    private _generalService: GeneralService,
    private sanitizer: DomSanitizer
  ) {}

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const question = this.userInput;
    this.messages.push({
      sender: 'user',
      text: question,
      isEnglish: this.isEnglishText(question),
    });
    this.userInput = '';
    this.isLoading = true;

    this._generalService.chatbot(question).subscribe({
      next: (response) => {
        const botReply = response.answer || 'لم أفهم، حاول مرة أخرى.';
        const isEnglish = this.isEnglishText(botReply);
        let html: string;
        try {
          html = marked.parse(botReply) as string; // Convert markdown to HTML
        } catch (e) {
          console.error('Markdown parsing error:', e);
          html = botReply; // Fallback to plain text
        }
        const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html); // Sanitize
        this.messages.push({
          sender: 'bot',
          text: botReply,
          safeHtml,
          isEnglish,
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.messages.push({
          sender: 'bot',
          text: 'حصل خطأ أثناء الإرسال.',
          isEnglish: false,
        });
        this.isLoading = false;
      },
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  private isEnglishText(text: string): boolean {
    // Simple heuristic: check if text contains Arabic characters
    const arabicRegex = /[\u0600-\u06FF]/;
    return !arabicRegex.test(text);
  }
}
