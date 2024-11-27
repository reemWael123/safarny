import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    SharedComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent
  ]
})
export class SharedModule { }
