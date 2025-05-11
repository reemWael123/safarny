import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  implements OnInit{

  constructor(private generalService: GeneralService, ){}
  ngOnInit(): void {
    this.getprofile()
  }
  user:any
  packages:any
  hotels:any
  getprofile(){

let id=localStorage.getItem('userId') 

  this.generalService.getProfile(id).subscribe({
    next: (response) => {
   this.user=response.user;
   this.packages=response.packages;
    this.hotels=response.hotels;

      console.log(response);
    },
    error: (err) => {
      console.error("Error:", err);
    }
  });
}
}
