import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SinglesComponent } from './singles.component';

describe('SinglesComponent', () => {
  let component: SinglesComponent;
  let fixture: ComponentFixture<SinglesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
