import { Component } from '@angular/core';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-stteper',
  templateUrl: './stteper.component.html',
  styleUrls: ['./stteper.component.scss']
})
export class StteperComponent {
  min: number = 100;
  max: number = 2000;
  rangeValue: number = this.min;;
  userName=localStorage.getItem('userName')
 duration:number = 0;
  constructor(private _generalservice:GeneralService){
  }
  selectedCategory: string = '';
  submitSelection() {
    console.log("Selected category:", this.selectedCategory);
  
    // تجهيز البيانات للإرسال
    const answers = {
      username: this.userName,
      stayDuration: this.duration,
      budget: Number(this.rangeValue),
      categoryPreference: this.selectedCategory 
    };
  
    // التأكد من القيم قبل الإرسال
    if (this.duration !== 0 && this.rangeValue !== this.min) {
      this._generalservice.recommendation(answers).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.error("Error:", err);
        }
      });
    }
  }
  
}
