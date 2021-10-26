import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarBenchmarkComponent } from './bar-benchmark.component';

describe('CardListComponent', () => {
  let component: BarBenchmarkComponent;
  let fixture: ComponentFixture<BarBenchmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarBenchmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarBenchmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
