import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-places-resturants-hotels',
  templateUrl: './places-resturants-hotels.component.html',
  styleUrls: ['./places-resturants-hotels.component.scss'],
})
export class PlacesResturantsHotelsComponent {
  pageId: number = 0;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _generalservice: GeneralService
  ) {
    this.pageId = this._ActivatedRoute.snapshot.params['id'];
  }
  diningOptions: string = '';
  rate: number = 0;
  type: string = ''; // لتخزين اختيار الـ Type
  priceRange: string = ''; // لتخزين اختيار Price Range
  mealTime: string = ''; // لتخزين Meal Time

  yess: boolean = false;
  places: any;
  resturant: any;
  hotels: any;

  getallplaces(id: number) {
    this._generalservice.getPlaces(id).subscribe({
      next: (response) => {
        this.places = response;
        this.resturant = null;
        this.hotels = null;
        console.log(response);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }
  getallresturants(id: number) {
    this._generalservice.getresturants(id).subscribe({
      next: (response) => {
        this.resturant = response;
        this.places = null;
        this.hotels = null;
        console.log(response);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  getAllHotels(id: number) {
    this._generalservice.getHotels(id).subscribe({
      next: (response) => {
        this.hotels = response;
        this.resturant = null;
        this.places = null;
        console.log(this.hotels);
      },
      error(err) {
        console.log('Error', err);
      },
    });
  }

  fillter() {
    this._generalservice.filter(this.type, this.mealTime).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }
}
