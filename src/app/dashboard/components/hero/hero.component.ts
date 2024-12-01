import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {
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
}
