import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-packeges',
  templateUrl: './packeges.component.html',
  styleUrls: ['./packeges.component.scss']
})
export class PackegesComponent  implements OnInit{
    username=localStorage.getItem('userName')
    
  constructor(private _generalservice:GeneralService){
    
  }
  ngOnInit(): void {
    this.getallpackages()
    this.gerecpackages()
  }
  packages:any
  recopackages:any
  getallpackages(){
  
    this._generalservice.getpackges().subscribe({
      next: (response) => {
    this.packages=response  
     
        console.log(response);
      },
      error: (err) => {
        console.error("Error:", err);
      }
    });
  }
  gerecpackages(){

  
    this._generalservice.recommendedPackages(this.username).subscribe({
      next: (response) => {
   
     this.recopackages=response
        console.log(response);
      },
      error: (err) => {
        console.error("Error:", err);
      }
    });
  }
}
