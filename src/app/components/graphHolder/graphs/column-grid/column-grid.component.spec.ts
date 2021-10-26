import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnGridComponent } from './column-grid.component';

describe('ColumnGridComponent', () => {
  let component: ColumnGridComponent;
  let fixture: ComponentFixture<ColumnGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
