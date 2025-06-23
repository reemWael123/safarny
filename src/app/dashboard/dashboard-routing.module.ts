import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { EgyptPageComponent } from './components/categories-pages/egypt-page/egypt-page.component';
import { BeachesPageComponent } from './components/categories-pages/beaches-page/beaches-page.component';
import { CitiesPageComponent } from './components/categories-pages/cities-page/cities-page.component';
import { SportsPageComponent } from './components/categories-pages/sports-page/sports-page.component';
import { TripSearchComponent } from './components/trip-search/trip-search.component';
import { PlacesResturantsHotelsComponent } from './components/places-resturants-hotels/places-resturants-hotels.component';
import { DetailsComponent } from './components/details/details.component';
import { PackegesComponent } from './components/packeges/packeges.component';
import { PackegedetailesComponent } from './components/packegedetailes/packegedetailes.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

import { ViewTripsComponent } from './components/view-trips/view-trips.component';
import { HotelRoomsComponent } from './components/hotel-rooms/hotel-rooms.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { HotelDetailsComponent } from './components/hotel-details/hotel-details.component';
import { TripSummaryComponent } from './components/trip-summary/trip-summary.component';
import { HotelsListComponent } from './components/hotels-list/hotels-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', component: HomeComponent },
      { path: 'home/ancient-egypt', component: EgyptPageComponent },
      { path: 'home/beaches', component: BeachesPageComponent },
      { path: 'home/cities', component: CitiesPageComponent },
      { path: 'home/PRH/:id', component: PlacesResturantsHotelsComponent },
      { path: 'home/hotel-rooms/:hotelId', component: HotelRoomsComponent },
      { path: 'home/hotel-details/:hotelId', component: HotelDetailsComponent },

      { path: 'home/hotels-list', component: HotelsListComponent },
      {
        path: 'home/booking-confirmation/:bookingId',
        component: BookingConfirmationComponent,
      },
      {
        path: 'home/payment-success/:hotelId',
        component: PaymentSuccessComponent,
      },
      { path: 'home/outdoor-sports', component: SportsPageComponent },
      { path: 'home/trip-search', component: TripSearchComponent },
      { path: 'home/view-trips/:userid', component: ViewTripsComponent },
      { path: 'home/trip-summary', component: TripSummaryComponent },

      { path: 'home/details/:id', component: DetailsComponent },
      { path: 'home/packeges', component: PackegesComponent },
      { path: 'home/packegesdetails/:id', component: PackegedetailesComponent },
    ],
  },
  // ✅ يجب أن يكون خارج `children`
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
