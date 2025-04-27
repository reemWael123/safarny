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
  selected?: boolean; // Add selected property for checkbox
}

interface City {
  id: number;
  name: string;
  image: string;
  description?: string;
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
  cities: City[] = [];
  categories: string[] = [];
  selectedPlaces: Place[] = []; // Track selected places
  cartItems: Place[] = [];
  userId: string = 'user123';
  cartSuccessMessage: string | null = null; // Add property for success message

  isLoading = false;
  itemsPerPage = 6;
  currentActivityPage = 1;

  constructor(
    private fb: FormBuilder,
    private tripService: TripSearchService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      startDate: [new Date().toISOString().split('T')[0]],
      endDate: [new Date(Date.now() + 86400000).toISOString().split('T')[0]],
      cities: [[]],
      categories: [[]],
      priceMin: [0],
      priceMax: [2000],
      rating: [0],
      endCity: [null],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const userid = localStorage.getItem('userId');
    this.userId = userid ? userid : 'user123';

    // Load cities
    this.tripService.getCities().subscribe((cities) => {
      this.cities = cities;

      if (cities && cities.length > 0) {
        // Load places for all cities
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
      this.tripService.getPlaces(city.id).pipe(
        catchError((error) => {
          console.error(`Error loading data for ${city.name}:`, error);
          return of([]);
        })
      )
    );

    forkJoin(requests)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((results) => {
        console.log('Results:', results);
        this.places = results.flat();
        this.categories = [
          ...new Set(this.places.map((place) => place.category)),
        ];
        this.filteredPlaces = this.places;
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
      const endCityId = this.getCityIdByName(endCity);
      if (endCityId) {
        // Keep only places in the end city or adjust as needed
      }
    }

    // Apply price filter
    const formValues = this.searchForm.value;
    if (formValues.priceMin || formValues.priceMax) {
      filtered = filtered.filter(
        (place) =>
          place.price >= formValues.priceMin &&
          place.price <= formValues.priceMax
      );
    }

    this.filteredPlaces = filtered;
    this.currentActivityPage = 1;
  }

  updateSelectedCities(event: any, city: string): void {
    const cities = this.searchForm.get('cities')?.value || [];
    const endCity = this.searchForm.get('endCity')?.value;

    if (event.target.checked) {
      const endOfTripCheckbox = event.target.id.startsWith('end-');
      if (endOfTripCheckbox) {
        this.searchForm.patchValue({ endCity: city });
      } else {
        this.searchForm.patchValue({
          cities: [...cities, city],
        });
      }
    } else {
      if (event.target.id.startsWith('end-') && endCity === city) {
        this.searchForm.patchValue({ endCity: null });
      } else {
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
    this.searchForm.patchValue({ rating });
  }

  clearAllFilters(): void {
    this.searchForm.reset({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      cities: [],
      categories: [],
      priceMin: 0,
      priceMax: 2000,
      rating: 0,
      endCity: null,
    });

    this.filteredPlaces = this.places;
    this.currentActivityPage = 1;

    // Clear checkboxes and radio buttons
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((element) => {
      const checkbox = element as HTMLInputElement;
      checkbox.checked = false;
    });

    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((element) => {
      const radio = element as HTMLInputElement;
      radio.checked = false;
    });

    // Clear selected places
    this.selectedPlaces = [];
    this.places.forEach((place) => (place.selected = false));
  }

  get paginatedPlaces(): Place[] {
    const startIndex = (this.currentActivityPage - 1) * this.itemsPerPage;
    return this.filteredPlaces.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalActivityPages(): number {
    return Math.ceil(this.filteredPlaces.length / this.itemsPerPage);
  }

  changePage(page: number, type: 'activity'): void {
    if (page >= 1 && page <= this.totalActivityPages) {
      this.currentActivityPage = page;
    }
  }

  getPageNumbers(type: 'activity'): number[] {
    return Array.from({ length: this.totalActivityPages }, (_, i) => i + 1);
  }

  togglePlaceSelection(place: Place): void {
    place.selected = !place.selected;
    if (place.selected) {
      this.selectedPlaces.push(place);
    } else {
      this.selectedPlaces = this.selectedPlaces.filter(
        (p) => p.id !== place.id
      );
    }
  }

  addSelectedToCart(): void {
    if (this.selectedPlaces.length === 0) {
      console.log('No places selected');
      return;
    }

    const payload = {
      userId: this.userId,
      placeIds: this.selectedPlaces.map((place) => place.id),
    };

    this.tripService.addPlacesToCart(payload).subscribe({
      next: (response) => {
        console.log('Places added to cart:', response);
        this.cartItems.push(...this.selectedPlaces);
        this.cartSuccessMessage = 'Selected places added to cart successfully!';
        this.selectedPlaces.forEach((place) => (place.selected = false));
        this.selectedPlaces = [];
        // Clear message after 3 seconds
        setTimeout(() => (this.cartSuccessMessage = null), 3000);
      },
      error: (error) => {
        console.error('Error adding places to cart:', error);
        this.cartSuccessMessage =
          'Failed to add places to cart. Please try again.';
        setTimeout(() => (this.cartSuccessMessage = null), 3000);
      },
    });
  }

  isInCart(place: Place): boolean {
    return this.cartItems.some((item) => item.id === place.id);
  }
}
