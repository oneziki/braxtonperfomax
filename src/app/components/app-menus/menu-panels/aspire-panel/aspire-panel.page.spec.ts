import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AspirePanelPage } from './aspire-panel.page';

describe('AspirePanelPage', () => {
  let component: AspirePanelPage;
  let fixture: ComponentFixture<AspirePanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspirePanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AspirePanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
