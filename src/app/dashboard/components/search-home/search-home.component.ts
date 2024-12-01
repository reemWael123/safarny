import { Component } from '@angular/core';

@Component({
  selector: 'app-search-home',
  templateUrl: './search-home.component.html',
  styleUrls: ['./search-home.component.scss']
})
export class SearchHomeComponent {
  selectedDate: Date | null = null; 
  checked: boolean = false;
  indeterminate: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
}
