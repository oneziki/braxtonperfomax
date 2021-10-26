import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PdpPage } from './pdp.page';

describe('PdpPage', () => {
  let component: PdpPage;
  let fixture: ComponentFixture<PdpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PdpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
