import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../services/general.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-packegedetailes',
  templateUrl: './packegedetailes.component.html',
  styleUrls: ['./packegedetailes.component.scss']
})
export class PackegedetailesComponent {
 pageId:number=0;
 username:any
 email:any
 date:any
 bookingid:number=0
 persons:number=0
 currentDate = new Date().toISOString();
 username2=localStorage.getItem('userName')
responseMessage: string = '';
constructor(private _ActivatedRoute:ActivatedRoute ,private _generalservice:GeneralService ,private fb: FormBuilder){
  this.pageId=this._ActivatedRoute.snapshot.params['id']
this.getdetails(this.pageId)

}
place:any;
packageInclusions:any
packageExclusions:any


getdetails(id:number){
  
  this._generalservice.getpackgesdetails(id).subscribe({
    next: (response) => {
  this.place=response
  this.packageInclusions=response.packageInclusions
this.packageExclusions=response.packageExclusions

      console.log(response.packageInclusions);
    },
    error: (err) => {
      console.error("Error:", err);
    }
  });
}

rating: number = 0; // التقييم الحالي
stars: number[] = [1, 2, 3, 4, 5]; // مصفوفة النجوم
comment:string=''
setRating(star: number) {
  const rate={
    packageId:this.pageId,
    userName:this.username2,
    rating:this.rating,
    comment:this.comment,
    currentDate:this.currentDate
  }
  this._generalservice.rating(rate).subscribe({
    next: (response) => {
   
      console.log(response)
   
    },
    error: (error) => {
      this.responseMessage = 'Error: ' + (error.error.message || 'Failed to book');
    }
  });
  this.rating = star;
}
panelOpenState = false;

onSubmit() {
 
  const bookingData = {
    username:this.username,
    email:this.email,
    packageId:this.pageId,
    tripDate:this.date,
    numberOfPersons:this.persons

  };

this._generalservice.createBooking(bookingData).subscribe({
    next: (response) => {
      this.responseMessage = 'Booking successful!';
     this.bookingid=response.bookingId
      console.log(response.bookingId)
      
      this.payment(this.bookingid)
    },
    error: (error) => {
      this.responseMessage = 'Error: ' + (error.error.message || 'Failed to book');
    }
  });
}
payment(bookingid:any){
  const bookingId={
    bookingId:this.bookingid,
  
  }

  this._generalservice.payment(bookingId).subscribe({
    next:(response)=>{
       console.log(response)
       if (response.paymentUrl) {
        window.open(response.paymentUrl, '_blank'); 
      } else {
        console.error('Error: paymentUrl is missing in response');
      }
    }
  })
}

  
}
