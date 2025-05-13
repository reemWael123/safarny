import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripSearchService } from 'src/app/services/trip-search.service';
import {
  BookingService,
  TripBookingRequest,
} from 'src/app/services/booking.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface TripCity {
  cityId: number;
  cityName: string;
  startDate: string;
  endDate: string;
  daysInCity: number;
  hotel: {
    hotelId: number;
    hotelName: string;
    rating: number;
    pricePerNight: number;
  } | null;
  places: { placeId: number; placeName: string; pictureUrl?: string }[];
  arrivalAirport: string;
  departureAirport: string;
}

interface TripPrice {
  totalTripPrice: number;
  pricePerPerson: number;
}

@Component({
  selector: 'app-trip-summary',
  templateUrl: './trip-summary.component.html',
  styleUrls: ['./trip-summary.component.scss'],
})
export class TripSummaryComponent implements OnInit {
  userId: string = '';
  startDate: string = '';
  wantHotelBooking: boolean = false;
  tripCities: TripCity[] = [];
  numberOfPeople: number = 1;
  tripPrice: TripPrice | null = null;
  isLoading: boolean = false;
  isCalculating: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  showBookingModal: boolean = false;
  currentBookingId: string = '';
  placeholderImage: string =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNlZGU3ZDMiLz48dGV4dCB4PSI1MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+Q29udGVudCB1bmRlciByZXZpZXc8L3RleHQ+PC9zdmc+';

  constructor(
    private route: ActivatedRoute,
    private tripService: TripSearchService,
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'] || 'bc616ee1-3aca-42fe-83fc-c43fde2cf740';
      this.startDate = params['startDate'] || '2025-04-27T00:00:00Z';
      this.wantHotelBooking = Boolean(params['wantHotelBooking']) || false;
      this.loadTripSummary();
    });
  }

  loadTripSummary(): void {
    this.isLoading = true;
    this.error = null;

    this.tripService.getFullTripSummary(this.userId, this.startDate).subscribe({
      next: (cities) => {
        console.log('Full Trip Summary:', cities);
        const sortedCities = cities.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        const placeRequests = sortedCities.map((city) =>
          this.tripService.getPlaces(city.cityId).pipe(
            map((places) => {
              console.log(
                `Places for cityId ${city.cityId} (${city.cityName}):`,
                places
              );
              return {
                cityId: city.cityId,
                places: places.map((p) => ({
                  placeId: p.id,
                  pictureUrl: p.pictureUrl || this.placeholderImage,
                })),
              };
            }),
            catchError((err) => {
              console.error(
                `Error loading places for city ${city.cityId} (${city.cityName}):`,
                err
              );
              return of({ cityId: city.cityId, places: [] });
            })
          )
        );

        forkJoin(placeRequests).subscribe({
          next: (placeResponses) => {
            this.tripCities = sortedCities.map((city) => {
              const placeData = placeResponses.find(
                (pr) => pr.cityId === city.cityId
              );
              const placeImageMap = new Map<number, string>(
                placeData?.places.map((p) => [p.placeId, p.pictureUrl]) || []
              );

              const placesWithImages = city.places
                .slice(0, 9)
                .map((place: any) => {
                  const pictureUrl =
                    placeImageMap.get(place.placeId) || this.placeholderImage;
                  if (!placeImageMap.has(place.placeId)) {
                    console.warn(
                      `No image found for placeId ${place.placeId} (${place.placeName}) in cityId ${city.cityId}`
                    );
                  }
                  console.log(
                    `Mapping placeId ${place.placeId} (${place.placeName}): pictureUrl=${pictureUrl}`
                  );
                  return { ...place, pictureUrl };
                });

              return { ...city, places: placesWithImages };
            });
            console.log('Trip Cities with Images:', this.tripCities);
            this.cdr.detectChanges();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading place images:', err);
            this.error =
              'Failed to load place images, but trip summary loaded.';
            this.tripCities = sortedCities.map((city) => ({
              ...city,
              places: city.places.slice(0, 9).map((place: any) => ({
                ...place,
                pictureUrl: this.placeholderImage,
              })),
            }));
            console.log(
              'Trip Cities with Placeholder Images:',
              this.tripCities
            );
            this.cdr.detectChanges();
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error loading trip summary:', err);
        this.error = 'Failed to load trip summary. Please try again.';
        this.isLoading = false;
      },
    });
  }

  bookTripAndOpenModal(): void {
    this.isCalculating = true;
    this.error = null;
    this.successMessage = null;

    const bookingData: TripBookingRequest = {
      userId: this.userId,
      fullName: '',
      email: '',
      phoneNumber: '',
    };

    this.bookingService.bookTrip(bookingData).subscribe({
      next: (response) => {
        const bookingId = response.body?.bookingId;
        if (!bookingId || isNaN(parseInt(bookingId, 10))) {
          console.error(
            'Invalid or missing bookingId from bookTrip API:',
            response
          );
          this.error = 'Failed to create booking. Please try again.';
          this.isCalculating = false;
          setTimeout(() => (this.error = null), 3000);
          this.cdr.detectChanges();
          return;
        }
        this.successMessage = `Booking created! Opening booking details...`;
        this.currentBookingId = bookingId;
        this.showBookingModal = true;
        this.isCalculating = false;
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error booking trip:', err);
        this.error = 'Failed to book trip. Please try again.';
        this.isCalculating = false;
        setTimeout(() => (this.error = null), 3000);
        this.cdr.detectChanges();
      },
    });
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.currentBookingId = '';
    this.cdr.detectChanges();
  }

  handleBookingComplete(bookingId: string): void {
    this.successMessage = `Booking ${bookingId} completed!`;
    this.showBookingModal = false;
    this.currentBookingId = '';
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
    this.cdr.detectChanges();
  }

  calculateTripPrice(): void {
    if (this.numberOfPeople < 1) {
      this.error = 'Please enter a valid number of people.';
      setTimeout(() => (this.error = null), 3000);
      return;
    }

    this.isCalculating = true;
    this.error = null;
    this.successMessage = null;

    this.tripService
      .calculateTripPrice(
        this.userId,
        this.numberOfPeople,
        this.wantHotelBooking
      )
      .subscribe({
        next: (price) => {
          console.log('Trip Price:', price);
          this.tripPrice = price;
          this.successMessage = 'Price calculated successfully!';
          this.isCalculating = false;
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Error calculating trip price:', err);
          this.error = 'Failed to calculate trip price. Please try again.';
          this.isCalculating = false;
          setTimeout(() => (this.error = null), 3000);
        },
      });
  }

  handleImageError(event: Event, placeName: string): void {
    console.error(
      `Image failed to load for ${placeName}:`,
      (event.target as HTMLImageElement).src
    );
    (event.target as HTMLImageElement).src = this.placeholderImage;
  }
}
