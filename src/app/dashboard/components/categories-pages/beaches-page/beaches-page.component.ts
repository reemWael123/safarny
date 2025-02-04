import { Component } from '@angular/core';

@Component({
  selector: 'app-beaches-page',
  templateUrl: './beaches-page.component.html',
  styleUrls: ['./beaches-page.component.scss'],
})
export class BeachesPageComponent {
  pageHeader = {
    title: 'Beaches',
    description: `Egypt's beaches are distinguished by their diversity and unique beauty,stretching along the Red Sea and
              the Mediterranean,making them an ideal destination for divers and tourists. From the beaches of Sharm-
              ElSheikh and Hurghada to Alexandria and Ain Sokhna,they offer Turquoise waters,golden sands,and various
              marine activites.`,
    imgPath: 'assets/images/beach1.png',
  };

  beaches = [
    {
      title: 'Alexandria',
      imgPath: 'assets/images/beach2.png',
    },
    {
      title: 'Dahab',
      imgPath: 'assets/images/beach3.png',
    },
    {
      title: 'Sharm Elshaikh',
      imgPath: 'assets/images/beach4.png',
    },
    {
      title: 'Ain Sokhna',
      imgPath: 'assets/images/beach5.png',
    },
  ];
}
