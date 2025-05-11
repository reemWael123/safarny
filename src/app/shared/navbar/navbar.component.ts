import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatbotComponent } from 'src/app/dashboard/components/chatbot/chatbot.component';
import { ProfileComponent } from 'src/app/dashboard/components/profile/profile.component';

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
  openProfile() {
    this.dialog.open(ProfileComponent, {
       width: 'auto',
    height: 'auto',
    panelClass: 'custom-dialog-container', // تحديد الارتفاع
      data: {} // لو عايزة تبعثي بيانات للكومبوننت ده
    });
  }
}
