import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPersonalPanel } from './app-personal-panel.page';

describe('ExpandableListLayout1Page', () => {
  let component: AppPersonalPanel;
  let fixture: ComponentFixture<AppPersonalPanel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppPersonalPanel],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPersonalPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
