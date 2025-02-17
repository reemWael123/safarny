import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-packegedetailes',
  templateUrl: './packegedetailes.component.html',
  styleUrls: ['./packegedetailes.component.scss']
})
export class PackegedetailesComponent {
 pageId:number=0;
constructor(private _ActivatedRoute:ActivatedRoute ,private _generalservice:GeneralService){
  this.pageId=this._ActivatedRoute.snapshot.params['id']
this.getdetails(this.pageId)
}
place:any;
getdetails(id:number){
  
  this._generalservice.getpackgesdetails(id).subscribe({
    next: (response) => {
  this.place=response
      console.log(response);
    },
    error: (err) => {
      console.error("Error:", err);
    }
  });
}

rating: number = 0; // التقييم الحالي
stars: number[] = [1, 2, 3, 4, 5]; // مصفوفة النجوم

setRating(star: number) {
  this.rating = star;
}
}
