import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatbotComponent } from 'src/app/dashboard/components/chatbot/chatbot.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  authClicked = false;

  onClickAuth() {
    this.authClicked = !this.authClicked;
  }
  showChatbot: boolean = false;

  constructor(public dialog: MatDialog) {}

  openChatbot() {
    this.dialog.open(ChatbotComponent, {
      width: '400px', // تحديد العرض زي ما تحبي
      height: '600px', // تحديد الارتفاع
      data: {} // لو عايزة تبعثي بيانات للكومبوننت ده
    });
  }
}
