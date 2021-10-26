import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatusDisplayPage } from './status-display.page';

describe('MorrisGraphPage', () => {
  let component: StatusDisplayPage;
  let fixture: ComponentFixture<StatusDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusDisplayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
