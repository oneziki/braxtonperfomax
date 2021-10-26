import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTableComponent } from './data-table.component';

describe('OverallChartComponent', () => {
  let component: ActionTableComponent;
  let fixture: ComponentFixture<ActionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
