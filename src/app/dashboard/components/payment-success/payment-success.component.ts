// payment-success.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit {
  hotelId!: string | null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId');
  }

  goToHome(): void {
    this.router.navigate(['dashboard/home/hotel-rooms', this.hotelId]);
  }
}
