import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriosComponent } from './prios.component';

describe('PriosComponent', () => {
  let component: PriosComponent;
  let fixture: ComponentFixture<PriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
