// trip-search.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { TripSearchService } from 'src/app/services/trip-search.service';

interface Place {
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
  pricePerNight: number;
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
  currentActivityPage = 1; // Renamed from currentPage
  currentHotelPage = 1; // New property for hotels pagination

  constructor(private fb: FormBuilder, private tripService: TripSearchService) {
    this.searchForm = this.fb.group({
      cityId: [null],
      startDate: [null],
      endDate: [null],
      hotelId: [null],
      cities: [[]],
      categories: [[]], // Replace interests with categories
      priceMin: [0],
      priceMax: [2000],
      rating: [0],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

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

  // In trip-search.component.ts

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

  // In trip-search.component.ts

  // Add this helper method near the bottom of the class
  getCityNameById(cityId: number): string {
    const city = this.cities.find((c) => c.id === cityId);
    return city ? city.name : '';
  }

  // Replace the existing filterResults() method with this one
  filterResults(): void {
    const selectedCities = this.searchForm.get('cities')?.value || [];
    const selectedCategories = this.searchForm.get('categories')?.value || [];

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

    // Filter hotels based on selected cities
    this.filteredHotels =
      selectedCities.length > 0
        ? this.hotels.filter((hotel) => selectedCities.includes(hotel.city))
        : this.hotels;

    // Apply additional filters if needed
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
          hotel.pricePerNight >= formValues.priceMin &&
          hotel.pricePerNight <= formValues.priceMax
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

    if (event.target.checked) {
      this.searchForm.patchValue({
        cities: [...cities, city],
      });
    } else {
      this.searchForm.patchValue({
        cities: cities.filter((c: string) => c !== city),
      });
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

  addToCart(item: any): void {
    // Implement cart functionality
    console.log('Added to cart:', item);
  }

  resetFilters(): void {
    this.searchForm.reset({
      cities: [],
      categories: [], // Update this line
      priceMin: 0,
      priceMax: 2000,
      rating: 0,
    });
  }

  clearAllFilters(): void {
    // Reset form to initial values
    this.searchForm.reset({
      cityId: null,
      startDate: null,
      endDate: null,
      hotelId: null,
      cities: [],
      categories: [],
      priceMin: 0,
      priceMax: 2000,
      rating: 0,
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

  // New getter for paginated hotels
  get paginatedHotels(): Hotel[] {
    const startIndex = (this.currentHotelPage - 1) * this.itemsPerPage;
    return this.filteredHotels.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  // Getter for total activities pages
  get totalActivityPages(): number {
    return Math.ceil(this.filteredPlaces.length / this.itemsPerPage);
  }

  // Getter for total hotel pages
  get totalHotelPages(): number {
    return Math.ceil(this.filteredHotels.length / this.itemsPerPage);
  }

  // Updated method to handle both activities and hotels pagination
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

  // Method to generate page numbers array for both sections
  getPageNumbers(type: 'activity' | 'hotel'): number[] {
    const totalPages =
      type === 'activity' ? this.totalActivityPages : this.totalHotelPages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
