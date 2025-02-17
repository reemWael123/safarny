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
this.getdetails(this.pageId)
}
place:any;
getdetails(id:number){
  
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
}
