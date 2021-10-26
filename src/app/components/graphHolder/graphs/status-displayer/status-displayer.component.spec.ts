import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDisplayerComponent } from './status-displayer.component';

describe('HtmlTableComponent', () => {
  let component: StatusDisplayerComponent;
  let fixture: ComponentFixture<StatusDisplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusDisplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
