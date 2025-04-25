// trip-search.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { TripSearchService } from 'src/app/services/trip-search.service';
import { Router } from '@angular/router';

interface Place {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  cityId: number;
  category: string;
  tripPlaces: any[];
  price: number;
}

interface Activity {
  id: number;
  name: string;
  location: string;
  image: string;
  price: number;
  city: string;
}

interface Hotel {
  id: number;
  name: string;
  city: string;
  location: string;
  image: string;
  startPrice: number;
  rating: number;
}

interface City {
  id: number;
  name: string;
  image: string;
  description?: string;
}

interface SearchFilters {
  cities?: string[];
  activities?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  interests?: string[];
}

@Component({
  selector: 'app-trip-search',
  templateUrl: './trip-search.component.html',
  styleUrls: ['./trip-search.component.scss'],
})
export class TripSearchComponent implements OnInit {
  searchForm: FormGroup;
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  cities: City[] = [];
  categories: string[] = [];
  selectedHotel: Hotel | null = null;

  cartItems: Place[] = [];
  userId: string = 'user123';

  interests: string[] = [
    'Culture',
    'Art and exhibitions',
    'Museums',
    'Religious sites',
    'Antiquities',
    'Desert safari',
    'Water sports',
  ];

  isLoading = false;
  itemsPerPage = 6;
  currentActivityPage = 1;
  currentHotelPage = 1;

  constructor(
    private fb: FormBuilder,
    private tripService: TripSearchService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      cityId: [null],
      startDate: [new Date().toISOString().split('T')[0]],
      endDate: [new Date(Date.now() + 86400000).toISOString().split('T')[0]],
      hotelId: [null],
      cities: [[]],
      categories: [[]],
      priceMin: [0],
      priceMax: [2000],
      rating: [0],
      endCity: [null], // Add end city filter
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const userid = localStorage.getItem('userId');
    this.userId = userid ? userid : 'user123';

    // First load cities
    this.tripService.getCities().subscribe((cities) => {
      this.cities = cities;

      if (cities && cities.length > 0) {
        // After getting cities, load places, activities, and hotels with cityIds
        this.loadDataForAllCities(cities);
      } else {
        this.isLoading = false;
      }
    });

    // Subscribe to form value changes
    this.searchForm.valueChanges.subscribe(() => {
      this.filterResults();
    });
  }

  loadDataForAllCities(cities: City[]): void {
    this.isLoading = true;
    const requests = cities.map((city) =>
      this.tripService.getPlacesAndHotels(city.id).pipe(
        catchError((error) => {
          console.error(`Error loading data for ${city.name}:`, error);
          return of({ touristPlaces: [], hotels: [] });
        })
      )
    );

    forkJoin(requests)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((results) => {
        this.places = results.flatMap((r) => r.touristPlaces);
        this.hotels = results.flatMap((r) => r.hotels);

        // Extract unique categories
        this.categories = [
          ...new Set(this.places.map((place) => place.category)),
        ];

        this.filteredPlaces = this.places;
        this.filteredHotels = this.hotels;
      });
  }

  getCityNameById(cityId: number): string {
    const city = this.cities.find((c) => c.id === cityId);
    return city ? city.name : '';
  }

  getCityIdByName(cityName: string): number | null {
    const city = this.cities.find((c) => c.name === cityName);
    return city ? city.id : null;
  }

