import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StteperComponent } from './stteper.component';

describe('StteperComponent', () => {
  let component: StteperComponent;
  let fixture: ComponentFixture<StteperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StteperComponent]
    });
    fixture = TestBed.createComponent(StteperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
