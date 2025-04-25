import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripSearchService } from 'src/app/services/trip-search.service';

interface Trip {
  tripId: number;
  cityName: string;
  cityId: number; // Added cityId
  touristPlaces: {
    id: number;
    name: string;
    description: string;
    pictureUrl: string;
    cityId: number;
    category: string;
    tripPlaces: any[];
    price: number;
  }[];
  hotel: {
    id: number;
    name: string;
    rate: number;
    address: string;
    overview: string;
    startPrice: number;
    pictureUrls: string[];
    pictureUrl: string;
    cityId: number;
  };
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-view-trips',
  templateUrl: './view-trips.component.html',
  styleUrls: ['./view-trips.component.scss'],
})
export class ViewTripsComponent implements OnInit {
  userId: string = '';
  trips: Trip[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  bookingInProgress: boolean = false;
  bookingSuccess: string | null = null;

  constructor(
    private tripService: TripSearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userid') || 'user123'; // Default fallback
      this.loadTrips();
    });
  }

  loadTrips(): void {
    this.isLoading = true;
    this.error = null;

    this.tripService.getUserTrips(this.userId).subscribe({
      next: (trips) => {
        this.trips = trips;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trips:', err);
        this.error = 'Failed to load trips. Please try again.';
        this.isLoading = false;
      },
    });
  }

  removeCartItem(tripId: number): void {
    this.isLoading = true;

    this.tripService.deleteCartItem(tripId.toString()).subscribe({
      next: () => {
        // Remove from local array
        this.trips = this.trips.filter((trip) => trip.tripId !== tripId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error removing trip:', err);
        this.error = 'Failed to remove trip. Please try again.';
        this.isLoading = false;
      },
    });
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  // Calculate total price of a trip
  calculateTripTotal(trip: Trip): number {
    // Sum of all tourist place prices plus hotel price
    const placesTotal = trip.touristPlaces.reduce(
      (sum, place) => sum + place.price,
      0
    );
    const hotelPrice = trip.hotel?.startPrice || 0;

    return placesTotal + hotelPrice;
  }

  // Book a trip
  bookTrip(trip: Trip): void {
    let tripId = trip.tripId;
    this.bookingInProgress = true;
    this.bookingSuccess = null;
    this.error = null;

    // Create the booking data object
    const bookingData = {
      userId: this.userId,
      cityId:
        trip.cityId ||
        (trip.touristPlaces.length > 0 ? trip.touristPlaces[0].cityId : 0),
      hotelId: trip.hotel ? trip.hotel.id : 0,
      startDate: trip.startDate,
      endDate: trip.endDate,
      rate: trip.hotel ? trip.hotel.rate : 0,
    };

    this.tripService.finalizeTrip(bookingData).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.bookingSuccess = `Your trip to ${trip.cityName} has been successfully booked!`;
        this.bookingInProgress = false;

        // Remove the booked trip from cart
        // this.removeCartItem(tripId);
        this.loadTrips();
      },
      error: (err) => {
        console.error('Error booking trip:', err);
        this.error = 'Failed to book trip. Please try again.';
        this.bookingInProgress = false;
      },
    });
  }
}
