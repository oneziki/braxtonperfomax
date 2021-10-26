import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowColumnComboComponent } from './arrow-column-combo.component';

describe('CardListComponent', () => {
  let component: ArrowColumnComboComponent;
  let fixture: ComponentFixture<ArrowColumnComboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrowColumnComboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrowColumnComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
