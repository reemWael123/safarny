import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SearchHomeComponent } from './components/search-home/search-home.component';
import { HomeComponent } from './components/home/home.component';
import { HeroComponent } from './components/hero/hero.component';
import { EgyptPageComponent } from './components/categories-pages/egypt-page/egypt-page.component';
import { BeachesPageComponent } from './components/categories-pages/beaches-page/beaches-page.component';
import { CategPageComponent } from './components/categories-pages/categ-page/categ-page.component';
import { CitiesPageComponent } from './components/categories-pages/cities-page/cities-page.component';
import { SportsPageComponent } from './components/categories-pages/sports-page/sports-page.component';
import { RouterLink, RouterModule } from '@angular/router';
import { PlacesResturantsHotelsComponent } from './components/places-resturants-hotels/places-resturants-hotels.component';
import { DetailsComponent } from './components/details/details.component';
import { PackegesComponent } from './components/packeges/packeges.component';
import { PackegedetailesComponent } from './components/packegedetailes/packegedetailes.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { StteperComponent } from './components/stteper/stteper.component';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TripSearchComponent } from './components/trip-search/trip-search.component';
import { ViewTripsComponent } from './components/view-trips/view-trips.component';
import { HotelRoomsComponent } from './components/hotel-rooms/hotel-rooms.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    DashboardComponent,
    SearchHomeComponent,
    HomeComponent,
    HeroComponent,
    EgyptPageComponent,
    BeachesPageComponent,
    CategPageComponent,
    CitiesPageComponent,
    SportsPageComponent,
    PlacesResturantsHotelsComponent,
    DetailsComponent,
    PackegesComponent,
    PackegedetailesComponent,
    WelcomeComponent,
    StteperComponent,
    TripSearchComponent,
    ViewTripsComponent,
    HotelRoomsComponent,
    BookingModalComponent,
    ChatbotComponent,
  ],
  imports: [
   
    CommonModule,
    RouterLink,
    RouterModule,
    DashboardRoutingModule,
    SharedModule,
    MatExpansionModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    
  ],
})
export class DashboardModule {}
