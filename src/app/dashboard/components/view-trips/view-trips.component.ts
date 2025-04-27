import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripSearchService } from 'src/app/services/trip-search.service';
import { forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';

interface Trip {
  cityName: string;
  places: { placeId: number; placeName: string; pictureUrl?: string }[];
  hotels: {
    hotelId: number;
    hotelName: string;
    rating: number;
    pricePerNight: number;
    selected?: boolean;
  }[];
  days?: number; // Add days property
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
  successMessage: string | null = null;
  cities: { id: number; name: string }[] = [];
  tripDays: {
    cityId: number;
    cityName: string;
    numberOfPlaces: number;
    days: number;
  }[] = [];
  hotelLoading: Set<number> = new Set();

  startDate: string = new Date().toISOString().split('T')[0]; // Default to today
  isAnalyzing: boolean = false; // Track API loading state

  constructor(
    private tripService: TripSearchService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId =
        params.get('userid') || 'bc616ee1-3aca-42fe-83fc-c43fde2cf740';
      this.loadCitiesAndTrips();
    });
  }

  // Update loadCitiesAndTrips
  loadCitiesAndTrips(): void {
    this.isLoading = true;
    this.error = null;

    this.tripService.getCities().subscribe({
      next: (cities) => {
        console.log('Cities:', cities);
        this.cities = cities;
        // Fetch trip days
        this.tripService.getTripDays(this.userId).subscribe({
          next: (tripDays) => {
            console.log('Trip Days:', tripDays);
            this.tripDays = tripDays;
            this.loadTrips();
          },
          error: (err) => {
            console.error('Error loading trip days:', err);
            this.error = 'Failed to load trip days, but trips may still load.';
            this.loadTrips();
          },
        });
      },
      error: (err) => {
        console.error('Error loading cities:', err);
        this.error = 'Failed to load cities. Please try again.';
        this.isLoading = false;
      },
    });
  }

  loadTrips(): void {
    this.tripService.getUserTrips(this.userId).subscribe({
      next: (trips) => {
        console.log('Trips:', trips);
        const dedupedTrips = trips.map((trip) => ({
          ...trip,
          places: [...new Map(trip.places.map((p) => [p.placeId, p])).values()],
          hotels: trip.hotels.map((hotel) => ({ ...hotel, selected: false })),
          days:
            this.tripDays.find(
              (td) => td.cityName.toLowerCase() === trip.cityName.toLowerCase()
            )?.days || 0,
        }));

        const placeRequests = dedupedTrips.map((trip) => {
          const city = this.cities.find(
            (c) => c.name.toLowerCase() === trip.cityName.toLowerCase()
          );
          if (!city) {
            console.warn(
              `City not found for ${trip.cityName}, using placeholder`
            );
            return of([]);
          }
          console.log(`Fetching places for cityId: ${city.id}`);
          return this.tripService.getPlaces(city.id);
        });

        forkJoin(placeRequests).subscribe({
          next: (allPlacesByCity) => {
            this.trips = dedupedTrips.map((trip, index) => ({
              ...trip,
              places: trip.places.map((place) => ({
                ...place,
                pictureUrl: allPlacesByCity[index].find(
                  (p) => p.id === place.placeId
                )?.pictureUrl
                  ? `${
                      allPlacesByCity[index].find((p) => p.id === place.placeId)
                        ?.pictureUrl
                    }`
                  : 'https://via.placeholder.com/150',
              })),
            }));
            console.log('Mapped Trips with Images:', this.trips);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading place details:', err);
            this.error =
              'Failed to load place images. Displaying trips with placeholders.';
            this.trips = dedupedTrips.map((trip) => ({
              ...trip,
              places: trip.places.map((place) => ({
                ...place,
                pictureUrl: 'assets/images/trips.jpg',
              })),
            }));
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        console.error('Error loading trips:', err);
        this.error = 'Failed to load trips. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleHotelSelection(trip: Trip, hotel: Trip['hotels'][0]): void {
    console.log(
      'Toggle hotel:',
      hotel.hotelId,
      'Current state:',
      hotel.selected
    );
    const previousState = hotel.selected;
    this.hotelLoading.add(hotel.hotelId);
    this.cdr.detectChanges();

    // Deselect all other hotels in this trip
    trip.hotels.forEach((h) => (h.selected = false));
    hotel.selected = !previousState; // Toggle the selected hotel

    const city = this.cities.find(
      (c) => c.name.toLowerCase() === trip.cityName.toLowerCase()
    );
    if (!city) {
      console.error('City not found for:', trip.cityName);
      this.error = 'Failed to select hotel. City not found.';
      hotel.selected = false;
      this.hotelLoading.delete(hotel.hotelId);
      trip.hotels.forEach((h) => (h.selected = false)); // Reset on error
      this.cdr.detectChanges();
      return;
    }

    // Send only the selected hotel (or none if deselected)
    const payload = hotel.selected
      ? [{ userId: this.userId, cityId: city.id, hotelId: hotel.hotelId }]
      : [];

    console.log('Hotel Selection Payload:', payload);
    this.tripService.chooseHotels(payload).subscribe({
      next: (response) => {
        console.log('Hotel selected:', response);
        this.successMessage = 'Hotel selection updated successfully!';
        this.hotelLoading.delete(hotel.hotelId);
        setTimeout(() => (this.successMessage = null), 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error selecting hotel:', err);
        this.error = 'Failed to select hotel. Please try again.';
        hotel.selected = false;
        this.hotelLoading.delete(hotel.hotelId);
        trip.hotels.forEach((h) => (h.selected = false)); // Reset on error
        setTimeout(() => (this.error = null), 3000);
        this.cdr.detectChanges();
      },
    });
  }

  calculateTripTotal(trip: Trip): number {
    const selectedHotel = trip.hotels.find((hotel) => hotel.selected);
    return selectedHotel ? selectedHotel.pricePerNight : 0;
  }

  // Add methods for total calculations
  calculateTotalDays(): number {
    return this.trips.reduce((sum, trip) => sum + (trip.days || 0), 0);
  }

  calculateTotalPrice(): number {
    return this.trips.reduce(
      (sum, trip) => sum + this.calculateTripTotal(trip),
      0
    );
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/trips.jpg'; // Use public placeholder for reliability
    console.warn('Image failed to load, using placeholder:', img.src);
  }

  getSelectedHotelName(trip: any): string {
    const selectedHotel = trip.hotels?.find((h: any) => h.selected);
    return selectedHotel ? selectedHotel.hotelName : 'None';
  }

  getSelectedHotelsCount(trip: Trip): number {
    return trip.hotels.some((hotel) => hotel.selected) ? 1 : 0;
  }

  // Add analyzeTrip method
  analyzeTrip(): void {
    if (!this.startDate) {
      this.error = 'Please select a start date.';
      setTimeout(() => (this.error = null), 3000);
      return;
    }

    this.isAnalyzing = true;
    this.error = null;
    this.successMessage = null;

    const payload = {
      userId: this.userId,
      startDate: new Date(this.startDate).toISOString(),
    };

    console.log('Analyze Trip Payload:', payload);
    this.tripService.analyzeTrip(payload).subscribe({
      next: (response) => {
        console.log('Trip analysis response:', response);
        this.successMessage =
          'Trip analysis completed! Redirecting to summary...';
        this.isAnalyzing = false;
        setTimeout(() => {
          this.successMessage = null;
          // Navigate to trip-summary with query params
          this.router.navigate(['../../trip-summary'], {
            queryParams: { userId: this.userId, startDate: payload.startDate },
            relativeTo: this.route,
          });
        }, 2000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error analyzing trip:', err);
        this.error = 'Failed to analyze trip. Please try again.';
        this.isAnalyzing = false;
        setTimeout(() => (this.error = null), 3000);
        this.cdr.detectChanges();
      },
    });
  }
}
