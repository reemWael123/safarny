import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-categ-page',
  templateUrl: './categ-page.component.html',
  styleUrls: ['./categ-page.component.scss'],
})
export class CategPageComponent {
  @Input() pageHeader?: { title: string; description: string; imgPath: string };
  @Input() pageMainList?: { title: string; imgPath: string }[];
}
