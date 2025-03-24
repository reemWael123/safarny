import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-places-resturants-hotels',
  templateUrl: './places-resturants-hotels.component.html',
  styleUrls: ['./places-resturants-hotels.component.scss']
})
export class PlacesResturantsHotelsComponent {
  pageId:number=0;
constructor(private _ActivatedRoute:ActivatedRoute ,private _generalservice:GeneralService){
  this.pageId=this._ActivatedRoute.snapshot.params['id']

}
places:any
resturant:any
getallplaces(id:number){
  
    this._generalservice.getPlaces(id).subscribe({
      next: (response) => {
      this.places=response  
      this.resturant=null
        console.log(response);
      },
      error: (err) => {
        console.error("Error:", err);
      }
    });
  }
  getallresturants(id:number){
  
    this._generalservice.getresturants(id).subscribe({
      next: (response) => {
      this.resturant=response  
      this.places=null
        console.log(response);
      },
      error: (err) => {
        console.error("Error:", err);
      }
    });
  }
}

