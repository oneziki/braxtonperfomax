import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrowPage } from './grow.page';

describe('GrowPage', () => {
  let component: GrowPage;
  let fixture: ComponentFixture<GrowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
