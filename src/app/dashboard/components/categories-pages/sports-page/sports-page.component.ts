import { Component } from '@angular/core';

@Component({
  selector: 'app-sports-page',
  templateUrl: './sports-page.component.html',
  styleUrls: ['./sports-page.component.scss'],
})
export class SportsPageComponent {
  pageHeader = {
    title: 'Outdoor Sports',
    description: `Ancient Egypt, a civilization that thrived for over three millennia, 
continues to captivate the imagination of the modern world. Known 
for its impressive architectural feats, profound cultural richness, and pioneering 
contributions to human knowledge.`,
    imgPath: 'assets/images/sport1.png',
  };

  sports = [
    {
      title: 'Fayoum',
      imgPath: 'assets/images/sport2.png',
    },
    {
      title: 'Taba',
      imgPath: 'assets/images/sport3.png',
    },
    {
      title: 'Nuweiba',
      imgPath: 'assets/images/sport4.png',
    },
    {
      title: 'Sharm Elshaikh',
      imgPath: 'assets/images/sport5.png',
    },
  ];
}
