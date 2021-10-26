import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrowPanelPage } from './grow-panel.page';

describe('GrowPanelPage', () => {
  let component: GrowPanelPage;
  let fixture: ComponentFixture<GrowPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowPanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrowPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
