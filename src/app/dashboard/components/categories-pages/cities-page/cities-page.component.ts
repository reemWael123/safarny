import { Component } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-cities-page',
  templateUrl: './cities-page.component.html',
  styleUrls: ['./cities-page.component.scss'],
})
export class CitiesPageComponent {
  constructor(private _generalservice: GeneralService) {}
  pageHeader = {
    title: 'Cities',
    description: '',
    imgPath: 'assets/images/city1.png',
  };
  logRoute(id: number) {
    console.log("Navigating to:", `/PRH/${id}`);
  }
  
    
 
  cate: any[] = [];
  ngOnInit() {
    this._generalservice.cities$.subscribe((data) => {
      this.cate = data;
      console.log(this.cate)
    });
  }
  
}
