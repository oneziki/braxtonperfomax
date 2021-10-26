import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStairwayComponent } from './card-stairway.component';

describe('CardListComponent', () => {
  let component: CardStairwayComponent;
  let fixture: ComponentFixture<CardStairwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardStairwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardStairwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
