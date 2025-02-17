import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-packeges',
  templateUrl: './packeges.component.html',
  styleUrls: ['./packeges.component.scss']
})
export class PackegesComponent  implements OnInit{

  constructor(private _generalservice:GeneralService){
    
  }
  ngOnInit(): void {
    this.getallpackages()
    
  }
  packages:any
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
}