  filterResults(): void {
    const selectedCities = this.searchForm.get('cities')?.value || [];
    const selectedCategories = this.searchForm.get('categories')?.value || [];
    const endCity = this.searchForm.get('endCity')?.value;

    let filtered = this.places;

    // Filter by cities if any are selected
    if (selectedCities.length > 0) {
      filtered = filtered.filter((place) =>
        selectedCities.includes(this.getCityNameById(place.cityId))
      );
    }

    // Filter by categories if any are selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((place) =>
        selectedCategories.includes(place.category)
      );
    }

    // Filter by end city if selected
    if (endCity) {
      // This is just for demonstration. In a real app, you'd have a proper
      // way to handle end city filtering based on your trip planning logic
      const endCityId = this.getCityIdByName(endCity);
      if (endCityId) {
        // Keep only places in the end city or filter logic as needed
      }
    }

    // Filter hotels based on selected cities
    this.filteredHotels =
      selectedCities.length > 0
        ? this.hotels.filter((hotel) => selectedCities.includes(hotel.city))
        : this.hotels;

    // Apply additional filters
    const formValues = this.searchForm.value;

    // Apply price filter
    if (formValues.priceMin || formValues.priceMax) {
      filtered = filtered.filter(
        (place) =>
          place.price >= formValues.priceMin &&
          place.price <= formValues.priceMax
      );

      this.filteredHotels = this.filteredHotels.filter(
        (hotel) =>
          hotel.startPrice >= formValues.priceMin &&
          hotel.startPrice <= formValues.priceMax
      );
    }

    this.filteredPlaces = filtered;

    // Apply rating filter for hotels
    if (formValues.rating) {
      this.filteredHotels = this.filteredHotels.filter(
        (hotel) => hotel.rating >= formValues.rating
      );
    }

    // Reset both pagination counters
    this.currentActivityPage = 1;
    this.currentHotelPage = 1;
  }

  updateSelectedCities(event: any, city: string): void {
    const cities = this.searchForm.get('cities')?.value || [];
    const endCity = this.searchForm.get('endCity')?.value;

    if (event.target.checked) {
      // Check if this is part of the "End of trip at" section
      const endOfTripCheckbox = event.target.id.startsWith('end-');

      if (endOfTripCheckbox) {
        // Update endCity field
        this.searchForm.patchValue({ endCity: city });
      } else {
        // Update cities array for starting cities
        this.searchForm.patchValue({
          cities: [...cities, city],
        });
      }
    } else {
      // If it's in the end city section
      if (event.target.id.startsWith('end-') && endCity === city) {
        this.searchForm.patchValue({ endCity: null });
      } else {
        // Remove from cities array
        this.searchForm.patchValue({
          cities: cities.filter((c: string) => c !== city),
        });
      }
    }
  }

  updateSelectedCategories(event: any, category: string): void {
    const categories = this.searchForm.get('categories')?.value || [];

    if (event.target.checked) {
      this.searchForm.patchValue({
        categories: [...categories, category],
      });
    } else {
      this.searchForm.patchValue({
        categories: categories.filter((c: string) => c !== category),
      });
    }
  }

  updateRating(rating: number): void {
    this.searchForm.patchValue({
      rating,
    });
  }

  resetFilters(): void {
    this.searchForm.reset({
      cityId: null,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      hotelId: null,
      cities: [],
      categories: [],
      priceMin: 0,
      priceMax: 2000,
      rating: 0,
      endCity: null,
    });

    // Navigate to view trips
    // this.viewTrips();
  }

  clearAllFilters(): void {
    // Reset form to initial values
    this.searchForm.reset({
      cityId: null,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      hotelId: null,
      cities: [],
      categories: [],
      priceMin: 0,
      priceMax: 2000,
      rating: 0,
      endCity: null,
    });

    // Reset filtered data to show all items
    this.filteredPlaces = this.places;
    this.filteredHotels = this.hotels;

    // Reset pagination
    this.currentActivityPage = 1;
    this.currentHotelPage = 1;

    // Clear all checkboxes (with proper type casting)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((element) => {
      const checkbox = element as HTMLInputElement;
      checkbox.checked = false;
    });

    // Clear radio buttons (with proper type casting)
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((element) => {
      const radio = element as HTMLInputElement;
      radio.checked = false;
    });
  }

  get paginatedPlaces(): Place[] {
    const startIndex = (this.currentActivityPage - 1) * this.itemsPerPage;
    return this.filteredPlaces.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get paginatedHotels(): Hotel[] {
    const startIndex = (this.currentHotelPage - 1) * this.itemsPerPage;
    return this.filteredHotels.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalActivityPages(): number {
    return Math.ceil(this.filteredPlaces.length / this.itemsPerPage);
  }

  get totalHotelPages(): number {
    return Math.ceil(this.filteredHotels.length / this.itemsPerPage);
  }

  changePage(page: number, type: 'activity' | 'hotel'): void {
    if (type === 'activity') {
      if (page >= 1 && page <= this.totalActivityPages) {
        this.currentActivityPage = page;
      }
    } else {
      if (page >= 1 && page <= this.totalHotelPages) {
        this.currentHotelPage = page;
      }
    }
  }

  getPageNumbers(type: 'activity' | 'hotel'): number[] {
    const totalPages =
      type === 'activity' ? this.totalActivityPages : this.totalHotelPages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  selectHotel(hotel: Hotel): void {
    this.selectedHotel = hotel;
    this.searchForm.patchValue({
      hotelId: hotel.id,
    });
  }

  // Update the addToCart method to use form values
  addToCart(place: Place): void {
    const index = this.cartItems.findIndex((item) => item.id === place.id);
    const formValues = this.searchForm.value;

    if (index === -1) {
      // Add to cart
      this.cartItems.push(place);

      // Get selected hotel if any
      const hotelId = formValues.hotelId || 2;

      // Get selected cities and find main city for this place
      const selectedCities = formValues.cities || [];
      const endCity = formValues.endCity;

      // Get dates from form or use defaults
      const startDate = formValues.startDate || new Date().toISOString();
      const endDate =
        formValues.endDate || new Date(Date.now() + 86400000).toISOString();

      // Get price range
      const minPrice = formValues.priceMin || 0;
      const maxPrice = formValues.priceMax || 2000;

      // Get rating
      const rating = formValues.rating || 0;

      // Call API to add to trip
      const payload = {
        userId: this.userId,
        cityId: place.cityId,
        touristPlaceIds: [place.id],
        hotelId: hotelId,
        startDate: startDate,
        endDate: endDate,
        minPrice: minPrice,
        maxPrice: maxPrice,
        rate: rating,
        // endCityId: endCity ? this.getCityIdByName(endCity) : null,
      };

      const payloadCart = {
        userId: this.userId,
        touristPlaceId: place.id,
        hotelId: hotelId,
        startDate: startDate,
        endDate: endDate,
      };

      this.tripService.addToCart(payloadCart).subscribe({
        next: (response) => {
          console.log('Added to trip:', response);
        },
        error: (error) => {
          console.error('Error adding to trip:', error);
          // Remove from local cart if API fails
          const failedIndex = this.cartItems.findIndex(
            (item) => item.id === place.id
          );
          if (failedIndex !== -1) {
            this.cartItems.splice(failedIndex, 1);
          }
        },
      });
    } else {
      // Remove from cart
      this.cartItems.splice(index, 1);

      // We need the trip ID to delete it
      this.tripService.getTripIdByPlaceId(place.id, this.userId).subscribe({
        next: (tripId) => {
          this.tripService.deleteCartItem(tripId).subscribe({
            next: () => console.log('Removed from trip'),
            error: (error) => console.error('Error removing from trip:', error),
          });
        },
        error: (error) => console.error('Error getting trip ID:', error),
      });
    }
  }

  // Check if an item is in the cart
  isInCart(place: Place): boolean {
    return this.cartItems.some((item) => item.id === place.id);
  }

  // Navigate to view trips page
  // viewTrips(): void {
  //   this.router.navigate(['/view-trips'], {
  //     queryParams: { userId: this.userId },
  //   });
  // }
}
