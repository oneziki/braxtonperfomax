import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDisplayerComponent } from './image-displayer.component';

describe('CardListComponent', () => {
  let component: ImageDisplayerComponent;
  let fixture: ComponentFixture<ImageDisplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDisplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
