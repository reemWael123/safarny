import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripSearchService } from 'src/app/services/trip-search.service';

interface Trip {
  tripId: number;
  cityName: string;
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

  removeTrip(tripId: number): void {
    this.isLoading = true;

    this.tripService.deleteTrip(tripId.toString()).subscribe({
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
}
