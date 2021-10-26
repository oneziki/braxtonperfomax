import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AspirePage } from './aspire.page';

describe('AspirePage', () => {
  let component: AspirePage;
  let fixture: ComponentFixture<AspirePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspirePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AspirePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
