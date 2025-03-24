import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
 pageId:number=0;
constructor(private _ActivatedRoute:ActivatedRoute ,private _generalservice:GeneralService){
  this.pageId=this._ActivatedRoute.snapshot.params['id']
this.getactivites(this.pageId)
this.getdetailes(this.pageId)
this.getresturants(this.pageId)
}
resturants:any
place:any;
placedetails:any
getdetailes(id:number){
  
  this._generalservice.getplacedetails(id).subscribe({
    next: (response) => {
  this.placedetails=response
      console.log(response);
    },
    error: (err) => {
      console.error("Error:", err);
    }
  });
}

getactivites(id:number){
  
  this._generalservice.getdetails(id).subscribe({
    next: (response) => {
  this.place=response
      console.log(response);
    },
    error: (err) => {
      console.error("Error:", err);
    }
  });
}
getresturants(id:number){
  
  this._generalservice.NearbyResturants(id).subscribe({
    next: (response) => {
  this.resturants=response.topRestaurants
      console.log(response.topRestaurants);
    },
    error: (err) => {
      console.error("Error:", err);
    }
  });
}
}
