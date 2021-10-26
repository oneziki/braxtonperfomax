import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTeamPanel } from './app-team-panel.page';

describe('ExpandableListLayout1Page', () => {
  let component: AppTeamPanel;
  let fixture: ComponentFixture<AppTeamPanel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppTeamPanel],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTeamPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
