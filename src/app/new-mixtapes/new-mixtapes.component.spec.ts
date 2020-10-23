import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMixtapesComponent } from './new-mixtapes.component';

describe('NewMixtapesComponent', () => {
  let component: NewMixtapesComponent;
  let fixture: ComponentFixture<NewMixtapesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMixtapesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMixtapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
