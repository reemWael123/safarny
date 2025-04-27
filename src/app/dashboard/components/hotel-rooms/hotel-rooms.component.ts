import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  displayedRooms: Room[] = [];
  searchTerm: string = '';
  isLoading = true;
  errorMessage = '';
  isSearching = false;
  showBookingModal = false;
  selectedRoom: Room | null = null;
  bookingSuccess = false;
  private searchSubject = new Subject<string>();

  constructor(
    private generalService: GeneralService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.hotelId = Number(params.get('hotelId')) || 0;
      this.fetchRooms();
    });
    this.setupSearch();
  }

  setupSearch() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim()) {
          this.isSearching = true;
          this.errorMessage = '';
          this.generalService.searchRooms(query).subscribe({
            next: (response) => {
              // Filter rooms to only include those from the current hotel
              this.displayedRooms = (response || []).filter(
                (room: Room) => room.hotelId === this.hotelId
              );
              this.isSearching = false;
              console.log('Filtered search results:', this.displayedRooms);
            },
            error: (err) => {
              this.errorMessage = 'Failed to search rooms. Please try again.';
              this.displayedRooms = this.rooms; // Fallback to all rooms
              this.isSearching = false;
              console.error('Error searching rooms:', err);
            },
          });
        } else {
          this.displayedRooms = this.rooms; // Reset to all rooms
          this.isSearching = false;
        }
      });
  }

  onRoomSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  fetchRooms(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.generalService.getHotelRooms(this.hotelId).subscribe({
      next: (data) => {
        this.rooms = data || [];
        this.displayedRooms = this.rooms; // Initially display all rooms
        this.isLoading = false;
        console.log('Fetched rooms:', this.rooms);
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
    document.body.style.overflow = 'hidden';
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedRoom = null;
    document.body.style.overflow = 'auto';
  }

  onBookingComplete(response: any): void {
    document.body.style.overflow = 'auto';
    this.bookingId = response.bookingId;
    this.bookingSuccess = true;
    this.showBookingModal = false;
    setTimeout(() => {
      this.bookingSuccess = false;
    }, 5000);
    // Refresh rooms to update availability
    this.fetchRooms();
  }
}
