import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconLegendListComponent } from './icon-legend-list.component';

describe('IconLegendListComponent', () => {
  let component: IconLegendListComponent;
  let fixture: ComponentFixture<IconLegendListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconLegendListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconLegendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
