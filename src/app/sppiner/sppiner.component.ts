import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sppiner',
  templateUrl: './sppiner.component.html',
  styleUrls: ['./sppiner.component.scss']
})
export class SppinerComponent {
  constructor(private spinner: NgxSpinnerService) {}
  
  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }
}
