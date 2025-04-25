// hotel-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Hotel {
  id: number;
  name: string;
  overview: string;
  address: string;
  rate: number;
  startPrice: number;
  features: string[];
  images: string[];
}

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss'],
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | null = null;
  isLoading = true;
  errorMessage = '';
  hotelId: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.hotelId = Number(params.get('hotelId')) || 0;
      if (this.hotelId) {
        this.fetchHotelDetails();
      } else {
        this.errorMessage = 'Hotel ID not provided';
        this.isLoading = false;
      }
    });
  }

  fetchHotelDetails(): void {
    const url = `http://safarny.runasp.net/api/Hotels/hotel-details/${this.hotelId}`;

    this.http.get<Hotel>(url).subscribe({
      next: (data) => {
        console.log(data);
        this.hotel = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching hotel details:', error);
        this.errorMessage =
          'Failed to load hotel details. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  // Helper method to generate an array for star rating display
  getStarsArray(rating: number): number[] {
    return Array(rating)
      .fill(0)
      .map((_, i) => i + 1);
  }
}
