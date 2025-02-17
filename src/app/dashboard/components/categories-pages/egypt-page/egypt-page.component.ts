import { Component } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-egypt-page',
  templateUrl: './egypt-page.component.html',
  styleUrls: ['./egypt-page.component.scss'],
})
export class EgyptPageComponent {
  constructor(private _generalservice: GeneralService) {}

  pageHeader = {
    title: 'Ancient Egypt',
    description: `Ancient Egypt, a civilization that thrived for over three millennia,
      continues to captivate the imagination of the modern world. Known for its
      impressive architectural feats, profound cultural richness, and pioneering
      contributions to human knowledge.`,
    imgPath: 'assets/images/ancient1.png',
  };

 
  cate: any[] = [];

  ngOnInit() {
    this._generalservice.cate$.subscribe((data) => {
      this.cate = data;
      console.log(this.cate)
    });
  }
}
