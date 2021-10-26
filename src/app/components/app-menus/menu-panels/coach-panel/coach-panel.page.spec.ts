import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoachPanelPage } from './coach-panel.page';

describe('CoachPanelPage', () => {
  let component: CoachPanelPage;
  let fixture: ComponentFixture<CoachPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachPanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CoachPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
