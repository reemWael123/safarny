import { Component } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  constructor(private _generalservice:GeneralService,private _router:Router,private dialog: MatDialog){
  }
  selectedCategory: string = '';
  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.submitSelection();
      }
    });
  }
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
          this._router.navigate(['/dashboard/home'])
          
        },
        error: (err) => {
          console.error("Error:", err);
        }
      });
    }
  }
  
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
  <div class="p-5">
  <h3 mat-dialog-title style="text-align: center; font-size: 18px; font-weight: bold; color: #333; margin-bottom: 20px;">
  Do you want to leave the questionnaire?
</h3>
<div mat-dialog-actions style="display: flex; justify-content: space-evenly; margin-top: 20px;">
  <button mat-button 
          style="background-color: #f2e9dd; color: black; font-weight: bold; padding: 10px 20px; border-radius: 5px; width: 120px; text-align: center;"
          (click)="closeDialog('cancel')">
    Cancel
  </button>
  <button mat-button 
          style="background-color: #d1b17a; color: black; font-weight: bold; padding: 10px 20px; border-radius: 5px; width: 120px; text-align: center;"
          (click)="closeDialog('confirm')">
    Confirm
  </button>
</div>
 
  </div>
 ]

  `,
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  closeDialog(result: string): void {
    this.dialogRef.close(result);
  }}
