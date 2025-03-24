import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackegesComponent } from './packeges.component';

describe('PackegesComponent', () => {
  let component: PackegesComponent;
  let fixture: ComponentFixture<PackegesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackegesComponent]
    });
    fixture = TestBed.createComponent(PackegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
