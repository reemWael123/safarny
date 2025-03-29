// hotel-room.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../services/general.service';

interface Room {
  roomId: number;
  hotelId: number;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  isAvailable: boolean;
}

@Component({
  selector: 'app-hotel-rooms',
  templateUrl: './hotel-rooms.component.html',
  styleUrls: ['./hotel-rooms.component.scss'],
})
export class HotelRoomsComponent implements OnInit {
  bookingId: number = 0;
  hotelId: number = 0;
  rooms: Room[] = [];
  isLoading = true;
  errorMessage = '';

  // Modal properties
  showBookingModal = false;
  selectedRoom: Room | null = null;
  bookingSuccess = false;

  constructor(
    private generalService: GeneralService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.hotelId = Number(params.get('hotelId')) || 0;
    });

    this.fetchRooms();
  }

  fetchRooms(): void {
    this.generalService.getHotelRooms(this.hotelId).subscribe({
      next: (data) => {
        this.rooms = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load rooms. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching rooms:', error);
      },
    });
  }

  getCapacityText(capacity: number): string {
    return capacity === 1 ? '1 Guest' : `${capacity} Guests`;
  }

  openBookingModal(room: Room): void {
    this.selectedRoom = room;
    this.showBookingModal = true;
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedRoom = null;
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  }

  onBookingComplete(response: any): void {
    document.body.style.overflow = 'auto';

    this.bookingId = response.bookingId;
    this.bookingSuccess = true;
    this.showBookingModal = false;
    setTimeout(() => {
      this.bookingSuccess = false;
    }, 5000); // Hide success message after 5 seconds
  }
}
