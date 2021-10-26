import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGroupListComponent } from './icon-group-list.component';

describe('CardListComponent', () => {
  let component: IconGroupListComponent;
  let fixture: ComponentFixture<IconGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
