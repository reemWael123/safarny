import { ChatbotComponent } from './../dashboard/components/chatbot/chatbot.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [SharedComponent, NavbarComponent, FooterComponent,    ChatbotComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CalendarModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatRadioModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatRadioModule,
   ChatbotComponent
  ],
})
export class SharedModule {}
