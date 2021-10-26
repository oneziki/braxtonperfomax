import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHomePanel } from './app-home-panel.page';

describe('ExpandableListLayout1Page', () => {
  let component: AppHomePanel;
  let fixture: ComponentFixture<AppHomePanel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppHomePanel],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHomePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
