import { Component } from '@angular/core';

@Component({
  selector: 'app-cities-page',
  templateUrl: './cities-page.component.html',
  styleUrls: ['./cities-page.component.scss'],
})
export class CitiesPageComponent {
  pageHeader = {
    title: 'Cities',
    description: '',
    imgPath: 'assets/images/city1.png',
  };

  cities = [
    {
      title: 'Cairo & Giza',
      imgPath: 'assets/images/city2.png',
    },
    {
      title: 'Alexandria',
      imgPath: 'assets/images/city3.png',
    },
    {
      title: 'Aswan',
      imgPath: 'assets/images/city4.png',
    },
    {
      title: 'Ain Sokhna',
      imgPath: 'assets/images/city5.png',
    },
  ];
}
