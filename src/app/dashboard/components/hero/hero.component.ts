import { Component, ElementRef, ViewChild } from '@angular/core';
import { SearchHomeComponent } from "../search-home/search-home.component";
import { GeneralService } from '../services/general.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  
})
export class HeroComponent {
  cate:any
 constructor( private _generalservice:GeneralService, private router: Router){}
  heroBackgrounds = [
    {
      imgPath: 'assets/images/hero-1.png',
    },
    {
      imgPath: 'assets/images/hero-2.png',
    },
    {
      imgPath: 'assets/images/hero-3.png',
    },
  ];

  getcategory(typei:string){
    
      this._generalservice.sendFilter(typei).subscribe({
        next: (response:any) => {
          this._generalservice.updateCate(response);
       this.cate=response
          console.log(response);
       
        },
        error: (err) => {
          console.error("Error:", err);
        }
      });
    }
    getcity() {
      this._generalservice.getcities().subscribe({
        next: (response) => {
          this._generalservice.updateCities(response); // إرسال البيانات للخدمة
          console.log(response);
        },
        error: (err) => {
          console.error("Error:", err);
        }
      });
    }
    
    
  }
