import { Component } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-sports-page',
  templateUrl: './sports-page.component.html',
  styleUrls: ['./sports-page.component.scss'],
})
export class SportsPageComponent {
  constructor(private _generalservice: GeneralService) {}
  pageHeader = {
    title: 'Outdoor Sports',
    description: `Ancient Egypt, a civilization that thrived for over three millennia, 
continues to captivate the imagination of the modern world. Known 
for its impressive architectural feats, profound cultural richness, and pioneering 
contributions to human knowledge.`,
    imgPath: 'assets/images/sport1.png',
  };

  cate: any[] = [];

  ngOnInit() {
    this._generalservice.cate$.subscribe((data) => {
      this.cate = data;
      console.log(this.cate)
    });
  }
 
}
