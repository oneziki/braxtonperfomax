import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMenusPage } from './app-menus.page';

describe('ExpandableListLayout1Page', () => {
  let component: AppMenusPage;
  let fixture: ComponentFixture<AppMenusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppMenusPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMenusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
