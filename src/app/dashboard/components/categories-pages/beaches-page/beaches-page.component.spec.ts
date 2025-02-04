import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeachesPageComponent } from './beaches-page.component';

describe('BeachesPageComponent', () => {
  let component: BeachesPageComponent;
  let fixture: ComponentFixture<BeachesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeachesPageComponent]
    });
    fixture = TestBed.createComponent(BeachesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
