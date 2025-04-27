import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-packeges',
  templateUrl: './packeges.component.html',
  styleUrls: ['./packeges.component.scss'],
})
export class PackegesComponent implements OnInit {
  username = localStorage.getItem('userName');
  searchTerm: string = '';
  packages: any[] = [];
  recopackages: any[] = [];
  displayedPackages: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(private _generalService: GeneralService) {}

  ngOnInit(): void {
    this.getAllPackages();
    this.getRecommendedPackages();
    this.setupSearch();
  }

  setupSearch() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim()) {
          this._generalService.searchPackages(query).subscribe({
            next: (response) => {
              this.displayedPackages = response;
              console.log('Search results:', response);
            },
            error: (err) => {
              console.error('Error searching packages:', err);
              this.displayedPackages = this.packages;
            },
          });
        } else {
          this.displayedPackages = this.packages;
        }
      });
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  getAllPackages() {
    this._generalService.getpackges().subscribe({
      next: (response) => {
        this.packages = response;
        this.displayedPackages = response;
        console.log('All packages:', response);
      },
      error: (err) => {
        console.error('Error fetching packages:', err);
      },
    });
  }

  getRecommendedPackages() {
    if (this.username) {
      this._generalService.recommendedPackages(this.username).subscribe({
        next: (response) => {
          this.recopackages = response;
          console.log('Recommended packages:', response);
        },
        error: (err) => {
          console.error('Error fetching recommended packages:', err);
        },
      });
    }
  }
}
