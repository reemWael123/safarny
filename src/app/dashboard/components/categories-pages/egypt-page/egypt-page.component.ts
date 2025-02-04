import { Component } from '@angular/core';

@Component({
  selector: 'app-egypt-page',
  templateUrl: './egypt-page.component.html',
  styleUrls: ['./egypt-page.component.scss'],
})
export class EgyptPageComponent {
  pageHeader = {
    title: 'Ancient Egypt',
    description: `Ancient Egypt, a civilization that thrived for over three millennia,
      continues to captivate the imagination of the modern world. Known for its
      impressive architectural feats, profound cultural richness, and pioneering
      contributions to human knowledge.`,
    imgPath: 'assets/images/ancient1.png',
  };

  ancients = [
    {
      title: 'Cairo & Giza',
      imgPath: 'assets/images/ancient2.png',
    },
    {
      title: 'Fayoum',
      imgPath: 'assets/images/ancient3.png',
    },
    {
      title: 'Luxor',
      imgPath: 'assets/images/ancient4.png',
    },
    {
      title: 'Aswan',
      imgPath: 'assets/images/ancient5.png',
    },
  ];
}
