import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripSearchService } from 'src/app/services/trip-search.service';
import { forkJoin, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

interface Place {
  placeId: any;
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  cityId: number;
  category: string;
  tripPlaces: any[];
  price: number;
}

interface Hotel {
  hotelId: number;
  hotelName: string;
  rating: number;
  pricePerNight: number;
  selected?: boolean;
}

interface Trip {
  cityName: string;
  places: { placeId: number; placeName: string; pictureUrl?: string }[];
  hotels: Hotel[];
  days?: number;
  showAllHotels?: boolean;
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
  includeHotels: boolean = false; // Default to showing hotels
  startDate: string = new Date().toISOString().split('T')[0]; // Default to today
  isAnalyzing: boolean = false;

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

  loadCitiesAndTrips(): void {
    this.isLoading = true;
    this.error = null;

    this.tripService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.tripService.getTripDays(this.userId).subscribe({
          next: (tripDays) => {
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
        const dedupedTrips = trips.map((trip) => ({
          ...trip,
          places: [...new Map(trip.places.map((p) => [p.placeId, p])).values()],
          hotels: trip.hotels.map((hotel) => ({ ...hotel, selected: false })),
          days:
            this.tripDays.find(
              (td) => td.cityName.toLowerCase() === trip.cityName.toLowerCase()
            )?.days || 0,
          showAllHotels: false, // Initialize to show only recommended hotels
        }));

        const placeRequests: Observable<Place[]>[] = dedupedTrips.map(
          (trip) => {
            const city = this.cities.find(
              (c) => c.name.toLowerCase() === trip.cityName.toLowerCase()
            );
            if (!city) {
              console.warn(
                `City not found for ${trip.cityName}, using placeholder`
              );
              return of([]);
            }
            return this.tripService.getPlaces(city.id);
          }
        );

        const hotelRequests: Observable<Hotel[]>[] = dedupedTrips.map(
          (trip) => {
            const city = this.cities.find(
              (c) => c.name.toLowerCase() === trip.cityName.toLowerCase()
            );
            if (!city) {
              console.warn(
                `City not found for ${trip.cityName}, skipping hotels`
              );
              return of([]);
            }
            return this.tripService.getAllHotels(city.id);
          }
        );

        forkJoin({
          places: forkJoin(placeRequests),
          hotels: forkJoin(hotelRequests),
        }).subscribe({
          next: ({ places: allPlacesByCity, hotels: allHotelsByCity }) => {
            this.trips = dedupedTrips.map((trip, index) => {
              const city = this.cities.find(
                (c) => c.name.toLowerCase() === trip.cityName.toLowerCase()
              );
              const additionalHotels = city
                ? allHotelsByCity[index].map((hotel) => ({
                    ...hotel,
                    selected: false,
                  }))
                : [];

              const existingHotelIds = new Set(
                trip.hotels.map((h) => h.hotelId)
              );
              const uniqueAdditionalHotels = additionalHotels.filter(
                (hotel) => !existingHotelIds.has(hotel.hotelId)
              );

              return {
                ...trip,
                places: trip.places.map((place) => ({
                  ...place,
                  pictureUrl:
                    allPlacesByCity[index].find((p) => p.id === place.placeId)
                      ?.pictureUrl || 'assets/images/trips.jpg',
                })),
                hotels: [...trip.hotels, ...uniqueAdditionalHotels],
              };
            });
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading place or hotel details:', err);
            this.error =
              'Failed to load place images or additional hotels. Displaying trips with placeholders.';
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
    const previousState = hotel.selected;
    this.hotelLoading.add(hotel.hotelId);
    this.cdr.detectChanges();

    trip.hotels.forEach((h) => (h.selected = false));
    hotel.selected = !previousState;

    const city = this.cities.find(
      (c) => c.name.toLowerCase() === trip.cityName.toLowerCase()
    );
    if (!city) {
      console.error('City not found for:', trip.cityName);
      this.error = 'Failed to select hotel. City not found.';
      hotel.selected = false;
      this.hotelLoading.delete(hotel.hotelId);
      trip.hotels.forEach((h) => (h.selected = false));
      this.cdr.detectChanges();
      return;
    }

    const payload = hotel.selected
      ? [{ userId: this.userId, cityId: city.id, hotelId: hotel.hotelId }]
      : [];

    this.tripService.chooseHotels(payload).subscribe({
      next: (response) => {
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
        trip.hotels.forEach((h) => (h.selected = false));
        setTimeout(() => (this.error = null), 3000);
        this.cdr.detectChanges();
      },
    });
  }

  calculateTripTotal(trip: Trip): number {
    const selectedHotel = trip.hotels.find((hotel) => hotel.selected);
    return selectedHotel ? selectedHotel.pricePerNight : 0;
  }

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
    img.src = 'assets/images/trips.jpg';
    console.warn('Image failed to load, using placeholder:', img.src);
  }

  getSelectedHotelName(trip: Trip): string {
    const selectedHotel = trip.hotels?.find((h) => h.selected);
    return selectedHotel ? selectedHotel.hotelName : 'None';
  }

  getSelectedHotelsCount(trip: Trip): number {
    return trip.hotels.some((hotel) => hotel.selected) ? 1 : 0;
  }

  getDisplayedHotels(trip: Trip): Hotel[] {
    return trip.showAllHotels ? trip.hotels : trip.hotels.slice(0, 3);
  }

  toggleShowAllHotels(trip: Trip): void {
    trip.showAllHotels = !trip.showAllHotels;
    this.cdr.detectChanges();
  }

  onHotelInclusionChange(): void {
    if (!this.includeHotels) {
      this.trips.forEach((trip) => {
        trip.hotels.forEach((hotel) => (hotel.selected = false));
        trip.showAllHotels = false;
      });
      this.tripService.chooseHotels([]).subscribe({
        next: () => {
          this.successMessage = 'Hotel selections cleared.';
          setTimeout(() => (this.successMessage = null), 3000);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error clearing hotel selections:', err);
          this.error = 'Failed to clear hotel selections.';
          setTimeout(() => (this.error = null), 3000);
          this.cdr.detectChanges();
        },
      });
    }
    this.cdr.detectChanges();
  }

  analyzeTrip(): void {
    if (!this.startDate) {
      this.error = 'Please select a start date.';
      setTimeout(() => (this.error = null), 3000);
      return;
    }

    this.includeHotels = this.trips.some((trip) =>
      trip.hotels.some((hotel) => hotel.selected)
    );

    this.isAnalyzing = true;
    this.error = null;
    this.successMessage = null;

    const payload = {
      userId: this.userId,
      startDate: new Date(this.startDate).toISOString(),
      wantHotelBooking: this.includeHotels,
    };

    this.tripService.analyzeTrip(payload).subscribe({
      next: (response) => {
        this.successMessage =
          'Trip analysis completed! Redirecting to summary...';
        this.isAnalyzing = false;
        setTimeout(() => {
          this.successMessage = null;
          this.router.navigate(['../../trip-summary'], {
            queryParams: {
              userId: this.userId,
              startDate: payload.startDate,
              wantHotelBooking: payload.wantHotelBooking.toString(),
            },
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
