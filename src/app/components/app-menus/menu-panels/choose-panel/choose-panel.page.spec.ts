import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChoosePanelPage } from './choose-panel.page';

describe('ChoosePanelPage', () => {
  let component: ChoosePanelPage;
  let fixture: ComponentFixture<ChoosePanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChoosePanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
