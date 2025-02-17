import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackegedetailesComponent } from './packegedetailes.component';

describe('PackegedetailesComponent', () => {
  let component: PackegedetailesComponent;
  let fixture: ComponentFixture<PackegedetailesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackegedetailesComponent]
    });
    fixture = TestBed.createComponent(PackegedetailesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
