import { Component } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-beaches-page',
  templateUrl: './beaches-page.component.html',
  styleUrls: ['./beaches-page.component.scss'],
})
export class BeachesPageComponent {
  
  
constructor(private _generalservice: GeneralService) {}
  pageHeader = {
    title: 'Beaches',
    description: `Egypt's beaches are distinguished by their diversity and unique beauty,stretching along the Red Sea and
              the Mediterranean,making them an ideal destination for divers and tourists. From the beaches of Sharm-
              ElSheikh and Hurghada to Alexandria and Ain Sokhna,they offer Turquoise waters,golden sands,and various
              marine activites.`,
    imgPath: 'assets/images/beach1.png',
  };
  cate: any[] = [];

  ngOnInit() {
    this._generalservice.cate$.subscribe((data) => {
      this.cate = data;
      console.log(this.cate)
    });
  }
 
}
