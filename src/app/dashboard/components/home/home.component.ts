
import { Component } from '@angular/core';
import { GeneralService } from '../services/general.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
 constructor( private _generalservice:GeneralService){}
  categories = [
    { title: 'Sun & Sea', image: '../../../../assets/images/image 34.png' },
    { title: 'Archeological Sites', image: '../../../../assets/image 35.png' },
    { title: 'Spiritual Egypt', image: '../../../../assets/images/image 36 (1).png' },
    { title: 'Museums', image: '../../../../assets/images/image 37.png' },
    { title: 'Cruising & Sailing', image: '../../../../assets/images/image 43 (1).png' },
    { title: 'Adventure & Outdoor', image: '../../../../assets/images/image 41.png' },
    { title: 'Ecotourism & Nature', image: '../../../../assets/images/image 42.png' },
    { title: 'Health & Wellness', image: '../../../../assets/images/image 40.png' },
    { title: 'Arts & Contemporary Culture', image: '../../../../assets/images/image 38.png' },
  ];
  contain:any
 
 

}
