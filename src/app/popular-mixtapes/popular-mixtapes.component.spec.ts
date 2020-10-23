import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularMixtapesComponent } from './popular-mixtapes.component';

describe('PopularMixtapesComponent', () => {
  let component: PopularMixtapesComponent;
  let fixture: ComponentFixture<PopularMixtapesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularMixtapesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularMixtapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
