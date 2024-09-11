import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpreviewComponent } from './editpreview.component';

describe('EditpreviewComponent', () => {
  let component: EditpreviewComponent;
  let fixture: ComponentFixture<EditpreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditpreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditpreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
