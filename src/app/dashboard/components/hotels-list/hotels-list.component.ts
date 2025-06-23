import { Component } from '@angular/core';
import { City, Hotel, HotelService } from './hotel.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hotels-list',
  templateUrl: './hotels-list.component.html',
  styleUrls: ['./hotels-list.component.scss'],
})
export class HotelsListComponent {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  cities: City[] = [];
  filterForm: FormGroup;
  isLoading = true;
  error: string | null = null;

  constructor(
    private hotelService: HotelService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      cityId: [''],
      minRate: [''],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadData(): void {
    this.isLoading = true;
    this.hotelService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.loadHotels();
      },
      error: (err) => {
        this.error = 'Failed to load cities.';
        this.isLoading = false;
        console.error('Error fetching cities:', err);
      },
    });
  }

  loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.filteredHotels = hotels;
        this.isLoading = false;
        this.applyFilters();
      },
      error: (err) => {
        this.error = 'Failed to load hotels. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching hotels:', err);
      },
    });
  }

  applyFilters(): void {
    const { cityId, minRate } = this.filterForm.value;
    this.filteredHotels = this.hotels.filter((hotel) => {
      const matchesCity = cityId ? hotel.cityId === +cityId : true;
      const matchesRate = minRate ? hotel.rate >= +minRate : true;
      return matchesCity && matchesRate;
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      cityId: '',
      minRate: '',
    });
  }

  navigateToRooms(hotelId: number): void {
    this.router.navigate(['/dashboard/home/hotel-rooms', hotelId]);
  }

  navigateToDetails(hotelId: number): void {
    this.router.navigate(['/dashboard/home/hotel-details', hotelId]);
  }
}
