import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LivePanelPage } from './live-panel.page';

describe('LivePanelPage', () => {
  let component: LivePanelPage;
  let fixture: ComponentFixture<LivePanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivePanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LivePanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
