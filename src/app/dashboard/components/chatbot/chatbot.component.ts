import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  userInput: string = '';
  messages: { sender: string, text: string }[] = [];

  constructor(
    
     private _generalservice: GeneralService
   ) { }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const question = this.userInput;
    this.messages.push({ sender: 'user', text: question });
    this.userInput = '';

    const body = { question: question }


    this._generalservice.chatbot(body).subscribe({
      next: (response) => {
        const botReply = response.answer || 'لم أفهم، حاول مرة أخرى.';
        this.messages.push({ sender: 'bot', text: botReply });
        console.log(response);
      },
      error: (err) => {
        console.error("Error:", err);
        this.messages.push({ sender: 'bot', text: 'حصل خطأ أثناء الإرسال.' });
      }
    });
  }
}
